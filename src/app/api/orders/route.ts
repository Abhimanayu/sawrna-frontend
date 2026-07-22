import { NextResponse } from "next/server";
import { createOrderRecord, getInitialOrderStatus, saveOrderRecord } from "@/lib/orders";
import { orderSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid order payload." }, { status: 400 });
  }

  try {
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Please check the checkout details.", error: parsed.error.flatten() }, { status: 400 });
    }

    const orderId = `SAW-${Date.now().toString(36).toUpperCase()}`;
    const status = getInitialOrderStatus(parsed.data.paymentMethod);
    const order = createOrderRecord(parsed.data, orderId, status);
    const saveResult = await saveOrderRecord(order);

    return NextResponse.json({ orderId, status, persisted: saveResult.persisted, source: saveResult.source }, { status: 201 });
  } catch (error) {
    console.error("SAWRNA order API failed", error);
    return NextResponse.json({ message: "Order service is temporarily unavailable. Please try WhatsApp order or retry." }, { status: 500 });
  }
}
