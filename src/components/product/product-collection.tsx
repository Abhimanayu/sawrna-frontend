"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronDown, Gem, PackageCheck, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

const sortOptions = [
  ["newest", "Newest"],
  ["popular", "Popular"],
  ["price-low", "Price low-high"],
  ["price-high", "Price high-low"],
  ["discount", "Discount"],
] as const;

const styleOptions = ["All", "Sleeveless", "Bell sleeves", "Wrap", "Peplum", "Straight", "Angrakha", "Lace-up"];
const occasionOptions = ["All", "Daily wear", "Work wear", "Party wear", "Summer"];
const detailOptions = ["All", "Floral", "Printed", "Lace trim", "Mirror work", "Tassel", "Pom-pom", "Embroidered", "Solid"];
const ratingOptions = ["All", "4.5+", "4.7+", "4.8+"];
const highlightOptions = ["All", "New arrivals", "Best sellers", "Trending"];

const optionTokens: Record<string, string[]> = {
  "Bell sleeves": ["bell"],
  "Lace trim": ["lace", "lace-trim"],
  "Mirror work": ["mirror", "mirror-work"],
  "Pom-pom": ["pom", "pom-pom"],
  "Daily wear": ["daily", "daily-wear"],
  "Work wear": ["work", "work-wear"],
  "Party wear": ["party", "party-wear"],
  "Lace-up": ["lace-up", "lace up"],
};

export function ProductCollection({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sort, setSort] = useState<(typeof sortOptions)[number][0]>(() => readSort(searchParams.get("sort")));
  const [fabric, setFabric] = useState(() => searchParams.get("fabric") || "All");
  const [size, setSize] = useState(() => searchParams.get("size") || "All");
  const [color, setColor] = useState(() => searchParams.get("color") || "All");
  const [priceMax, setPriceMax] = useState(() => readPriceMax(searchParams.get("max")));
  const [availability, setAvailability] = useState("All");
  const [style, setStyle] = useState("All");
  const [occasion, setOccasion] = useState("All");
  const [detail, setDetail] = useState("All");
  const [rating, setRating] = useState("All");
  const [highlight, setHighlight] = useState(() => readHighlight(searchParams));
  const [discountOnly, setDiscountOnly] = useState(() => searchParams.get("discount") === "true");

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const fabrics = ["All", ...Array.from(new Set(products.map((product) => product.fabric)))];
  const sizes = ["All", ...Array.from(new Set(products.flatMap((product) => product.sizes)))];
  const colors = ["All", ...Array.from(new Set(products.flatMap((product) => product.colors)))];
  const collectionMarks = [
    [Gem, "Premium fabrics", "Fabrics"],
    [PackageCheck, "Ready stock", "Stock"],
    [ShieldCheck, "Secure checkout", "Secure"],
  ] as const;

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const price = product.salePrice || product.price;
      const minimumRating = rating === "All" ? 0 : Number(rating.replace("+", ""));
      return (
        (fabric === "All" || product.fabric === fabric) &&
        (size === "All" || product.sizes.includes(size)) &&
        (color === "All" || product.colors.includes(color)) &&
        (availability === "All" || product.stock > 0) &&
        (style === "All" || matchesProductOption(product, style)) &&
        (occasion === "All" || matchesProductOption(product, occasion)) &&
        (detail === "All" || matchesProductOption(product, detail)) &&
        (highlight === "All" || matchesHighlight(product, highlight)) &&
        (!discountOnly || Boolean(product.discount)) &&
        product.rating >= minimumRating &&
        price <= priceMax
      );
    });

    return result.sort((a, b) => {
      if (sort === "price-low") return (a.salePrice || a.price) - (b.salePrice || b.price);
      if (sort === "price-high") return (b.salePrice || b.price) - (a.salePrice || a.price);
      if (sort === "discount") return (b.discount || 0) - (a.discount || 0);
      if (sort === "popular") return b.reviews - a.reviews;
      return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
    });
  }, [availability, color, detail, discountOnly, fabric, highlight, occasion, priceMax, products, rating, size, sort, style]);

  const activeChips = [
    fabric !== "All" && fabric,
    size !== "All" && `Size ${size}`,
    color !== "All" && color,
    availability !== "All" && availability,
    style !== "All" && style,
    occasion !== "All" && occasion,
    detail !== "All" && detail,
    rating !== "All" && `${rating} rating`,
    highlight !== "All" && highlight,
    discountOnly && "Discount only",
    priceMax < 2500 && `Under ${formatPrice(priceMax)}`,
  ].filter(Boolean) as string[];

  const clearFilters = () => {
    setFabric("All");
    setSize("All");
    setColor("All");
    setPriceMax(2500);
    setAvailability("All");
    setStyle("All");
    setOccasion("All");
    setDetail("All");
    setRating("All");
    setHighlight("All");
    setDiscountOnly(false);
  };

  const filterPanel = (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Curate</p>
          <h2 className="font-display mt-1 text-3xl font-semibold text-emerald">Filters</h2>
        </div>
        {activeChips.length > 0 && (
          <button className="text-xs font-semibold uppercase tracking-[0.16em] text-muted transition hover:text-gold" onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-4">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald">Price</p>
            <span className="text-sm text-muted">{formatPrice(priceMax)}</span>
          </div>
          <input
            type="range"
            min="800"
            max="2500"
            step="100"
            value={priceMax}
            onChange={(event) => setPriceMax(Number(event.target.value))}
            className="luxury-range mt-4 w-full accent-gold"
          />
          <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.12em] text-muted">
            <span>Rs. 800</span>
            <span>Rs. 2500</span>
          </div>
        </div>
        <FilterSelect label="Size" value={size} options={sizes} onChange={setSize} />
        <FilterSelect label="Color" value={color} options={colors} onChange={setColor} />
        <FilterSelect label="Fabric" value={fabric} options={fabrics} onChange={setFabric} />
        <FilterSelect label="Availability" value={availability} options={["All", "In stock"]} onChange={setAvailability} />
      </div>

      <FilterGroup title="More filters" defaultOpen={false}>
        <FilterSelect label="Style" value={style} options={styleOptions} onChange={setStyle} />
        <FilterSelect label="Occasion" value={occasion} options={occasionOptions} onChange={setOccasion} />
        <FilterSelect label="Details" value={detail} options={detailOptions} onChange={setDetail} />
        <FilterSelect label="Rating" value={rating} options={ratingOptions} onChange={setRating} />
      </FilterGroup>

      <FilterGroup title="Quick edits" defaultOpen>
        <ChipGroup
          value={highlight}
          onChange={setHighlight}
          options={highlightOptions}
        />
        <button
          className={`mt-1 rounded-full border px-4 py-2 text-left text-sm transition ${discountOnly ? "border-gold/45 bg-emerald text-white" : "border-emerald/12 bg-white text-emerald hover:border-gold/45"}`}
          onClick={() => setDiscountOnly((value) => !value)}
          type="button"
        >
          Discount only
        </button>
      </FilterGroup>
    </div>
  );

  return (
    <section className="container-lux pb-24 pt-8 lg:pb-16 lg:pt-12">
      <div className="relative mb-8 overflow-hidden rounded-[8px] border border-white/10 emerald-depth p-6 text-white lg:p-9">
        <div className="absolute inset-0 luxury-texture opacity-60" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Collection</p>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-[0.96] text-white sm:text-5xl lg:text-7xl">
              Premium short kurtis, softly styled.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
              A focused SAWRNA edit of denim-friendly short kurtis with refined prints, breathable fabrics, and polished feminine details.
            </p>
          </div>
          <div className="grid gap-3 rounded-[8px] border border-white/12 bg-white/8 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/62">Available pieces</span>
              <span className="font-display text-4xl font-semibold text-gold">{filtered.length}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white/58">
              <span className="rounded-full border border-white/10 px-2 py-2">New</span>
              <span className="rounded-full border border-white/10 px-2 py-2">Printed</span>
              <span className="rounded-full border border-white/10 px-2 py-2">COD</span>
            </div>
          </div>
        </div>
        <div className="relative mt-5 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-3">
          {collectionMarks.map(([Icon, label, shortLabel]) => (
            <div key={label} className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-white/12 bg-white/8 px-2 py-3 text-center text-xs text-white/76 backdrop-blur sm:flex-row sm:justify-start sm:gap-3 sm:rounded-full sm:px-4 sm:text-sm">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-gold">
                <Icon size={16} />
              </span>
              <span className="font-medium sm:hidden">{shortLabel}</span>
              <span className="hidden font-medium sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[302px_1fr]">
        <aside className="gold-edge sticky top-32 hidden h-fit rounded-[8px] border border-emerald/12 bg-white/86 p-6 premium-shadow lg:block">
          {filterPanel}
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-4 rounded-[8px] border border-emerald/12 bg-white/76 p-4 shadow-[0_16px_42px_rgba(4,45,40,0.08)] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Browse edit</p>
              <p className="mt-1 text-sm text-muted">
                Showing <span className="font-semibold text-emerald">{filtered.length}</span> of {products.length} curated pieces
              </p>
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              {activeChips.length > 0 && <ActiveChips chips={activeChips} onClear={clearFilters} />}
              <SortSelect sort={sort} onSortChange={setSort} />
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-emerald/12 bg-white/82 p-4 shadow-[0_14px_38px_rgba(4,45,40,0.07)] lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Refine</p>
                <p className="mt-1 text-sm text-muted">{filtered.length} pieces ready to browse</p>
              </div>
              <Button variant="outline" className="h-11 shrink-0 px-4" onClick={() => setDrawerOpen(true)}>
                <SlidersHorizontal size={16} /> Filters {activeChips.length ? `(${activeChips.length})` : ""}
              </Button>
            </div>
            <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
              {highlightOptions.slice(1).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${highlight === option ? "border-gold/45 bg-emerald text-white" : "border-emerald/12 bg-ivory text-emerald"}`}
                  onClick={() => setHighlight(highlight === option ? "All" : option)}
                >
                  {option}
                </button>
              ))}
              <button
                type="button"
                className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${discountOnly ? "border-gold/45 bg-emerald text-white" : "border-emerald/12 bg-ivory text-emerald"}`}
                onClick={() => setDiscountOnly((value) => !value)}
              >
                Discount
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="lg:hidden">
              {activeChips.length > 0 && <ActiveChips chips={activeChips} onClear={clearFilters} />}
            </div>
          </div>

          <div className="mt-8">
            {filtered.length ? (
              <ProductGrid products={filtered} priority />
            ) : (
              <div className="rounded-[8px] border border-emerald/12 bg-white/78 p-10 text-center shadow-[0_18px_54px_rgba(4,45,40,0.08)]">
                <h2 className="font-display text-4xl text-emerald">No pieces found.</h2>
                <p className="mt-3 text-muted">Try clearing one filter to see more of the SAWRNA edit.</p>
                <Button className="mt-6" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-[1fr_1fr] gap-2 rounded-full border border-emerald/12 bg-white/92 p-2 shadow-[0_18px_54px_rgba(4,45,40,0.16)] backdrop-blur lg:hidden">
        <Button variant="outline" className="h-12" onClick={() => setDrawerOpen(true)}>
          <SlidersHorizontal size={17} /> Filter {activeChips.length ? `(${activeChips.length})` : ""}
        </Button>
        <label className="relative">
          <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={16} />
          <select
            className="h-12 w-full rounded-full border border-emerald/12 bg-ivory pl-10 pr-4 text-xs font-semibold uppercase tracking-[0.12em] text-emerald outline-none"
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
            aria-label="Sort products"
          >
            {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/35 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[8px] border border-emerald/12 bg-ivory p-5 pb-0 shadow-[0_-24px_80px_rgba(4,45,40,0.18)]">
            <div className="sticky -top-5 z-10 mb-5 flex items-center justify-between border-b border-emerald/10 bg-ivory/95 py-4 backdrop-blur">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Refine Collection</p>
                <p className="mt-1 text-sm text-muted">{filtered.length} matching pieces</p>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-emerald/12 bg-white text-emerald" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            {filterPanel}
            <div className="sticky bottom-0 -mx-5 mt-8 border-t border-emerald/10 bg-ivory/95 p-5 backdrop-blur">
              <Button className="w-full" onClick={() => setDrawerOpen(false)}>Show {filtered.length} Pieces</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SortSelect({ sort, onSortChange }: { sort: (typeof sortOptions)[number][0]; onSortChange: (sort: (typeof sortOptions)[number][0]) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-full border border-emerald/12 bg-white/88 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald shadow-sm">
      <ArrowUpDown size={16} className="text-gold" />
      <select className="bg-transparent outline-none" value={sort} onChange={(event) => onSortChange(event.target.value as typeof sort)}>
        {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
  );
}

function FilterGroup({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details className="group rounded-[8px] border border-emerald/10 bg-ivory/70 p-4" open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-emerald">
        {title}
        <ChevronDown size={16} className="text-gold transition group-open:rotate-180" />
      </summary>
      <div className="mt-4 grid gap-4">{children}</div>
    </details>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string | number; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald">{label}</span>
      <select
        className="h-11 rounded-full border border-emerald/12 bg-white/88 px-4 text-sm text-emerald shadow-sm outline-none transition focus:border-gold/50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ChipGroup({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${value === option ? "border-gold/45 bg-emerald text-white" : "border-emerald/12 bg-white text-emerald hover:border-gold/45"}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ActiveChips({ chips, onClear }: { chips: string[]; onClear: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full border border-gold/25 bg-ivory px-3 py-1 text-xs text-emerald">{chip}</span>
      ))}
      <button className="text-xs font-semibold uppercase tracking-[0.16em] text-muted transition hover:text-gold" onClick={onClear}>
        Clear all
      </button>
    </div>
  );
}

function readSort(value: string | null): (typeof sortOptions)[number][0] {
  return sortOptions.some(([option]) => option === value) ? (value as (typeof sortOptions)[number][0]) : "newest";
}

function readOption(value: string | null, options: string[]) {
  return value && options.includes(value) ? value : "All";
}

function readPriceMax(value: string | null) {
  const next = Number(value);
  return Number.isFinite(next) && next >= 800 && next <= 2500 ? next : 2500;
}

function readHighlight(searchParams: ReturnType<typeof useSearchParams>) {
  const highlight = readOption(searchParams.get("highlight"), highlightOptions);
  if (highlight !== "All") return highlight;
  const tag = searchParams.get("tag");
  if (tag === "best-seller") return "Best sellers";
  if (tag === "new-arrival") return "New arrivals";
  if (tag === "trending") return "Trending";
  return "All";
}

function matchesProductOption(product: Product, option: string) {
  const haystack = [
    product.name,
    product.tags.join(" "),
    product.specifications.Fit,
    product.specifications.Sleeve,
    product.specifications.Neckline,
  ].join(" ").toLowerCase();
  const tokens = optionTokens[option] || [option.toLowerCase()];
  return tokens.some((token) => haystack.includes(token.toLowerCase()));
}

function matchesHighlight(product: Product, highlight: string) {
  if (highlight === "New arrivals") return Boolean(product.isNew);
  if (highlight === "Best sellers") return Boolean(product.isBestSeller);
  if (highlight === "Trending") return Boolean(product.isTrending);
  return true;
}
