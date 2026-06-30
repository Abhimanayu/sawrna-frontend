import { WishlistClient } from "@/components/product/wishlist-client";
import { getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const products = await getCatalogProducts();
  return <WishlistClient products={products} />;
}
