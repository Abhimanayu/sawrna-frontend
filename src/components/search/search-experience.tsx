"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";

export function SearchExperience({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [fabric, setFabric] = useState("All");
  const [size, setSize] = useState("All");
  const [color, setColor] = useState("All");
  const [priceMax, setPriceMax] = useState(2500);
  const [rating, setRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const recentSearches = useCartStore((state) => state.recentSearches);
  const addRecentSearch = useCartStore((state) => state.addRecentSearch);

  const fabrics = ["All", ...Array.from(new Set(products.map((product) => product.fabric)))];
  const sizes = ["All", ...Array.from(new Set(products.flatMap((product) => product.sizes)))];
  const colors = ["All", ...Array.from(new Set(products.flatMap((product) => product.colors)))];
  const results = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery = !q || [product.name, product.shortDescription, product.fabric, product.tags.join(" ")].join(" ").toLowerCase().includes(q);
      const matchesFabric = fabric === "All" || product.fabric === fabric;
      const matchesSize = size === "All" || product.sizes.includes(size);
      const matchesColor = color === "All" || product.colors.includes(color);
      const matchesPrice = (product.salePrice || product.price) <= priceMax;
      const matchesRating = product.rating >= rating;
      const matchesAvailability = !availableOnly || product.stock > 0;
      return matchesQuery && matchesFabric && matchesSize && matchesColor && matchesPrice && matchesRating && matchesAvailability;
    });
    return filtered.sort((a, b) => {
      if (sort === "price-low") return (a.salePrice || a.price) - (b.salePrice || b.price);
      if (sort === "price-high") return (b.salePrice || b.price) - (a.salePrice || a.price);
      if (sort === "discount") return (b.discount || 0) - (a.discount || 0);
      if (sort === "popular") return b.reviews - a.reviews;
      return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
    });
  }, [availableOnly, color, fabric, priceMax, products, query, rating, size, sort]);

  const suggestions = query ? products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : [];

  return (
    <section className="container-lux py-10 lg:py-16">
      <div className="relative overflow-hidden rounded-[8px] border border-white/10 emerald-depth p-6 text-white lg:p-9">
        <div className="absolute inset-0 luxury-texture opacity-60" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Instant search</p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">Find your next short kurti.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">Search by fabric, color, sleeve, finish, or occasion across the SAWRNA short-kurti edit.</p>
        </div>
      </div>
      <div className="gold-edge mt-8 grid gap-4 rounded-[8px] border border-emerald/12 bg-white/86 p-4 shadow-[0_20px_60px_rgba(4,45,40,0.10)] lg:grid-cols-[1fr_220px_200px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => query && addRecentSearch(query)}
            placeholder="Search short kurtis, fabrics, colors"
            className="pl-11"
          />
          {suggestions.length > 0 && (
            <div className="absolute inset-x-0 top-full z-20 mt-2 rounded-[8px] border border-emerald/12 bg-white p-3 shadow-xl">
              {suggestions.map((item) => (
                <button key={item.slug} onMouseDown={() => setQuery(item.name)} className="block w-full rounded-full px-3 py-2 text-left text-sm hover:bg-blush/60">
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <select className="h-12 rounded-full border border-emerald/12 bg-white/88 px-4 text-sm text-emerald outline-none transition focus:border-gold/50" value={fabric} onChange={(event) => setFabric(event.target.value)}>
          {fabrics.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="h-12 rounded-full border border-emerald/12 bg-white/88 px-4 text-sm text-emerald outline-none transition focus:border-gold/50" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="price-low">Price low-high</option>
          <option value="price-high">Price high-low</option>
          <option value="discount">Discount</option>
        </select>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <select className="h-11 rounded-full border border-emerald/12 bg-white/86 px-3 text-sm text-emerald outline-none transition focus:border-gold/50" value={size} onChange={(event) => setSize(event.target.value)}>
          {sizes.map((item) => <option key={item}>{item === "All" ? "All sizes" : item}</option>)}
        </select>
        <select className="h-11 rounded-full border border-emerald/12 bg-white/86 px-3 text-sm text-emerald outline-none transition focus:border-gold/50" value={color} onChange={(event) => setColor(event.target.value)}>
          {colors.map((item) => <option key={item}>{item === "All" ? "All colors" : item}</option>)}
        </select>
        <label className="flex h-11 items-center gap-3 rounded-full border border-emerald/12 bg-white/86 px-3 text-sm text-muted">
          <span>Under</span>
          <input type="range" min="800" max="2500" step="100" value={priceMax} onChange={(event) => setPriceMax(Number(event.target.value))} className="luxury-range min-w-0 flex-1 accent-gold" />
          <span>Rs. {priceMax}</span>
        </label>
        <select className="h-11 rounded-full border border-emerald/12 bg-white/86 px-3 text-sm text-emerald outline-none transition focus:border-gold/50" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
          <option value="0">All ratings</option>
          <option value="4.6">4.6+ rating</option>
          <option value="4.8">4.8+ rating</option>
        </select>
        <label className="flex h-11 items-center gap-3 rounded-full border border-emerald/12 bg-white/86 px-3 text-sm text-emerald">
          <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} className="accent-gold" />
          In stock only
        </label>
      </div>
      {recentSearches.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {recentSearches.map((item) => (
            <button key={item} onClick={() => setQuery(item)} className="rounded-full border border-emerald/12 bg-white px-3 py-1 text-xs text-muted hover:border-gold/40 hover:text-gold">
              {item}
            </button>
          ))}
        </div>
      )}
      <div className="mt-10">
        <ProductGrid products={results} priority />
      </div>
    </section>
  );
}
