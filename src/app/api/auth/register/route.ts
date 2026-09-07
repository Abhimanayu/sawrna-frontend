import { NextResponse } from "next/server";
import { z } from "zod";
import { registerUser, UserServiceError } from "@/lib/users";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(80),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters.").max(128),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Check your account details." }, { status: 400 });
  }

  try {
    const user = await registerUser(parsed.data);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof UserServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.code === "DUPLICATE" ? 409 : 503 });
    }
    console.error("SAWRNA registration failed", error);
    return NextResponse.json({ message: "Account creation is temporarily unavailable." }, { status: 500 });
  }
}
