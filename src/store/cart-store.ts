"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/products";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  wishlist: string[];
  recentSearches: string[];
  coupon: string | null;
  addItem: (product: Product, options: { size: string; color: string; qty?: number }) => void;
  removeItem: (slug: string, size: string, color: string) => void;
  updateQty: (slug: string, size: string, color: string, qty: number) => void;
  setCoupon: (coupon: string | null) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  addRecentSearch: (query: string) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      wishlist: [],
      recentSearches: [],
      coupon: null,
      addItem: (product, options) =>
        set((state) => {
          const price = product.salePrice || product.price;
          const existing = state.items.find(
            (item) => item.slug === product.slug && item.size === options.size && item.color === options.color,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item === existing ? { ...item, qty: item.qty + (options.qty || 1) } : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                slug: product.slug,
                name: product.name,
                price,
                image: product.images[0],
                size: options.size,
                color: options.color,
                qty: options.qty || 1,
              },
            ],
          };
        }),
      removeItem: (slug, size, color) =>
        set((state) => ({ items: state.items.filter((item) => !(item.slug === slug && item.size === size && item.color === color)) })),
      updateQty: (slug, size, color, qty) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.slug === slug && item.size === size && item.color === color ? { ...item, qty: Math.max(1, qty) } : item,
          ),
        })),
      setCoupon: (coupon) => set({ coupon }),
      clearCart: () => set({ items: [], coupon: null }),
      toggleWishlist: (slug) =>
        set((state) => ({
          wishlist: state.wishlist.includes(slug)
            ? state.wishlist.filter((item) => item !== slug)
            : [...state.wishlist, slug],
        })),
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [query, ...state.recentSearches.filter((item) => item !== query)].slice(0, 6),
        })),
    }),
    { name: "sawrna-cart-v1" },
  ),
);
