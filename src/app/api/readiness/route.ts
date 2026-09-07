import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/product";

export const dynamic = "force-dynamic";

export async function GET() {
  let databaseConnected = false;
  let activeProducts = 0;
  if (process.env.MONGODB_URI) {
    try {
      const database = await connectDB();
      await database.connection.db?.admin().ping();
      activeProducts = await ProductModel.countDocuments({ status: "active" });
      databaseConnected = true;
    } catch (error) {
      console.error("SAWRNA readiness database check failed", error);
    }
  }
  const checks = {
    mongodb: databaseConnected,
    activeCatalog: activeProducts > 0,
    auth: Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
    cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    commerce: Boolean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && process.env.NEXT_PUBLIC_UPI_ID),
    admin: Boolean(process.env.ADMIN_ACCESS_TOKEN),
    email: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
  };
  const ready = Object.values(checks).every(Boolean);
  return NextResponse.json({ ready, activeProducts, checks }, { status: ready ? 200 : 503 });
}
