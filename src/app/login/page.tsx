import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Login" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl = "/profile" } = await searchParams;
  return <AuthForm mode="login" callbackUrl={callbackUrl} />;
}
