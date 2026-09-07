import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations";
import { NewsletterSubscriberModel } from "@/models/newsletter-subscriber";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ message: "Newsletter signup is being configured. Please try again soon." }, { status: 503 });
  }

  try {
    const parsed = newsletterSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    await connectDB();
    await NewsletterSubscriberModel.updateOne(
      { email: parsed.data.email.toLowerCase() },
      { $set: { status: "subscribed" } },
      { upsert: true },
    );
    return NextResponse.json({ message: "You are on the SAWRNA private list." }, { status: 200 });
  } catch (error) {
    console.error("SAWRNA newsletter signup failed", error);
    return NextResponse.json({ message: "We could not complete signup. Please try again shortly." }, { status: 500 });
  }
}
