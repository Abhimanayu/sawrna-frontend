"use client";

import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";

export function WishlistClient({ products }: { products: Product[] }) {
  const wishlist = useCartStore((state) => state.wishlist);
  const selected = products.filter((product) => wishlist.includes(product.slug));

  return (
    <section className="container-lux py-12">
      <h1 className="font-display text-5xl font-semibold text-emerald">Wishlist</h1>
      <p className="mt-3 text-muted">Your saved SAWRNA pieces.</p>
      <div className="mt-10">{selected.length ? <ProductGrid products={selected} /> : <p className="text-muted">No saved products yet.</p>}</div>
    </section>
  );
}
