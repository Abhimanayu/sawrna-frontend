import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { connectDB } from "@/lib/db";
import { siteConfig } from "@/lib/config";
import { UserModel } from "@/models/user";

const passwordRounds = 12;

export class UserServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "CONFIG" | "DUPLICATE" | "INVALID" | "EXPIRED",
  ) {
    super(message);
  }
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  ensureDatabaseConfigured();
  await connectDB();
  const email = normalizeEmail(input.email);
  const existing = await UserModel.exists({ email });
  if (existing) throw new UserServiceError("An account already exists for this email.", "DUPLICATE");

  const passwordHash = await hash(input.password, passwordRounds);
  const user = await UserModel.create({ name: input.name.trim(), email, passwordHash });
  return { id: String(user._id), name: user.name, email: user.email };
}

export async function authenticateUser(emailValue: string, password: string) {
  if (!process.env.MONGODB_URI) return null;
  await connectDB();
  const email = normalizeEmail(emailValue);
  const user = await UserModel.findOne({ email }).select("+passwordHash");
  if (!user?.passwordHash || !(await compare(password, user.passwordHash))) return null;
  return { id: String(user._id), name: user.name, email: user.email };
}

export async function requestPasswordReset(emailValue: string) {
  ensureDatabaseConfigured();
  await connectDB();
  const email = normalizeEmail(emailValue);
  const user = await UserModel.findOne({ email });
  if (!user) return { accepted: true, delivered: true };

  const token = randomBytes(32).toString("hex");
  user.resetPasswordTokenHash = tokenDigest(token);
  user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();

  const resetUrl = `${siteConfig.url}/reset-password?token=${encodeURIComponent(token)}`;
  const delivered = await sendResetEmail(user.email, user.name, resetUrl);
  if (!delivered && process.env.NODE_ENV !== "production") {
    console.info(`SAWRNA development password reset: ${resetUrl}`);
    return { accepted: true, delivered: false, developmentResetUrl: resetUrl };
  }
  return { accepted: true, delivered };
}

export async function resetUserPassword(token: string, password: string) {
  ensureDatabaseConfigured();
  await connectDB();
  const user = await UserModel.findOne({
    resetPasswordTokenHash: tokenDigest(token),
    resetPasswordExpiresAt: { $gt: new Date() },
  }).select("+resetPasswordTokenHash +resetPasswordExpiresAt +passwordHash");
  if (!user) throw new UserServiceError("This reset link is invalid or has expired.", "EXPIRED");

  user.passwordHash = await hash(password, passwordRounds);
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();
}

function ensureDatabaseConfigured() {
  if (!process.env.MONGODB_URI) {
    throw new UserServiceError("Customer accounts are being configured. Please try again shortly.", "CONFIG");
  }
}

function tokenDigest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function sendResetEmail(email: string, name: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Reset your SAWRNA password",
      html: `<p>Hello ${escapeHtml(name)},</p><p>Use the secure link below to reset your SAWRNA password. It expires in 30 minutes.</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
    }),
  });
  return response.ok;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
