"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <form
      className="relative grid gap-3 rounded-[8px] border border-white/12 bg-white/8 p-5 backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault();
        if (email.trim()) setJoined(true);
      }}
    >
      <label className="text-sm text-white/68">Join the newsletter for drops, styling notes, and private previews.</label>
      <div className="flex">
        <input
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 min-w-0 flex-1 rounded-l-full border border-white/14 bg-white/92 px-5 text-sm text-emerald outline-none focus:border-gold/50"
          placeholder="Email address"
          type="email"
        />
        <Button type="submit" variant="gold">{joined ? "Joined" : "Join"}</Button>
      </div>
      {joined && <p className="text-xs text-gold">You are on the SAWRNA preview list.</p>}
    </form>
  );
}
