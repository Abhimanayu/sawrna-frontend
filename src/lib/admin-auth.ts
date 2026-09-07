import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const adminCookieName = "sawrna_admin";

export function isAdminAccessConfigured() {
  return Boolean(process.env.ADMIN_ACCESS_TOKEN);
}

export async function hasAdminAccess() {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  if (!expected) return false;
  const cookieStore = await cookies();
  return safeEqual(cookieStore.get(adminCookieName)?.value || "", createAdminSessionValue(expected));
}

export async function setAdminAccessCookie() {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  if (!expected) return false;
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, createAdminSessionValue(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return true;
}

export function isValidAdminToken(token: string) {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  return Boolean(expected && safeEqual(token, expected));
}

function createAdminSessionValue(token: string) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || token;
  return createHmac("sha256", secret).update(`sawrna-admin:${token}`).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function clearAdminAccessCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);
}
