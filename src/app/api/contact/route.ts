import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { contactMessageSchema } from "@/lib/validations";
import { CustomerMessageModel } from "@/models/customer-message";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ message: "Customer care is being configured. Please contact us on WhatsApp." }, { status: 503 });
  }

  try {
    const parsed = contactMessageSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Check the form details and try again." }, { status: 400 });
    }

    await connectDB();
    await CustomerMessageModel.create(parsed.data);
    return NextResponse.json({ message: "Thank you. The SAWRNA care team has received your message." }, { status: 201 });
  } catch (error) {
    console.error("SAWRNA contact message failed", error);
    return NextResponse.json({ message: "We could not send your message. Please try again shortly." }, { status: 500 });
  }
}
