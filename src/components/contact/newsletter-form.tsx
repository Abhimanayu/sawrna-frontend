"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "We could not complete signup.");
      setStatus({ type: "success", message: data.message });
      setEmail("");
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "We could not complete signup." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="relative grid gap-3 rounded-[8px] border border-white/12 bg-white/8 p-5 backdrop-blur"
      onSubmit={submit}
    >
      <label className="text-sm text-white/68">Join the newsletter for drops, styling notes, and private previews.</label>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-0">
        <input
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 min-w-0 w-full rounded-full border border-white/14 bg-white/92 px-5 text-sm text-emerald outline-none focus:border-gold/50 sm:rounded-r-none"
          placeholder="Email address"
          type="email"
        />
        <Button type="submit" variant="gold" className="w-full sm:w-auto sm:rounded-l-none" disabled={submitting}>{submitting ? "Joining..." : "Join"}</Button>
      </div>
      {status && <p role="status" className={`text-xs ${status.type === "success" ? "text-gold" : "text-[#f3b8a4]"}`}>{status.message}</p>}
    </form>
  );
}
