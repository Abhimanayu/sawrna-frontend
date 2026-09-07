"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "We could not send your message.");
      setStatus({ type: "success", message: data.message });
      form.reset();
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "We could not send your message." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="gold-edge grid gap-4 rounded-[8px] border border-emerald/12 bg-white/86 p-6 shadow-[0_22px_70px_rgba(4,45,40,0.1)]"
      onSubmit={submit}
    >
      <Input required name="name" autoComplete="name" minLength={2} maxLength={80} placeholder="Name" />
      <Input required name="email" autoComplete="email" placeholder="Email" type="email" />
      <Input required name="phone" autoComplete="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" placeholder="10-digit mobile number" />
      <Textarea required name="message" minLength={10} maxLength={2000} placeholder="How can we help?" />
      <Button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</Button>
      {status && (
        <p role="status" className={`rounded-[8px] border p-3 text-sm leading-6 ${status.type === "success" ? "border-gold/25 bg-ivory text-emerald" : "border-[#a45d43]/25 bg-[#fff3ee] text-[#8a4f1f]"}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}
