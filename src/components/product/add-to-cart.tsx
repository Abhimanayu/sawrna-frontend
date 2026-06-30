"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";

export function AddToCartPanel({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[1] || product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Color</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((item) => (
            <button
              key={item}
              onClick={() => setColor(item)}
              className={`rounded-full border px-4 py-2 text-sm transition ${color === item ? "border-gold/45 bg-emerald text-white shadow-[0_10px_24px_rgba(4,45,40,0.18)]" : "border-emerald/15 bg-white text-emerald hover:border-gold/45 hover:text-gold"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((item) => (
            <button
              key={item}
              onClick={() => setSize(item)}
              className={`grid h-11 w-11 place-items-center rounded-full border text-sm transition ${size === item ? "border-gold/45 bg-emerald text-white shadow-[0_10px_24px_rgba(4,45,40,0.18)]" : "border-emerald/15 bg-white text-emerald hover:border-gold/45 hover:text-gold"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 items-center rounded-full border border-emerald/15 bg-white">
          <button className="grid h-12 w-12 place-items-center" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
            <Minus size={15} />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button className="grid h-12 w-12 place-items-center" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
            <Plus size={15} />
          </button>
        </div>
        <Button className="min-w-[180px] flex-1" onClick={() => addItem(product, { size, color, qty })}>
          <ShoppingBag size={17} /> Add to Cart
        </Button>
        <Button variant="outline" size="icon" onClick={() => toggleWishlist(product.slug)} aria-label="Wishlist">
          <Heart size={18} />
        </Button>
      </div>
    </div>
  );
}
