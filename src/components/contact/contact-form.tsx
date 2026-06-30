"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="gold-edge grid gap-4 rounded-[8px] border border-emerald/12 bg-white/86 p-6 shadow-[0_22px_70px_rgba(4,45,40,0.1)]"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <Input required placeholder="Name" />
      <Input required placeholder="Email" type="email" />
      <Input required placeholder="Phone" />
      <Textarea required placeholder="Message" />
      <Button type="submit">{sent ? "Message Received" : "Send Message"}</Button>
      {sent && (
        <p className="rounded-[8px] border border-gold/25 bg-ivory p-3 text-sm leading-6 text-emerald">
          Preview message saved on screen. Production can connect this to email, WhatsApp, or CRM.
        </p>
      )}
    </form>
  );
}
