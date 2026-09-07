import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    mongodb: Boolean(process.env.MONGODB_URI),
    nextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
    cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    whatsappNumber: Boolean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    upiId: Boolean(process.env.NEXT_PUBLIC_UPI_ID),
    adminAccessToken: Boolean(process.env.ADMIN_ACCESS_TOKEN),
    transactionalEmail: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
  };
  const critical = [checks.mongodb, checks.nextAuthSecret, checks.cloudinary, checks.whatsappNumber, checks.upiId, checks.adminAccessToken];
  return NextResponse.json({
    ok: true,
    service: "sawrna-frontend",
    siteUrl: siteConfig.url,
    readyForCommerce: critical.every(Boolean),
    checks,
    localFallback: process.env.NODE_ENV !== "production" && !checks.mongodb,
  });
}
