"use client";

import Link from "next/link";
import { ArrowRight, Heart, Menu, Search, ShoppingBag, Sparkles, Truck, User, X } from "lucide-react";
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
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald/10 bg-ivory/94 text-emerald shadow-[0_18px_48px_rgba(4,45,40,0.1)] backdrop-blur-xl">
      <div className="border-b border-white/10 bg-emerald text-white">
        <div className="container-lux flex h-9 items-center justify-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/86 sm:h-10 sm:justify-between sm:text-[10px] lg:h-11">
          <span className="hidden items-center gap-2 sm:inline-flex"><Truck size={14} /> Fast dispatch across India</span>
          <span className="inline-flex items-center gap-2 text-gold"><Sparkles size={13} /> Elegance That Feels Like You</span>
          <span className="hidden items-center gap-2 sm:inline-flex"><Sparkles size={14} className="text-gold" /> Premium apparel, timeless you</span>
        </div>
      </div>
      <div className="container-lux flex h-[72px] items-center justify-between gap-2 lg:h-[96px] lg:gap-3">
        <Button variant="ghost" size="icon" className="text-emerald hover:bg-sage/60 hover:text-gold lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </Button>
        <Logo className="shrink-0" />
        <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
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
        <div
          className="fixed inset-0 z-[9999] h-[100dvh] bg-black/45 backdrop-blur-sm lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onClick={() => setOpen(false)}
        >
          <div className="relative ml-auto flex min-h-full w-[min(90vw,390px)] flex-col overflow-y-auto bg-emerald text-white shadow-[-24px_0_80px_rgba(0,0,0,0.28)]" onClick={(event) => event.stopPropagation()}>
            <div className="pointer-events-none absolute inset-0 luxury-texture opacity-55" />
            <div className="relative flex h-[82px] items-center justify-between border-b border-white/10 px-5">
              <Logo surface="dark" />
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-gold" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={21} />
              </Button>
            </div>
            <nav className="relative grid px-5 py-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex min-h-14 items-center justify-between gap-4 border-b border-white/10 py-3 font-display text-[1.8rem] leading-none text-white transition hover:text-gold"
                  style={{ transitionDelay: `${index * 18}ms` }}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={16} className="shrink-0 text-gold/75 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </nav>
            <div className="relative mt-auto px-5 pb-6 pt-3">
              <div className="mb-4 grid grid-cols-2 gap-2">
                <Link href="/wishlist" onClick={() => setOpen(false)} className="flex h-11 items-center justify-center gap-2 rounded-[8px] border border-white/12 bg-white/8 text-xs font-semibold uppercase tracking-[0.13em] text-white">
                  <Heart size={16} /> Wishlist
                </Link>
                <Link href="/profile" onClick={() => setOpen(false)} className="flex h-11 items-center justify-center gap-2 rounded-[8px] border border-white/12 bg-white/8 text-xs font-semibold uppercase tracking-[0.13em] text-white">
                  <User size={16} /> Profile
                </Link>
              </div>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald shadow-[0_18px_44px_rgba(0,0,0,0.24)]"
              >
                Shop Collection <ArrowRight size={16} />
              </Link>
              <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-white/52">Premium Apparel</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
