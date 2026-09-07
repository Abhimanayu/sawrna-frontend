"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthMode = "login" | "signup" | "forgot" | "reset";

export function AuthForm({ mode, callbackUrl = "/profile", token = "" }: { mode: AuthMode; callbackUrl?: string; token?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const title = isForgot ? "Reset password" : isReset ? "Choose a new password" : isLogin ? "Welcome back" : "Create account";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    try {
      if ((isSignup || isReset) && password !== confirmPassword) throw new Error("Passwords do not match.");

      if (isLogin) {
        const result = await signIn("credentials", { email, password, redirect: false });
        if (!result?.ok) throw new Error("Email or password is incorrect.");
        router.replace(safeCallbackUrl(callbackUrl));
        router.refresh();
        return;
      }

      if (isSignup) {
        await postJson("/api/auth/register", { name, email, password });
        const result = await signIn("credentials", { email, password, redirect: false });
        if (!result?.ok) throw new Error("Account created. Please log in to continue.");
        router.replace(safeCallbackUrl(callbackUrl));
        router.refresh();
        return;
      }

      if (isForgot) {
        const result = await postJson("/api/auth/forgot-password", { email });
        setMessage(result.message || "If an account exists, reset instructions have been sent.");
        return;
      }

      await postJson("/api/auth/reset-password", { token, password });
      setMessage("Password updated. You can now log in.");
      setTimeout(() => router.replace("/login"), 900);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container-lux grid min-h-[70vh] place-items-center py-14">
      <div className="gold-edge w-full max-w-md rounded-[8px] border border-emerald/12 bg-white/88 p-7 shadow-[0_24px_70px_rgba(4,45,40,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">SAWRNA account</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-emerald">{title}</h1>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          {isSignup && <Input required name="name" autoComplete="name" placeholder="Full name" />}
          {!isReset && <Input required name="email" autoComplete="email" placeholder="Email address" type="email" />}
          {!isForgot && <Input required minLength={8} name="password" autoComplete={isLogin ? "current-password" : "new-password"} placeholder="Password" type="password" />}
          {(isSignup || isReset) && <Input required minLength={8} name="confirmPassword" autoComplete="new-password" placeholder="Confirm password" type="password" />}
          <Button type="submit" disabled={busy || (isReset && !token)}>
            {busy ? "Please wait..." : isForgot ? "Send Reset Link" : isReset ? "Update Password" : isLogin ? "Login" : "Create Account"}
          </Button>
        </form>
        {error && <p role="alert" className="mt-5 rounded-[8px] border border-[#a45d43]/25 bg-[#fff3ee] p-4 text-sm text-[#8a4f1f]">{error}</p>}
        {message && <p role="status" className="mt-5 rounded-[8px] border border-gold/25 bg-ivory p-4 text-sm leading-6 text-emerald">{message}</p>}
        {isReset && !token && <p role="alert" className="mt-5 text-sm text-[#8a4f1f]">This reset link is incomplete. Request a new one.</p>}
        <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-muted">
          {!isForgot && !isReset && <Link href="/forgot-password">Forgot password?</Link>}
          <Link href={isLogin ? "/signup" : "/login"} className="hover:text-gold">{isLogin ? "Create account" : "Back to login"}</Link>
        </div>
      </div>
    </section>
  );
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed. Please try again.");
  return data;
}

function safeCallbackUrl(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/profile";
}
