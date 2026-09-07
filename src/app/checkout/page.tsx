import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = { title: "Checkout", description: "Complete your SAWRNA order." };

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) redirect("/login?callbackUrl=/checkout");
  return <CheckoutClient customer={{ name: session.user.name || "", email: session.user.email }} />;
}
