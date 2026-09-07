"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return <Button className="mt-5 w-full" variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>;
}
