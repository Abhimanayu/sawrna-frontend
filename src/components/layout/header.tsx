"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/config";
import { useCartStore } from "@/store/cart-store";

export function Header() {
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.qty, 0));
  const wishCount = useCartStore((state) => state.wishlist.length);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald/10 bg-ivory/94 text-emerald shadow-[0_18px_48px_rgba(4,45,40,0.1)] backdrop-blur-xl">
      <div className="border-b border-white/10 bg-emerald text-white">
        <div className="container-lux flex h-10 items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/86 sm:justify-between lg:h-12">
          <span className="hidden items-center gap-2 sm:inline-flex"><Truck size={14} /> Fast dispatch across India</span>
          <span className="inline-flex items-center gap-2 text-gold"><ShieldCheck size={14} /> COD, WhatsApp order & manual UPI supported</span>
          <span className="hidden items-center gap-2 sm:inline-flex"><Sparkles size={14} className="text-gold" /> Premium apparel, timeless you</span>
        </div>
      </div>
      <div className="container-lux flex h-[76px] items-center justify-between gap-2 lg:h-[104px] lg:gap-3">
        <Button variant="ghost" size="icon" className="text-emerald hover:bg-sage/60 hover:text-gold lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </Button>
        <Logo className="shrink-0" />
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="relative text-xs font-semibold uppercase tracking-[0.18em] text-emerald/78 transition after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:text-emerald hover:after:w-full">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" className="text-emerald hover:bg-sage/60 hover:text-gold" aria-label="Search">
            <Link href="/search"><Search size={19} /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="hidden text-emerald hover:bg-sage/60 hover:text-gold sm:inline-flex" aria-label="Profile">
            <Link href="/profile"><User size={19} /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative hidden text-emerald hover:bg-sage/60 hover:text-gold sm:inline-flex" aria-label="Wishlist">
            <Link href="/wishlist">
              <Heart size={19} />
              {wishCount > 0 && <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-gold px-1 text-[10px] leading-4 text-emerald">{wishCount}</span>}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative text-emerald hover:bg-sage/60 hover:text-gold" aria-label="Cart">
            <Link href="/cart">
              <ShoppingBag size={19} />
              {itemCount > 0 && <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-gold px-1 text-[10px] leading-4 text-emerald">{itemCount}</span>}
            </Link>
          </Button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[9999] h-[100dvh] overflow-y-auto bg-emerald text-white shadow-2xl lg:hidden">
          <div className="pointer-events-none absolute inset-0 luxury-texture opacity-70" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(4,45,40,0.96)_62%,#021f1b_100%)]" />
          <div className="container-lux relative flex h-[96px] items-center justify-between border-b border-white/10">
            <Logo surface="dark" />
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-gold" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={22} />
            </Button>
          </div>
          <nav className="container-lux relative grid gap-1 py-8">
            {[...navItems, { label: "Wishlist", href: "/wishlist" }, { label: "Profile", href: "/profile" }].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[8px] border border-white/0 px-4 py-4 font-display text-[2.65rem] leading-none text-white transition hover:border-gold/25 hover:bg-white/8 hover:text-gold"
                style={{ transitionDelay: `${index * 20}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="container-lux relative pb-8">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold uppercase tracking-[0.18em] text-emerald shadow-[0_18px_44px_rgba(0,0,0,0.24)]"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
