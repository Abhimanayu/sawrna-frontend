"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Ruler, Share2, ShieldCheck, Star, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AddToCartPanel } from "@/components/product/add-to-cart";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/products";
import { getFirstAvailableColor } from "@/lib/product-variants";
import { formatPrice } from "@/lib/utils";

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const defaultGallery = useMemo(
    () => Array.from(new Set([...(product.gallery.length ? product.gallery : product.images), ...product.images])),
    [product.gallery, product.images],
  );
  const [selectedColor, setSelectedColor] = useState(() => getFirstAvailableColor(product));
  const gallery = useMemo(() => {
    const colorGallery = product.variantMedia?.find((entry) => entry.color === selectedColor)?.images || [];
    return Array.from(new Set([...(colorGallery.length ? colorGallery : defaultGallery), ...defaultGallery]));
  }, [defaultGallery, product.variantMedia, selectedColor]);
  const [selected, setSelected] = useState(gallery[0]);
  const resolvedSelected = gallery.includes(selected) ? selected : gallery[0];
  const [shareLabel, setShareLabel] = useState("Share");
  const [purchaseOptionsVisible, setPurchaseOptionsVisible] = useState(false);
  const trustItems: [LucideIcon, string][] = [
    [Truck, "Fast dispatch"],
    [ShieldCheck, "Secure payment"],
    [Ruler, "XS-XXL sizes"],
  ];

  useEffect(() => {
    const purchaseOptions = document.getElementById("purchase-options");
    if (!purchaseOptions) return;
    const observer = new IntersectionObserver(([entry]) => setPurchaseOptionsVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(purchaseOptions);
    return () => observer.disconnect();
  }, []);

  async function shareProduct() {
    const shareData = { title: product.name, text: product.shortDescription, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setShareLabel("Link copied");
      window.setTimeout(() => setShareLabel("Share"), 1800);
    } catch {
      setShareLabel("Share");
    }
  }

  return (
    <section className="container-lux py-5 lg:py-14">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,0.94fr)] lg:gap-10">
        <div className="min-w-0 lg:sticky lg:top-28 lg:h-fit">
          <div className="gold-edge relative overflow-hidden rounded-[8px] border border-gold/20 bg-emerald p-2 shadow-[0_28px_86px_rgba(4,45,40,0.22)] ring-1 ring-gold/10">
            <div className="absolute inset-0 luxury-texture opacity-50" />
            <div className="relative aspect-[5/6] overflow-hidden rounded-[6px] bg-ivory lg:aspect-[4/5]">
              <Image
                src={resolvedSelected}
                alt={`${product.name} in ${selectedColor}`}
                fill
                priority
                className="object-contain object-center transition duration-700"
                sizes="(max-width: 1024px) 100vw, 54vw"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
          </div>

          <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:gap-3">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelected(image)}
                className={`relative aspect-[3/4] w-[68px] shrink-0 overflow-hidden rounded-[8px] border bg-white transition sm:w-auto ${resolvedSelected === image ? "border-gold shadow-[0_12px_30px_rgba(4,45,40,0.12)]" : "border-emerald/12 opacity-78 hover:border-gold/45 hover:opacity-100"}`}
                aria-label={`View ${product.name} image ${index + 1}`}
              >
                <Image src={image} alt="" fill className="object-cover object-top" sizes="96px" />
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/88 p-5 premium-shadow lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">{product.fabric}</p>
            <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.02] text-emerald sm:text-5xl lg:text-6xl">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-ivory px-3 py-1">
                <Star size={15} fill="#D7AF62" className="text-gold" /> {product.rating} rating
              </span>
              <span>{product.reviews} reviews</span>
              <span>{product.stock} in stock</span>
              {product.colors.length > 1 && <span>{product.colors.length} colour options</span>}
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-semibold text-emerald">{formatPrice(product.salePrice || product.price)}</span>
              {product.salePrice && <span className="text-muted line-through">{formatPrice(product.price)}</span>}
              {product.discount && <span className="rounded-full border border-gold/30 bg-ivory px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold">{product.discount}% off</span>}
            </div>

            <p className="mt-6 leading-8 text-muted">{product.description}</p>
            <AddToCartPanel product={product} color={selectedColor} onColorChange={setSelectedColor} />

            <div className="mt-8 grid gap-3 border-y border-emerald/10 py-5 sm:grid-cols-3">
              {trustItems.map(([Icon, label]) => (
                <div key={String(label)} className="flex items-center gap-3 rounded-full border border-emerald/10 bg-ivory/80 px-3 py-2 text-sm font-medium text-emerald">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald text-gold">
                    <Icon size={17} />
                  </span>
                  {label}
                </div>
              ))}
            </div>

            <button type="button" onClick={shareProduct} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald transition hover:text-gold">
              <Share2 size={16} /> {shareLabel}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoPanel title="Details" items={product.features} />
            <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/82 p-5 shadow-[0_14px_38px_rgba(4,45,40,0.07)]">
              <h2 className="font-display text-3xl font-semibold text-emerald">Specifications</h2>
              <div className="mt-4 grid gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 border-b border-emerald/10 py-2">
                    <span className="text-muted">{key}</span>
                    <span className="text-right font-medium text-emerald">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20 rounded-[8px] border border-emerald/12 ivory-texture p-5 shadow-[0_18px_60px_rgba(4,45,40,0.08)] lg:p-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">You may also like</p>
            <h2 className="font-display mt-3 text-5xl font-semibold text-emerald">Related pieces</h2>
          </div>
        </div>
        <ProductGrid products={related} />
      </section>

      {!purchaseOptionsVisible && (
        <div className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-full border border-gold/25 bg-white/94 p-2 pl-5 shadow-[0_18px_54px_rgba(4,45,40,0.18)] backdrop-blur lg:hidden">
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">Your selection</span>
            <span className="block text-sm font-semibold text-emerald">{formatPrice(product.salePrice || product.price)}</span>
          </span>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full bg-emerald px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white"
            onClick={() => document.getElementById("purchase-options")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Choose Size
          </button>
        </div>
      )}
    </section>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/82 p-5 shadow-[0_14px_38px_rgba(4,45,40,0.07)]">
      <h2 className="font-display text-3xl font-semibold text-emerald">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-emerald">
            <span className="text-gold">-</span> {item}
          </p>
        ))}
      </div>
    </div>
  );
}
