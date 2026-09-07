import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Signup" };
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl = "/profile" } = await searchParams;
  return <AuthForm mode="signup" callbackUrl={callbackUrl} />;
}
