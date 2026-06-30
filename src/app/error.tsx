"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container-lux grid min-h-[70vh] place-items-center py-20 text-center">
      <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/86 p-7 shadow-[0_20px_60px_rgba(4,45,40,0.09)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Error</p>
        <h1 className="font-display mt-3 text-6xl font-semibold text-emerald">Something needs a refresh.</h1>
        <Button className="mt-8" onClick={reset}>Try Again</Button>
      </div>
    </section>
  );
}
