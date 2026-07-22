"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Gem, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCouponBenefit, normalizeCoupon, previewCoupons } from "@/lib/coupons";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function CartClient() {
  const { items, removeItem, updateQty, coupon, setCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState(coupon || "");
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 4999 || subtotal === 0 ? 0 : 199;
  const couponBenefit = getCouponBenefit(coupon, subtotal, shipping);
  const total = Math.max(0, subtotal + shipping - couponBenefit.discount - couponBenefit.shippingDiscount);

  if (!items.length) {
    return (
      <section className="container-lux py-10 sm:py-16">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[8px] border border-gold/20 bg-[linear-gradient(135deg,#fffaf2,#efe4d2)] px-5 py-12 text-center shadow-[0_26px_78px_rgba(4,45,40,0.1)] sm:px-10 sm:py-16">
          <div className="absolute inset-0 ivory-texture opacity-60" />
          <div className="relative">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald text-gold shadow-[0_16px_38px_rgba(4,45,40,0.18)]"><ShoppingBag size={25} /></span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold">Your SAWRNA bag</p>
            <h1 className="font-display mt-3 text-5xl font-semibold leading-none text-emerald sm:text-6xl">Ready when you are.</h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">Explore signature short kurtis and choose the colour and size that feel most like you.</p>
            <Button asChild className="mt-7 w-full sm:w-auto"><Link href="/products">Explore The Collection</Link></Button>
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald sm:text-xs sm:tracking-[0.12em]">
              <span className="grid place-items-center gap-2 rounded-[8px] border border-emerald/10 bg-white/65 p-3"><Gem size={17} className="text-gold" /> Premium fabrics</span>
              <span className="grid place-items-center gap-2 rounded-[8px] border border-emerald/10 bg-white/65 p-3"><Truck size={17} className="text-gold" /> Easy delivery</span>
              <span className="grid place-items-center gap-2 rounded-[8px] border border-emerald/10 bg-white/65 p-3"><ShieldCheck size={17} className="text-gold" /> Secure order</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-lux grid min-w-0 gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:py-16">
      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-[8px] border border-white/10 emerald-depth p-6 text-white">
          <div className="absolute inset-0 luxury-texture opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">SAWRNA bag</p>
            <h1 className="font-display mt-2 text-5xl font-semibold text-white">Shopping Bag</h1>
          </div>
        </div>
        <div className="mt-8 grid gap-5">
          {items.map((item) => (
            <div key={`${item.slug}-${item.size}-${item.color}`} className="gold-edge relative grid grid-cols-[92px_1fr] gap-4 rounded-[8px] border border-emerald/12 bg-white/84 p-3 shadow-[0_16px_44px_rgba(4,45,40,0.09)] sm:grid-cols-[120px_1fr]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] border border-gold/18 image-polish p-1">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="120px" />
              </div>
              <div className="pr-7">
                <Link href={`/products/${item.slug}`} className="font-display text-2xl font-semibold text-emerald">{item.name}</Link>
                <p className="mt-1 text-sm text-muted">{item.color} / {item.size}</p>
                <p className="mt-3 font-semibold text-emerald">{formatPrice(item.price)}</p>
                <div className="mt-4 flex w-fit items-center rounded-full border border-emerald/12 bg-ivory">
                  <button className="grid h-9 w-9 place-items-center" onClick={() => updateQty(item.slug, item.size, item.color, item.qty - 1)} aria-label="Decrease">
                    <Minus size={14} />
                  </button>
                  <span className="w-9 text-center text-sm">{item.qty}</span>
                  <button className="grid h-9 w-9 place-items-center" onClick={() => updateQty(item.slug, item.size, item.color, item.qty + 1)} aria-label="Increase">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-emerald/10 bg-white text-muted transition hover:border-gold/35 hover:text-gold" onClick={() => removeItem(item.slug, item.size, item.color)} aria-label="Remove">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <aside className="gold-edge h-fit rounded-[8px] border border-emerald/12 bg-white/88 p-6 premium-shadow lg:sticky lg:top-32">
        <h2 className="font-display text-3xl font-semibold text-emerald">Order Summary</h2>
        <div className="mt-5 rounded-[8px] border border-emerald/10 bg-ivory/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Offers for you</p>
          <div className="mt-3 flex gap-2">
            <input
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value)}
              placeholder="SAWRNA10"
              className="h-11 min-w-0 flex-1 rounded-full border border-emerald/12 bg-white px-4 text-sm text-emerald outline-none focus:border-gold"
            />
            <Button type="button" variant="outline" onClick={() => setCoupon(normalizeCoupon(couponInput) || null)}>Apply</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {previewCoupons.map((item) => (
              <button key={item.code} type="button" onClick={() => { setCouponInput(item.code); setCoupon(item.code); }} className="rounded-full border border-gold/25 bg-white px-3 py-1 text-[11px] font-semibold text-emerald">
                {item.code}
              </button>
            ))}
          </div>
          {coupon && <p className={`mt-2 text-xs ${couponBenefit.valid ? "text-emerald" : "text-[#8a4f1f]"}`}>{couponBenefit.message}</p>}
        </div>
        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : "Free"}</span></div>
          {couponBenefit.discount > 0 && <div className="flex justify-between text-emerald"><span>Coupon</span><span>-{formatPrice(couponBenefit.discount)}</span></div>}
          {couponBenefit.shippingDiscount > 0 && <div className="flex justify-between text-emerald"><span>Shipping Coupon</span><span>-{formatPrice(couponBenefit.shippingDiscount)}</span></div>}
          <div className="gold-rule my-2" />
          <div className="flex justify-between text-lg font-semibold text-emerald"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
        <Button asChild className="mt-6 w-full"><Link href="/checkout">Checkout</Link></Button>
        <p className="mt-4 text-xs leading-5 text-muted">Your bag is saved on this device, so your selected pieces are ready when you return.</p>
      </aside>
    </section>
  );
}
