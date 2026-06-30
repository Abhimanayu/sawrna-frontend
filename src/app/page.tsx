import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShieldCheck, Truck, Gem, SlidersHorizontal, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NewsletterForm } from "@/components/contact/newsletter-form";
import { Reveal } from "@/components/motion/reveal";
import { ProductGrid } from "@/components/product/product-grid";
import { getCatalogProducts } from "@/lib/catalog";
import type { Product } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getCatalogProducts();
  const newArrivals = products.filter((product) => product.isNew);
  const handpicked = products.filter((product) => product.tags.includes("handpicked")).concat(products.slice(0, 2)).slice(0, 4);
  const premium = products.filter((product) => product.tags.includes("premium"));
  const trending = products.filter((product) => product.isTrending);
  const bestSellers = products.filter((product) => product.isBestSeller);
  const heroFeatures: [LucideIcon, string, string][] = [
    [Gem, "Premium fabrics", "Carefully selected for comfort and style"],
    [Heart, "Timeless designs", "Thoughtful details for everyday elegance"],
    [Truck, "Easy returns", "Hassle-free returns within 7 days"],
    [ShieldCheck, "Support", "We're here to help you, always"],
  ];
  const reasons: [LucideIcon, string, string][] = [
    [Gem, "Premium fabrics", "Cotton, rayon, muslin, modal and slub fabrics selected for easy drape."],
    [Heart, "Feminine details", "Lace trims, tiny tassels, florals, soft tones, and polished necklines."],
    [Truck, "Trusted delivery", "Fast dispatch, order tracking, and COD support across India."],
    [ShieldCheck, "Secure checkout", "Manual UPI verification, WhatsApp order, and payment-link workflows."],
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[#f6efe4] text-emerald">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff8ee_0%,#f6efe4_52%,#ecdfca_100%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-[50.5%] overflow-hidden rounded-tl-[240px] border-l border-gold/45 bg-emerald lg:block">
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(246,239,228,0.2)_0%,rgba(246,239,228,0)_18%),linear-gradient(180deg,rgba(4,45,40,0)_72%,rgba(4,45,40,0.18)_100%)]" />
          <div className="absolute left-0 top-0 z-20 h-[300px] w-[300px] rounded-tl-[240px] border-l border-t border-gold/70" />
          <Image
            src="/hero/sawrna-luxury-short-kurti-hero.jpg"
            alt="SAWRNA luxury short kurti hero editorial"
            fill
            priority
            className="object-cover object-[86%_center]"
            sizes="51vw"
          />
        </div>
        <div className="container-lux relative grid min-h-[calc(100svh-8.75rem)] items-center py-10 lg:min-h-[650px] lg:grid-cols-[0.52fr_0.48fr] lg:py-10 xl:min-h-[700px]">
          <Reveal>
            <div className="max-w-2xl py-6 lg:py-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-white/62 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold shadow-[0_12px_30px_rgba(4,45,40,0.08)]">
                <Sparkles size={14} /> Premium Apparel
              </p>
              <h1 className="font-display mt-6 max-w-[720px] font-semibold leading-[0.88] text-emerald">
                <span className="block text-[clamp(3.75rem,14vw,7.25rem)]">SAWRNA</span>
                <span className="block text-[clamp(2.45rem,10.5vw,6.05rem)]">Signature Collection</span>
              </h1>
              <div className="my-6 flex max-w-lg items-center gap-4 text-gold">
                <span className="h-px flex-1 bg-gold/65" />
                <Gem size={18} />
                <span className="h-px flex-1 bg-gold/65" />
              </div>
              <p className="max-w-xl text-lg leading-8 text-muted">
                Discover contemporary fashion, graceful designs, and premium essentials created to elevate your wardrobe
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-emerald px-8 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_44px_rgba(4,45,40,0.2)] transition hover:-translate-y-0.5 hover:bg-[#021f1b]">
                  Shop Collection <ArrowRight size={18} />
                </Link>
                <Link href="#lookbook" className="inline-flex h-14 items-center justify-center rounded-full border border-gold/55 bg-white/62 px-8 text-sm font-semibold uppercase tracking-[0.14em] text-emerald transition hover:-translate-y-0.5 hover:border-emerald/40 hover:bg-white">
                  View Lookbook
                </Link>
              </div>
              <div className="mt-8 overflow-hidden rounded-[8px] border border-gold/25 bg-white/70 p-1 shadow-[0_22px_70px_rgba(4,45,40,0.12)] lg:hidden">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[6px] bg-emerald">
                  <Image
                    src="/hero/sawrna-luxury-short-kurti-hero.jpg"
                    alt="SAWRNA premium short kurti editorial"
                    fill
                    className="object-contain object-center"
                    sizes="100vw"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="container-lux relative z-20 pb-0 lg:-mt-11">
          <div className="grid gap-4 rounded-[14px] border border-gold/20 bg-[#fffaf2]/92 p-4 shadow-[0_22px_70px_rgba(4,45,40,0.14)] backdrop-blur md:grid-cols-4 lg:p-5">
            {heroFeatures.map(([Icon, title, text]) => (
              <div key={title} className="flex gap-4 border-emerald/12 md:border-r md:pr-4 md:last:border-r-0">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e8dac0] text-emerald">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-emerald">{title}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted">{text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 -mt-8 bg-emerald pb-5 pt-14 text-white">
          <div className="container-lux flex items-center justify-center gap-4 text-center text-xs font-semibold uppercase tracking-[0.28em] text-white/86">
            <Sparkles size={15} className="shrink-0 text-gold" />
            <span>Discover effortless style. Own your moment.</span>
            <Sparkles size={15} className="shrink-0 text-gold" />
          </div>
        </div>
      </section>

      <ShopByEdit products={products} />
      <ProductSection eyebrow="New arrivals" title="Fresh short kurtis for the week." products={newArrivals} />
      <ProductSection eyebrow="Handpicked collection" title="Soft pieces for denim days." products={handpicked} tone="sage" />
      <ProductSection eyebrow="Premium collection" title="Feminine details, premium finish." products={premium} />
      <ProductSection eyebrow="Trending products" title="Most-loved SAWRNA picks." products={trending} tone="sage" />
      <ProductSection eyebrow="Best sellers" title="SAWRNA favorites." products={bestSellers} />

      <section className="relative overflow-hidden border-y border-white/10 bg-emerald py-16 text-white lg:py-20">
        <div className="absolute inset-0 luxury-texture opacity-70" />
        <div className="container-lux">
        <Reveal>
          <div className="relative mb-9 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Why SAWRNA</p>
            <h2 className="font-display mt-3 text-5xl font-semibold text-white lg:text-6xl">Premium details without the heavy feeling.</h2>
          </div>
          <div className="relative grid gap-5 md:grid-cols-4">
            {reasons.map(([Icon, title, text]) => (
              <div key={String(title)} className="gold-edge rounded-[8px] border border-white/12 bg-white/8 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-gold">
                  <Icon size={21} />
                </span>
                <h3 className="font-display mt-5 text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/66">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
        </div>
      </section>

      <section id="lookbook" className="py-16 lg:py-20">
        <div className="container-lux">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Fashion lookbook</p>
            <h2 className="font-display mt-3 text-5xl font-semibold text-emerald lg:text-7xl">Soft kurtis, polished denim mood.</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {products.slice(0, 3).map((product, index) => (
              <Reveal key={product.slug} delay={index * 0.08}>
                <Link href={`/products/${product.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[8px] border border-emerald/12 bg-[linear-gradient(135deg,#f8f7f4,#dfe9e2)] p-1 shadow-[0_22px_70px_rgba(4,45,40,0.12)]">
                  <Image src={product.gallery[0]} alt={product.name} fill className="object-cover object-top p-1 transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                    <p className="font-display text-3xl">{product.name}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ivory-texture border-y border-emerald/10 py-16 lg:py-20">
        <div className="container-lux grid gap-8 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Testimonials</p>
            <h2 className="font-display mt-3 text-5xl font-semibold text-emerald">Loved for comfort, softness, and finish.</h2>
          </div>
        </Reveal>
        <div className="grid gap-4">
          {["The short kurti looks exactly like the photo and pairs so well with jeans.", "The fabric feels soft, premium, and comfortable for daily wear.", "The WhatsApp order flow was quick and the packaging felt very considered."].map((quote) => (
            <blockquote key={quote} className="gold-edge rounded-[8px] border border-emerald/12 bg-white/86 p-6 text-lg leading-8 text-emerald/85 shadow-[0_18px_50px_rgba(4,45,40,0.09)]">&quot;{quote}&quot;</blockquote>
          ))}
        </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-emerald py-16 text-white lg:py-20">
        <div className="absolute inset-0 luxury-texture opacity-70" />
        <div className="container-lux grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Instagram</p>
            <h2 className="font-display mt-3 text-5xl font-semibold text-white">Follow the refined SAWRNA mood.</h2>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

function ShopByEdit({ products }: { products: Product[] }) {
  const edits = [
    {
      label: "New arrivals",
      href: "/products?highlight=New%20arrivals",
      count: products.filter((product) => product.isNew).length,
    },
    {
      label: "Best sellers",
      href: "/products?highlight=Best%20sellers",
      count: products.filter((product) => product.isBestSeller).length,
    },
    {
      label: "Trending",
      href: "/products?highlight=Trending",
      count: products.filter((product) => product.isTrending).length,
    },
    {
      label: "Discount edit",
      href: "/products?discount=true&sort=discount",
      count: products.filter((product) => product.discount).length,
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-emerald py-10 text-white">
      <div className="absolute inset-0 luxury-texture opacity-70" />
      <div className="container-lux">
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Shop the edit</p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-white lg:text-4xl">Curated paths into the SAWRNA collection.</h2>
          </div>
          <Link href="/products" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-gold/50 hover:text-gold">
            <SlidersHorizontal size={15} /> All filters
          </Link>
        </div>
        <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {edits.map((edit) => (
            <Link key={edit.label} href={edit.href} className="group gold-edge rounded-[8px] border border-white/12 bg-white/8 p-4 shadow-[0_18px_46px_rgba(0,0,0,0.14)] backdrop-blur transition hover:-translate-y-0.5 hover:border-gold/45 hover:bg-white/12">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{edit.count || products.length} pieces</span>
              <span className="mt-2 flex items-center justify-between gap-3 font-display text-3xl font-semibold text-white">
                {edit.label}
                <ArrowRight size={18} className="text-gold transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection({ eyebrow, title, products, tone = "light" }: { eyebrow: string; title: string; products: Product[]; tone?: "light" | "sage" }) {
  if (!products.length) return null;
  return (
    <section className={`relative overflow-hidden py-14 lg:py-20 ${tone === "sage" ? "border-y border-emerald/10 ivory-texture" : "bg-white/45"}`}>
      <div className="container-lux">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
              <h2 className="font-display mt-3 max-w-2xl text-4xl font-semibold text-emerald lg:text-6xl">{title}</h2>
            </div>
            <Link href="/products" className="hidden text-sm font-semibold uppercase tracking-[0.18em] text-emerald hover:text-gold sm:block">View all</Link>
          </div>
        </Reveal>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
