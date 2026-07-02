"use client";

import type { ReactNode } from "react";

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div className="sawrna-reveal" style={delay ? { animationDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}
