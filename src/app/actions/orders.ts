"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { getServerSession } from "next-auth";
import { hasAdminAccess } from "@/lib/admin-auth";
import { authOptions } from "@/lib/auth";
import { createVerifiedOrderRecord, orderStatuses, saveOrderRecord, updateOrderStatus } from "@/lib/orders";
import { checkoutOrderSchema } from "@/lib/validations";
import { sendOrderStatusNotification } from "@/lib/notifications";

export async function createOrderAction(payload: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) return { ok: false, error: "Authentication required." };
  const parsed = checkoutOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() };
  }

  const order = await createVerifiedOrderRecord(parsed.data, { id: session.user.id, email: session.user.email });

  const saveResult = await saveOrderRecord(order);
  revalidateOrderViews();
  return { ok: true, orderId: order.orderId, status: order.status, persisted: saveResult.persisted, source: saveResult.source };
}

export async function updateOrderStatusAction(formData: FormData) {
  if (!(await hasAdminAccess())) return;
  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "");
  if (!orderId || !orderStatuses.includes(status as (typeof orderStatuses)[number])) return;

  const order = await updateOrderStatus(orderId, status as (typeof orderStatuses)[number]);
  if (order) after(() => sendOrderStatusNotification(order));
  revalidateOrderViews();
}

function revalidateOrderViews() {
  revalidatePath("/admin");
  revalidatePath("/track-order");
  revalidatePath("/order-history");
}
