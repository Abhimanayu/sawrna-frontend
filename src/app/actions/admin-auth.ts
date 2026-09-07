"use server";

import { redirect } from "next/navigation";
import { clearAdminAccessCookie, isValidAdminToken, setAdminAccessCookie } from "@/lib/admin-auth";

export async function adminLoginAction(formData: FormData) {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  const token = String(formData.get("token") || "").trim();

  if (!expected) redirect("/admin?setup=required");
  if (!isValidAdminToken(token)) redirect("/admin?error=invalid");

  await setAdminAccessCookie();
  redirect("/admin");
}

export async function adminLogoutAction() {
  await clearAdminAccessCookie();
  redirect("/admin");
}
