import { NextResponse } from "next/server";
import { z } from "zod";
import { requestPasswordReset, UserServiceError } from "@/lib/users";

const requestSchema = z.object({ email: z.string().trim().email() });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });

  try {
    const result = await requestPasswordReset(parsed.data.email);
    return NextResponse.json({
      message: "If an account exists, password reset instructions have been sent.",
      developmentResetUrl: result.developmentResetUrl,
    });
  } catch (error) {
    if (error instanceof UserServiceError && error.code === "CONFIG") {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }
    console.error("SAWRNA password reset request failed", error);
    return NextResponse.json({ message: "Password reset is temporarily unavailable." }, { status: 500 });
  }
}
