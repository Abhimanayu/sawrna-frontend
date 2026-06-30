"use server";

import { revalidatePath } from "next/cache";
import { createOrderRecord, getInitialOrderStatus, orderStatuses, saveOrderRecord, updateOrderStatus } from "@/lib/orders";
import { orderSchema } from "@/lib/validations";

export async function createOrderAction(payload: unknown) {
  const parsed = orderSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() };
  }

  const orderId = `SAW-${Date.now().toString(36).toUpperCase()}`;
  const status = getInitialOrderStatus(parsed.data.paymentMethod);
  const order = createOrderRecord(parsed.data, orderId, status);

  const saveResult = await saveOrderRecord(order);
  revalidateOrderViews();
  return { ok: true, orderId, status, persisted: saveResult.persisted, source: saveResult.source };
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "");
  if (!orderId || !orderStatuses.includes(status as (typeof orderStatuses)[number])) return;

  await updateOrderStatus(orderId, status as (typeof orderStatuses)[number]);
  revalidateOrderViews();
}

function revalidateOrderViews() {
  revalidatePath("/admin");
  revalidatePath("/track-order");
  revalidatePath("/order-history");
}
