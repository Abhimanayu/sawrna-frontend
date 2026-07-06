"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { getAvailableSizes, getColorStock, getFirstAvailableColor, getFirstAvailableSize, getVariantStock } from "@/lib/product-variants";
import { useCartStore } from "@/store/cart-store";

type AddToCartPanelProps = {
  product: Product;
  color?: string;
  onColorChange?: (color: string) => void;
};

export function AddToCartPanel({ product, color: controlledColor, onColorChange }: AddToCartPanelProps) {
  const [internalColor, setInternalColor] = useState(() => getFirstAvailableColor(product));
  const color = controlledColor ?? internalColor;
  const [size, setSize] = useState(() => getFirstAvailableSize(product, color));
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const availableSizes = useMemo(() => getAvailableSizes(product, color), [color, product]);
  const selectedStock = useMemo(() => (size ? getVariantStock(product, color, size) : 0), [color, product, size]);
  const selectedColorStock = useMemo(() => getColorStock(product, color), [color, product]);
  const canAddToCart = Boolean(size) && selectedStock > 0;

  useEffect(() => {
    if (!availableSizes.includes(size)) {
      setSize(getFirstAvailableSize(product, color));
      setQty(1);
    }
  }, [availableSizes, color, product, size]);

  useEffect(() => {
    if (selectedStock <= 0 && qty !== 1) setQty(1);
    if (selectedStock > 0 && qty > selectedStock) setQty(selectedStock);
  }, [qty, selectedStock]);

  function handleColorChange(nextColor: string) {
    if (controlledColor === undefined) setInternalColor(nextColor);
    onColorChange?.(nextColor);
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Color</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleColorChange(item)}
              disabled={getColorStock(product, item) === 0}
              className={`rounded-full border px-4 py-2 text-sm transition ${color === item ? "border-gold/45 bg-emerald text-white shadow-[0_10px_24px_rgba(4,45,40,0.18)]" : "border-emerald/15 bg-white text-emerald hover:border-gold/45 hover:text-gold"} ${getColorStock(product, item) === 0 ? "cursor-not-allowed opacity-45" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          {product.colors.length > 1 ? `${product.colors.length} colour options available in this article.` : "Signature single-colour article."}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSize(item)}
              disabled={getVariantStock(product, color, item) === 0}
              className={`grid h-11 w-11 place-items-center rounded-full border text-sm transition ${size === item ? "border-gold/45 bg-emerald text-white shadow-[0_10px_24px_rgba(4,45,40,0.18)]" : "border-emerald/15 bg-white text-emerald hover:border-gold/45 hover:text-gold"} ${getVariantStock(product, color, item) === 0 ? "cursor-not-allowed border-emerald/8 bg-ivory text-muted/60 line-through opacity-65 hover:border-emerald/8 hover:text-muted/60" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          {selectedColorStock <= 0
            ? `${color} is currently sold out.`
            : canAddToCart
              ? `${selectedStock} piece${selectedStock === 1 ? "" : "s"} left in ${size}.`
              : `Choose from ${availableSizes.join(", ")} in ${color}.`}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 items-center rounded-full border border-emerald/15 bg-white">
          <button type="button" className="grid h-12 w-12 place-items-center" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
            <Minus size={15} />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            className="grid h-12 w-12 place-items-center"
            onClick={() => setQty((current) => (selectedStock > 0 ? Math.min(selectedStock, current + 1) : current))}
            aria-label="Increase quantity"
            disabled={selectedStock <= 0 || qty >= selectedStock}
          >
            <Plus size={15} />
          </button>
        </div>
        <Button className="min-w-[180px] flex-1" onClick={() => addItem(product, { size, color, qty })} disabled={!canAddToCart}>
          <ShoppingBag size={17} /> {canAddToCart ? "Add to Bag" : "Unavailable"}
        </Button>
        <Button variant="outline" size="icon" onClick={() => toggleWishlist(product.slug)} aria-label="Wishlist">
          <Heart size={18} />
        </Button>
      </div>
    </div>
  );
}
