"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const wishlist = useCartStore((state) => state.wishlist);
  const liked = wishlist.includes(product.slug);
  const badge = product.isNew ? "New" : product.isBestSeller ? "Best seller" : product.isTrending ? "Trending" : product.discount ? `${product.discount}% Off` : "";

  return (
    <article className="group gold-edge relative flex h-full flex-col overflow-hidden rounded-[8px] border border-emerald/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,247,244,0.9))] p-1.5 shadow-[0_18px_54px_rgba(4,45,40,0.11)] ring-1 ring-gold/0 transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_30px_78px_rgba(4,45,40,0.18)] hover:ring-gold/20 sm:p-2">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-[6px] border border-gold/18 image-polish p-1">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-white ring-1 ring-inset ring-emerald/8">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover object-top transition duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-x-2 top-2 flex justify-between sm:inset-x-3 sm:top-3">
            {badge && (
              <span className="rounded-full border border-gold/35 bg-emerald/92 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ivory shadow-[0_10px_24px_rgba(4,45,40,0.16)] backdrop-blur sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                {badge}
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleWishlist(product.slug)}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-emerald/10 bg-white/92 text-gold shadow-[0_10px_24px_rgba(4,45,40,0.10)] backdrop-blur transition hover:border-gold/40 hover:bg-ivory hover:text-emerald sm:right-4 sm:top-4 sm:h-9 sm:w-9"
        aria-label="Toggle wishlist"
      >
        <Heart size={17} fill={liked ? "#C8A76A" : "none"} />
      </button>
      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <div className="flex items-center gap-1 text-xs text-muted">
          <Star size={13} fill="#D7AF62" className="text-gold" /> {product.rating} <span>({product.reviews})</span>
        </div>
        <Link href={`/products/${product.slug}`} className="mt-2 block font-display text-lg font-semibold leading-tight text-emerald transition hover:text-gold sm:text-xl">
          {product.name}
        </Link>
        <p className="mt-1 hidden line-clamp-2 text-sm leading-6 text-muted sm:block">{product.shortDescription}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 3).map((color) => (
              <span
                key={color}
                className="h-4 w-4 rounded-full border border-emerald/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]"
                style={{ background: getColorSwatch(color) }}
                title={color}
              />
            ))}
          </div>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-gold sm:inline">SAWRNA edit</span>
        </div>
        <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
          <span className="rounded-full border border-emerald/10 bg-ivory px-2.5 py-1 text-[11px] text-emerald">{product.fabric}</span>
          <span className="rounded-full border border-emerald/10 bg-ivory px-2.5 py-1 text-[11px] text-emerald">{product.sizes.length} sizes</span>
          {product.stock <= 18 && <span className="rounded-full border border-gold/25 bg-white px-2.5 py-1 text-[11px] text-gold">Low stock</span>}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-emerald sm:text-base">{formatPrice(product.salePrice || product.price)}</span>
            {product.salePrice && <span className="text-xs text-muted line-through">{formatPrice(product.price)}</span>}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-9 w-9 border-gold/25 bg-ivory text-emerald hover:border-emerald hover:bg-emerald hover:text-white"
            onClick={() => addItem(product, { size: product.sizes[1] || product.sizes[0], color: product.colors[0] })}
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
          </Button>
        </div>
      </div>
    </article>
  );
}

function getColorSwatch(color: string) {
  const palette: Record<string, string> = {
    "Rani Pink": "#b91b5d",
    "Rose Pink": "#d986a8",
    "Blush Pink": "#e7b7b7",
    Ivory: "#f3ede0",
    Maroon: "#7a1e2a",
    "Navy Blue": "#172d52",
    "Pista Green": "#9eb66b",
    "Indigo Blue": "#253f7a",
    Brown: "#735145",
    Black: "#171716",
  };

  return palette[color] || "#c8a76a";
}
