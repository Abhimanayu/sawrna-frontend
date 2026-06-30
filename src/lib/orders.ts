import { hasMongoConfig } from "@/lib/catalog";
import { connectDB } from "@/lib/db";
import { readLocalOrders, saveLocalOrder, updateLocalOrder } from "@/lib/local-order-store";
import type { orderSchema } from "@/lib/validations";
import { OrderModel } from "@/models/order";
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
export type OrderPayload = z.infer<typeof orderSchema>;
export type OrderRecord = {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: OrderPayload["items"];
  total: number;
  coupon?: string;
  paymentMethod: OrderPayload["paymentMethod"];
  upiScreenshot?: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; note: string; at: string }[];
  createdAt: string;
  updatedAt: string;
};

export function getInitialOrderStatus(paymentMethod: OrderPayload["paymentMethod"]): OrderStatus {
  return paymentMethod === "upi" ? "Payment Verification Pending" : "Pending";
}

export function createOrderRecord(payload: OrderPayload, orderId: string, status = getInitialOrderStatus(payload.paymentMethod)): OrderRecord {
  const now = new Date().toISOString();
  return {
    orderId,
    customer: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      pincode: payload.pincode,
    },
    items: payload.items,
    total: payload.total,
    coupon: payload.coupon,
    paymentMethod: payload.paymentMethod,
    upiScreenshot: payload.upiScreenshot,
    status,
    statusHistory: [{ status, note: "Order received", at: now }],
    createdAt: now,
    updatedAt: now,
  };
}

export async function saveOrderRecord(order: OrderRecord) {
  if (!hasMongoConfig()) {
    await saveLocalOrder(order);
    return { persisted: true, source: "local" as const };
  }

  try {
    await connectDB();
    await OrderModel.create({
      orderId: order.orderId,
      customer: order.customer,
      items: order.items,
      total: order.total,
      coupon: order.coupon,
      paymentMethod: order.paymentMethod,
      upiScreenshot: order.upiScreenshot,
      status: order.status,
      statusHistory: order.statusHistory.map(({ status, note, at }) => ({ status, note, at: new Date(at) })),
    });
    return { persisted: true, source: "database" as const };
  } catch (error) {
    console.error("SAWRNA order database save failed", error);
    await saveLocalOrder(order);
    return { persisted: true, source: "local" as const };
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

export async function findOrderByLookup(lookup: string) {
  const normalized = lookup.trim().toLowerCase();
  if (!normalized) return null;
  const { orders } = await getOrdersSnapshot();
  return (
    orders.find((order) => order.orderId.toLowerCase() === normalized) ||
    orders.find((order) => order.customer.phone.replace(/\D/g, "").endsWith(normalized.replace(/\D/g, ""))) ||
    orders.find((order) => order.customer.email.toLowerCase() === normalized) ||
    null
  );
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note = "Status updated from admin preview") {
  const now = new Date().toISOString();

  if (!hasMongoConfig()) {
    const { orders } = await getOrdersSnapshot();
    const order = orders.find((item) => item.orderId === orderId);
    if (!order) return;
    await updateLocalOrder(orderId, {
      ...order,
      status,
      updatedAt: now,
      statusHistory: [...order.statusHistory, { status, note, at: now }],
    });
    return;
  }

  try {
    await connectDB();
    await OrderModel.updateOne(
      { orderId },
      { $set: { status }, $push: { statusHistory: { status, note, at: new Date(now) } } },
    );
  } catch (error) {
    console.error("SAWRNA order status update failed", error);
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
    customer: {
      name: doc.customer?.name || "SAWRNA Customer",
      email: doc.customer?.email || "care@sawrna.com",
      phone: doc.customer?.phone || "9999999999",
      address: doc.customer?.address || "Preview address",
      city: doc.customer?.city || "Preview city",
      pincode: doc.customer?.pincode || "000000",
    },
    items: Array.isArray(doc.items) ? doc.items : [],
    total: Number(doc.total || 0),
    coupon: doc.coupon,
    paymentMethod: doc.paymentMethod || "cod",
    upiScreenshot: doc.upiScreenshot,
    status,
    statusHistory: normalizeHistory(doc.statusHistory, status),
    createdAt: toIso(doc.createdAt, now),
    updatedAt: toIso(doc.updatedAt, now),
  };
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
