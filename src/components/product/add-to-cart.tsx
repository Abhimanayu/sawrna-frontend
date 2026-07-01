"use client";

import { useState } from "react";
import { Heart, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function AddToCartPanel({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[1] || product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const selectedPrice = product.salePrice || product.price;

  const addSelectedItem = () => addItem(product, { size, color, qty });
  const openWhatsAppOrder = () => {
    addSelectedItem();
    const message = encodeURIComponent(
      `SAWRNA order request\n\nProduct: ${product.name}\nColor: ${color}\nSize: ${size}\nQty: ${qty}\nTotal: ${formatPrice(selectedPrice * qty)}`,
    );
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="mt-8 space-y-6 pb-24 lg:pb-0">
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
        <Button className="min-w-[180px] flex-1" onClick={addSelectedItem}>
          <ShoppingBag size={17} /> Add to Cart
        </Button>
        <Button variant="outline" className="min-w-[180px] flex-1 border-gold/35" onClick={openWhatsAppOrder}>
          <MessageCircle size={17} /> WhatsApp
        </Button>
        <Button variant="outline" size="icon" onClick={() => toggleWishlist(product.slug)} aria-label="Wishlist">
          <Heart size={18} />
        </Button>
      </div>
      <div className="fixed inset-x-3 bottom-3 z-40 rounded-full border border-emerald/12 bg-white/94 p-2 shadow-[0_18px_54px_rgba(4,45,40,0.18)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
          <div className="min-w-0 pl-3">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.13em] text-gold">{color} / {size}</p>
            <p className="text-sm font-semibold text-emerald">{formatPrice(selectedPrice * qty)}</p>
          </div>
          <Button size="sm" className="h-11 px-4" onClick={addSelectedItem}>
            <ShoppingBag size={15} /> Add
          </Button>
          <Button size="icon" variant="outline" className="h-11 w-11 border-gold/35" onClick={openWhatsAppOrder} aria-label="Order on WhatsApp">
            <MessageCircle size={17} />
          </Button>
        </div>
      </div>
    </div>
  );
}
