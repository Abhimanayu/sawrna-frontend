"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { CustomerStateSync } from "@/components/providers/customer-state-sync";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CustomerStateSync />
      {children}
    </SessionProvider>
  );
}
