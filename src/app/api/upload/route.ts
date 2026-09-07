import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { hasAdminAccess } from "@/lib/admin-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  return NextResponse.json({
    ready: hasCloudinaryConfig(),
    service: "cloudinary",
  });
}

export async function POST(request: Request) {
  if (!hasCloudinaryConfig()) {
    return NextResponse.json({ message: "Cloudinary environment variables are not configured." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const requestedFolder = String(formData.get("folder") || "sawrna/uploads");
    const paymentUpload = requestedFolder === "sawrna/payments";
    const session = paymentUpload ? await getServerSession(authOptions) : null;
    if (paymentUpload ? !session?.user?.id : !(await hasAdminAccess())) {
      return NextResponse.json({ message: "Authentication required for this upload." }, { status: 401 });
    }
    const folder = paymentUpload ? "sawrna/payments" : "sawrna/products";

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Upload requires a file field." }, { status: 400 });
    }
    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) {
      return NextResponse.json({ message: "Upload a JPG, PNG, or WebP image." }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "Image must be smaller than 5 MB." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type || "application/octet-stream"};base64,${bytes.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error("SAWRNA upload failed", error);
    return NextResponse.json({ message: "Upload failed. Please retry with a smaller image." }, { status: 500 });
  }
}

function hasCloudinaryConfig() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}
