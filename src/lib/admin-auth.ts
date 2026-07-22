import { cookies } from "next/headers";

const adminCookieName = "sawrna_admin";

export function isAdminAccessConfigured() {
  return Boolean(process.env.ADMIN_ACCESS_TOKEN);
}

export async function hasAdminAccess() {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  if (!expected) return false;
  const cookieStore = await cookies();
  return cookieStore.get(adminCookieName)?.value === expected;
}

export async function setAdminAccessCookie() {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  if (!expected) return false;
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  return true;
}

export async function clearAdminAccessCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);
}
