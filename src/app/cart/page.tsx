import type { Metadata } from "next";
import { CartClient } from "@/components/cart/cart-client";

export const metadata: Metadata = { title: "Cart", description: "Review your SAWRNA shopping bag." };

export default function CartPage() {
  return <CartClient />;
}
