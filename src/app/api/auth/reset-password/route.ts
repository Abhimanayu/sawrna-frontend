import { NextResponse } from "next/server";
import { z } from "zod";
import { resetUserPassword, UserServiceError } from "@/lib/users";

const resetSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(8, "Use at least 8 characters.").max(128),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid reset request." }, { status: 400 });

  try {
    await resetUserPassword(parsed.data.token, parsed.data.password);
    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    if (error instanceof UserServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.code === "EXPIRED" ? 400 : 503 });
    }
    console.error("SAWRNA password reset failed", error);
    return NextResponse.json({ message: "Password reset is temporarily unavailable." }, { status: 500 });
  }
}
