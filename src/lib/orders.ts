import { randomBytes } from "crypto";
import { hasMongoConfig } from "@/lib/catalog";
import { connectDB } from "@/lib/db";
import { getCouponBenefit, normalizeCoupon } from "@/lib/coupons";
import { getCatalogProducts } from "@/lib/catalog";
import { readLocalOrders, saveLocalOrder, updateLocalOrder } from "@/lib/local-order-store";
import { getVariantStock } from "@/lib/product-variants";
import type { checkoutOrderSchema } from "@/lib/validations";
import { OrderModel } from "@/models/order";
import { ProductModel } from "@/models/product";
import type { z } from "zod";

export const orderStatuses = [
  "Pending",
  "Payment Verification Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Failed",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];
export type CheckoutOrderPayload = z.infer<typeof checkoutOrderSchema>;
export type VerifiedOrderItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
};
export type OrderRecord = {
  orderId: string;
  userId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: VerifiedOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: string;
  paymentMethod: CheckoutOrderPayload["paymentMethod"];
  upiScreenshot?: string;
  stockRestored: boolean;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; note: string; at: string }[];
  createdAt: string;
  updatedAt: string;
};

export class OrderServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "CONFIG" | "CATALOG" | "STOCK" | "PAYMENT",
  ) {
    super(message);
  }
}

export function getInitialOrderStatus(paymentMethod: CheckoutOrderPayload["paymentMethod"]): OrderStatus {
  return paymentMethod === "upi" ? "Payment Verification Pending" : "Pending";
}

export async function createVerifiedOrderRecord(payload: CheckoutOrderPayload, identity: { id: string; email: string }) {
  if (process.env.NODE_ENV === "production" && !hasMongoConfig()) {
    throw new OrderServiceError("Online ordering is being configured. Please use WhatsApp support for now.", "CONFIG");
  }
  if (payload.email.trim().toLowerCase() !== identity.email.trim().toLowerCase()) {
    throw new OrderServiceError("Checkout email must match the signed-in account.", "PAYMENT");
  }
  if (payload.paymentMethod === "upi" && !payload.upiScreenshot) {
    throw new OrderServiceError("Upload the UPI payment screenshot before placing the order.", "PAYMENT");
  }

  const catalog = await getCatalogProducts({ fallbackToSeed: process.env.NODE_ENV !== "production" });
  const productBySlug = new Map(catalog.map((product) => [product.slug, product]));
  const consolidated = new Map<string, CheckoutOrderPayload["items"][number]>();
  for (const item of payload.items) {
    const key = `${item.slug}::${item.color}::${item.size}`;
    const current = consolidated.get(key);
    consolidated.set(key, current ? { ...current, qty: current.qty + item.qty } : item);
  }

  const items: VerifiedOrderItem[] = [];
  for (const requested of consolidated.values()) {
    const product = productBySlug.get(requested.slug);
    if (!product || product.status !== "active") throw new OrderServiceError("A selected product is no longer available.", "CATALOG");
    if (!product.colors.includes(requested.color) || !product.sizes.includes(requested.size)) {
      throw new OrderServiceError(`Selected options are unavailable for ${product.name}.`, "CATALOG");
    }
    const available = getVariantStock(product, requested.color, requested.size);
    if (requested.qty > available) throw new OrderServiceError(`Only ${available} piece(s) remain for ${product.name}.`, "STOCK");
    items.push({
      slug: product.slug,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.variantMedia?.find((entry) => entry.color === requested.color)?.images[0] || product.images[0],
      size: requested.size,
      color: requested.color,
      qty: requested.qty,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingBeforeCoupon = subtotal > 4999 ? 0 : 199;
  const coupon = normalizeCoupon(payload.coupon);
  const benefit = getCouponBenefit(coupon, subtotal, shippingBeforeCoupon);
  const discount = benefit.valid ? benefit.discount + benefit.shippingDiscount : 0;
  const shipping = Math.max(0, shippingBeforeCoupon - (benefit.valid ? benefit.shippingDiscount : 0));
  const total = Math.max(0, subtotal + shipping - (benefit.valid ? benefit.discount : 0));
  const status = getInitialOrderStatus(payload.paymentMethod);
  const now = new Date().toISOString();
  const order: OrderRecord = {
    orderId: createOrderId(),
    userId: identity.id,
    customer: {
      name: payload.name,
      email: identity.email,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      pincode: payload.pincode,
    },
    items,
    subtotal,
    shipping,
    discount,
    total,
    coupon: benefit.valid ? benefit.code : undefined,
    paymentMethod: payload.paymentMethod,
    upiScreenshot: payload.upiScreenshot,
    stockRestored: false,
    status,
    statusHistory: [{ status, note: "Order received", at: now }],
    createdAt: now,
    updatedAt: now,
  };
  return order;
}

export async function saveOrderRecord(order: OrderRecord) {
  if (!hasMongoConfig()) {
    await saveLocalOrder(order);
    return { persisted: true, source: "local" as const };
  }

  const database = await connectDB();
  const session = await database.startSession();
  try {
    await session.withTransaction(async () => {
      for (const item of order.items) {
        const result = await ProductModel.updateOne(
          {
            slug: item.slug,
            status: "active",
            stock: { $gte: item.qty },
            variants: { $elemMatch: { color: item.color, size: item.size, stock: { $gte: item.qty } } },
          },
          { $inc: { stock: -item.qty, "variants.$[variant].stock": -item.qty } },
          { session, arrayFilters: [{ "variant.color": item.color, "variant.size": item.size, "variant.stock": { $gte: item.qty } }] },
        );
        if (result.modifiedCount !== 1) throw new OrderServiceError(`Stock changed for ${item.name}. Please review your bag.`, "STOCK");
      }

      await OrderModel.create([toDatabaseOrder(order)], { session });
    });
    return { persisted: true, source: "database" as const };
  } finally {
    await session.endSession();
  }
}

export async function getOrdersSnapshot() {
  if (!hasMongoConfig()) {
    return { orders: await readLocalOrders(), source: "local" as const, databaseConnected: false };
  }

  try {
    await connectDB();
    const docs = await OrderModel.find({}).sort({ createdAt: -1 }).lean<OrderDocument[]>();
    return { orders: docs.map(toOrderRecord), source: "database" as const, databaseConnected: true };
  } catch (error) {
    console.error("SAWRNA order database read failed", error);
    return { orders: await readLocalOrders(), source: "local" as const, databaseConnected: false };
  }
}

export async function getCustomerOrders(userId: string, email: string) {
  if (!hasMongoConfig()) {
    const orders = await readLocalOrders();
    return orders.filter((order) => order.userId === userId || order.customer.email.toLowerCase() === email.toLowerCase());
  }
  await connectDB();
  const docs = await OrderModel.find({ $or: [{ userId }, { "customer.email": email.toLowerCase() }] }).sort({ createdAt: -1 }).lean<OrderDocument[]>();
  return docs.map(toOrderRecord);
}

export async function findOrderByLookup(orderIdValue: string, contactValue: string) {
  const orderId = orderIdValue.trim().toUpperCase();
  const contact = contactValue.trim().toLowerCase();
  if (!orderId || !contact) return null;
  const normalizedPhone = contact.replace(/\D/g, "");

  if (hasMongoConfig()) {
    await connectDB();
    const contactQuery = contact.includes("@")
      ? { "customer.email": contact }
      : { "customer.phone": normalizedPhone };
    const doc = await OrderModel.findOne({ orderId, ...contactQuery }).lean<OrderDocument>();
    return doc ? toOrderRecord(doc) : null;
  }

  const orders = await readLocalOrders();
  return orders.find((order) => order.orderId === orderId && (
    order.customer.email.toLowerCase() === contact || order.customer.phone.replace(/\D/g, "") === normalizedPhone
  )) || null;
}

export async function findOrderById(orderIdValue: string) {
  const orderId = orderIdValue.trim().toUpperCase();
  if (!orderId) return null;
  if (hasMongoConfig()) {
    await connectDB();
    const doc = await OrderModel.findOne({ orderId }).lean<OrderDocument>();
    return doc ? toOrderRecord(doc) : null;
  }
  const orders = await readLocalOrders();
  return orders.find((order) => order.orderId === orderId) || null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note = "Status updated from admin preview") {
  const now = new Date().toISOString();
  const terminalStatuses: OrderStatus[] = ["Cancelled", "Failed"];

  if (!hasMongoConfig()) {
    const { orders } = await getOrdersSnapshot();
    const order = orders.find((item) => item.orderId === orderId);
    if (!order) return;
    if (order.status === status || terminalStatuses.includes(order.status)) return order;
    await updateLocalOrder(orderId, {
      ...order,
      status,
      stockRestored: order.stockRestored || terminalStatuses.includes(status),
      updatedAt: now,
      statusHistory: [...order.statusHistory, { status, note, at: now }],
    });
    return { ...order, status, updatedAt: now };
  }

  const database = await connectDB();
  const session = await database.startSession();
  try {
    let updated: OrderRecord | undefined;
    await session.withTransaction(async () => {
      const doc = await OrderModel.findOne({ orderId }).session(session);
      if (!doc || doc.status === status || terminalStatuses.includes(doc.status as OrderStatus)) return;

      if (terminalStatuses.includes(status) && !doc.stockRestored) {
        for (const item of doc.items) {
          await ProductModel.updateOne(
            { slug: item.slug },
            { $inc: { stock: item.qty, "variants.$[variant].stock": item.qty } },
            { session, arrayFilters: [{ "variant.color": item.color, "variant.size": item.size }] },
          );
        }
        doc.stockRestored = true;
      }
      doc.status = status;
      doc.statusHistory.push({ status, note, at: new Date(now) });
      await doc.save({ session });
      updated = toOrderRecord(doc.toObject() as OrderDocument);
    });
    return updated;
  } finally {
    await session.endSession();
  }
}

type OrderDocument = Partial<OrderRecord> & {
  createdAt?: Date | string;
  updatedAt?: Date | string;
  statusHistory?: { status?: string; note?: string; at?: Date | string }[];
};

function toOrderRecord(doc: OrderDocument): OrderRecord {
  const now = new Date().toISOString();
  const status = normalizeStatus(doc.status);
  return {
    orderId: doc.orderId || "SAW-PREVIEW",
    userId: doc.userId || "",
    customer: {
      name: doc.customer?.name || "SAWRNA Customer",
      email: doc.customer?.email || "care@sawrna.com",
      phone: doc.customer?.phone || "9999999999",
      address: doc.customer?.address || "Preview address",
      city: doc.customer?.city || "Preview city",
      pincode: doc.customer?.pincode || "000000",
    },
    items: Array.isArray(doc.items) ? doc.items : [],
    subtotal: Number(doc.subtotal || doc.total || 0),
    shipping: Number(doc.shipping || 0),
    discount: Number(doc.discount || 0),
    total: Number(doc.total || 0),
    coupon: doc.coupon,
    paymentMethod: doc.paymentMethod || "cod",
    upiScreenshot: doc.upiScreenshot,
    stockRestored: Boolean(doc.stockRestored),
    status,
    statusHistory: normalizeHistory(doc.statusHistory, status),
    createdAt: toIso(doc.createdAt, now),
    updatedAt: toIso(doc.updatedAt, now),
  };
}

function toDatabaseOrder(order: OrderRecord) {
  return {
    ...order,
    statusHistory: order.statusHistory.map(({ status, note, at }) => ({ status, note, at: new Date(at) })),
  };
}

function createOrderId() {
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `SAW-${Date.now().toString(36).toUpperCase()}-${random}`;
}

function normalizeHistory(history: OrderDocument["statusHistory"], status: OrderStatus) {
  if (!Array.isArray(history) || !history.length) {
    return [{ status, note: "Order received", at: new Date().toISOString() }];
  }
  return history.map((entry) => ({
    status: normalizeStatus(entry.status),
    note: entry.note || "Status updated",
    at: toIso(entry.at, new Date().toISOString()),
  }));
}

function normalizeStatus(value: unknown): OrderStatus {
  return orderStatuses.includes(value as OrderStatus) ? (value as OrderStatus) : "Pending";
}

function toIso(value: Date | string | undefined, fallback: string) {
  if (!value) return fallback;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
