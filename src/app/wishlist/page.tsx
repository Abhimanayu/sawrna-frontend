import type { Metadata } from "next";
import { WishlistClient } from "@/components/product/wishlist-client";
import { getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Save and revisit your favorite SAWRNA premium short kurtis.",
};

export default async function WishlistPage() {
  const products = await getCatalogProducts();
  return <WishlistClient products={products} />;
}
