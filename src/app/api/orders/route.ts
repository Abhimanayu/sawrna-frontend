import { NextResponse } from "next/server";
import { createOrderRecord, getInitialOrderStatus, saveOrderRecord } from "@/lib/orders";
import { orderSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const orderId = `SAW-${Date.now().toString(36).toUpperCase()}`;
  const status = getInitialOrderStatus(parsed.data.paymentMethod);
  const order = createOrderRecord(parsed.data, orderId, status);
  const saveResult = await saveOrderRecord(order);

  return NextResponse.json({ orderId, status, persisted: saveResult.persisted, source: saveResult.source });
}
