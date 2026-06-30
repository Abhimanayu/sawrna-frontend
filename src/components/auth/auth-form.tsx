"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const [submitted, setSubmitted] = useState(false);
  const isLogin = mode === "login";
  const isForgot = mode === "forgot";
  const title = isForgot ? "Reset password" : isLogin ? "Welcome back" : "Create account";

  return (
    <section className="container-lux grid min-h-[70vh] place-items-center py-14">
      <div className="gold-edge w-full max-w-md rounded-[8px] border border-emerald/12 bg-white/88 p-7 shadow-[0_24px_70px_rgba(4,45,40,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">SAWRNA account</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-emerald">{title}</h1>
        <form
          className="mt-8 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          {!isLogin && !isForgot && <Input placeholder="Full name" />}
          <Input required placeholder="Email address" type="email" />
          {!isForgot && <Input required placeholder="Password" type="password" />}
          <Button type="submit">{submitted ? "Done" : isForgot ? "Send Reset Link" : isLogin ? "Login" : "Signup"}</Button>
        </form>
        {submitted && (
          <div className="mt-5 rounded-[8px] border border-gold/25 bg-ivory p-4 text-sm leading-6 text-emerald">
            {isForgot
              ? "Preview reset link generated. Production email delivery can be connected later."
              : "Preview account flow complete. Continue to profile, wishlist, or checkout."}
            {!isForgot && (
              <Button asChild className="mt-4 w-full" variant="outline"><Link href="/profile">Open Profile</Link></Button>
            )}
          </div>
        )}
        <div className="mt-5 flex justify-between text-sm text-muted">
          {!isForgot && <Link href="/forgot-password">Forgot password?</Link>}
          <Link href={isLogin ? "/signup" : "/login"} className="hover:text-gold">{isLogin ? "Create account" : "Login instead"}</Link>
        </div>
      </div>
    </section>
  );
}
