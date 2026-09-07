import { NextResponse } from "next/server";
import { after } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createVerifiedOrderRecord, OrderServiceError, saveOrderRecord } from "@/lib/orders";
import { checkoutOrderSchema } from "@/lib/validations";
import { sendOrderConfirmation } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ message: "Please log in before placing your order." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid order payload." }, { status: 400 });
  }

  try {
    const parsed = checkoutOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Please check the checkout details.", error: parsed.error.flatten() }, { status: 400 });
    }

    const order = await createVerifiedOrderRecord(parsed.data, { id: session.user.id, email: session.user.email });
    const saveResult = await saveOrderRecord(order);
    after(() => sendOrderConfirmation(order));

    return NextResponse.json({ orderId: order.orderId, status: order.status, total: order.total, persisted: saveResult.persisted, source: saveResult.source }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderServiceError) {
      const status = error.code === "CONFIG" ? 503 : error.code === "STOCK" ? 409 : 400;
      return NextResponse.json({ message: error.message }, { status });
    }
    console.error("SAWRNA order API failed", error);
    return NextResponse.json({ message: "Order service is temporarily unavailable. Please try WhatsApp order or retry." }, { status: 500 });
  }
}
