import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { CustomerStateModel } from "@/models/customer-state";

const customerStateSchema = z.object({
  cart: z.array(z.object({
    slug: z.string().trim().min(1).max(160),
    name: z.string().trim().min(1).max(160),
    price: z.number().nonnegative().max(1_000_000),
    image: z.string().trim().min(1).max(1000),
    size: z.string().trim().min(1).max(20),
    color: z.string().trim().min(1).max(80),
    qty: z.number().int().min(1).max(10),
  })).max(50),
  wishlist: z.array(z.string().trim().min(1).max(160)).max(100),
  coupon: z.string().trim().max(32).nullable(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await getAccess();
  if (access.response) return access.response;
  await connectDB();
  const state = await CustomerStateModel.findOne({ userId: access.userId }).lean<{
    cart?: unknown[];
    wishlist?: string[];
    coupon?: string | null;
  }>();
  return NextResponse.json({
    cart: state?.cart || [],
    wishlist: state?.wishlist || [],
    coupon: state?.coupon || null,
  });
}

export async function PUT(request: Request) {
  const access = await getAccess();
  if (access.response) return access.response;
  const body = await request.json().catch(() => null);
  const parsed = customerStateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid bag data." }, { status: 400 });

  await connectDB();
  await CustomerStateModel.updateOne(
    { userId: access.userId },
    { $set: parsed.data },
    { upsert: true, runValidators: true },
  );
  return NextResponse.json({ saved: true });
}

async function getAccess(): Promise<{ userId: string; response?: never } | { userId?: never; response: NextResponse }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { response: NextResponse.json({ message: "Authentication required." }, { status: 401 }) };
  }
  if (!process.env.MONGODB_URI) {
    return { response: NextResponse.json({ message: "Customer sync is not configured." }, { status: 503 }) };
  }
  return { userId: session.user.id };
}
