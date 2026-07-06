"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CreditCard, Link as LinkIcon, MessageCircle, ShieldCheck, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/config";
import { getCouponBenefit, normalizeCoupon, previewCoupons } from "@/lib/coupons";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const checkoutSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(10, "Enter a valid phone number."),
  address: z.string().min(10, "Enter your complete delivery address."),
  city: z.string().min(2, "Enter your city."),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode."),
  paymentMethod: z.enum(["cod", "whatsapp", "upi", "payment-link"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;
type PaymentValue = CheckoutValues["paymentMethod"];

const paymentOptions: { value: PaymentValue; label: string; note: string; Icon: LucideIcon }[] = [
  { value: "cod", label: "Cash on Delivery", note: "Pay when the parcel arrives.", Icon: Banknote },
  { value: "whatsapp", label: "WhatsApp Order", note: "Send a complete order summary.", Icon: MessageCircle },
  { value: "upi", label: "Manual UPI", note: "Upload screenshot for verification.", Icon: CreditCard },
  { value: "payment-link", label: "Payment Link", note: "Our team shares a secure link.", Icon: LinkIcon },
];

export function CheckoutClient() {
  const [confirmation, setConfirmation] = useState("");
  const [upiFile, setUpiFile] = useState("");
  const { items, clearCart, coupon, setCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState(coupon || "");
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.qty, 0), [items]);
  const shipping = subtotal > 4999 || subtotal === 0 ? 0 : 199;
  const couponBenefit = getCouponBenefit(coupon, subtotal, shipping);
  const total = Math.max(0, subtotal + shipping - couponBenefit.discount - couponBenefit.shippingDiscount);
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cod" },
  });
  const errors = form.formState.errors;
  const paymentMethod = useWatch({ control: form.control, name: "paymentMethod" });

  const onSubmit = async (values: CheckoutValues) => {
    const payload = { ...values, items, coupon: couponBenefit.valid ? couponBenefit.code : undefined, upiScreenshot: upiFile, total };
    const response = await fetch("/api/orders", { method: "POST", body: JSON.stringify(payload) });
    const data = await response.json();
    if (values.paymentMethod === "whatsapp") {
      const lines = items.map((item) => `${item.name} (${item.size}/${item.color}) x ${item.qty} - ${formatPrice(item.price * item.qty)}`);
      const message = encodeURIComponent(`SAWRNA order request\n\nCustomer: ${values.name}\nPhone: ${values.phone}\nAddress: ${values.address}, ${values.city} ${values.pincode}\n\n${lines.join("\n")}\n\nTotal: ${formatPrice(total)}`);
      window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${message}`, "_blank");
    }
    setConfirmation(data.orderId || "SAWRNA-CONFIRMED");
    clearCart();
  };

  if (!items.length && !confirmation) {
    return (
      <section className="container-lux py-20 text-center">
        <h1 className="font-display text-5xl font-semibold text-emerald">Your bag is empty.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">Add a SAWRNA short kurti to begin the premium checkout flow.</p>
        <Button className="mt-8" asChild><Link href="/products">Return to Collection</Link></Button>
      </section>
    );
  }

  if (confirmation) {
    return (
      <section className="container-lux py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Order confirmation</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-emerald">Thank you for choosing SAWRNA.</h1>
        <p className="mt-4 text-muted">Order ID: {confirmation}. You can track it from the Track Order page.</p>
        <Button asChild className="mt-8"><Link href={`/track-order?lookup=${confirmation}`}>Track Order</Link></Button>
      </section>
    );
  }

  return (
    <section className="container-lux py-10 lg:py-16">
      <div className="relative mb-8 overflow-hidden rounded-[8px] border border-white/10 emerald-depth p-6 text-white lg:p-9">
        <div className="absolute inset-0 luxury-texture opacity-60" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Secure checkout</p>
          <h1 className="font-display mt-3 text-5xl font-semibold leading-tight text-white lg:text-7xl">Address, payment, review.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">Complete your order with COD, WhatsApp order, manual UPI verification, or payment link support.</p>
        </div>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {["Address", "Payment", "Review"].map((step, index) => (
          <div key={step} className="flex items-center gap-3 rounded-full border border-emerald/12 bg-white/86 px-4 py-3 text-sm text-emerald shadow-[0_10px_28px_rgba(4,45,40,0.08)]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald text-xs font-semibold text-white">{index + 1}</span>
            <span className="font-semibold">{step}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="gold-edge grid gap-7 rounded-[8px] border border-emerald/12 bg-white/88 p-5 premium-shadow lg:p-7">
          <section>
            <h2 className="font-display text-3xl font-semibold text-emerald">Delivery Address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field>
                <Input placeholder="Full name" {...form.register("name")} />
                <FieldError message={errors.name?.message} />
              </Field>
              <Field>
                <Input placeholder="Email" {...form.register("email")} />
                <FieldError message={errors.email?.message} />
              </Field>
              <Field>
                <Input placeholder="Phone" {...form.register("phone")} />
                <FieldError message={errors.phone?.message} />
              </Field>
              <Field>
                <Input placeholder="City" {...form.register("city")} />
                <FieldError message={errors.city?.message} />
              </Field>
              <Field>
                <Input placeholder="Pincode" {...form.register("pincode")} />
                <FieldError message={errors.pincode?.message} />
              </Field>
              <Field className="sm:col-span-2">
                <Textarea placeholder="Complete address" {...form.register("address")} />
                <FieldError message={errors.address?.message} />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl font-semibold text-emerald">Payment Method</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {paymentOptions.map(({ value, label, note, Icon }) => {
                const active = paymentMethod === value;
                return (
                  <label
                    key={value}
                    className={`flex cursor-pointer gap-4 rounded-[8px] border p-4 text-sm transition ${active ? "border-gold/60 bg-emerald text-white shadow-[0_18px_42px_rgba(4,45,40,0.18)]" : "border-emerald/12 bg-ivory/80 text-emerald hover:border-gold/45 hover:bg-white"}`}
                  >
                    <input type="radio" value={value} {...form.register("paymentMethod")} className="sr-only" />
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${active ? "bg-white/12 text-gold" : "bg-white text-gold"}`}>
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block font-semibold">{label}</span>
                      <span className={active ? "mt-1 block text-white/72" : "mt-1 block text-muted"}>{note}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            {paymentMethod === "upi" && (
              <div className="mt-5 rounded-[8px] border border-gold/30 bg-[linear-gradient(135deg,#f8f7f4,#dfe9e2)] p-5">
                <p className="font-semibold text-emerald">UPI ID: {siteConfig.upiId}</p>
                <div className="mt-3 grid h-32 w-32 place-items-center rounded-[8px] border border-dashed border-emerald/25 bg-white text-xs text-muted">QR Placeholder</div>
                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-emerald/12 bg-white px-4 py-2 text-sm font-semibold text-emerald transition hover:border-gold/45">
                  <Upload size={16} /> Upload screenshot
                  <input type="file" className="hidden" onChange={(event) => setUpiFile(event.target.files?.[0]?.name || "")} />
                </label>
                {upiFile && <p className="mt-2 text-xs text-muted">Attached: {upiFile}</p>}
              </div>
            )}
          </section>

          <Button size="lg" type="submit" className="w-full sm:w-fit">
            {paymentMethod === "whatsapp" && <MessageCircle size={18} />} Place Order
          </Button>
        </form>

        <aside className="gold-edge h-fit rounded-[8px] border border-emerald/12 bg-white/88 p-6 premium-shadow lg:sticky lg:top-32">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-gold"><ShieldCheck size={19} /></span>
            <div>
              <h2 className="font-display text-3xl font-semibold text-emerald">Order Review</h2>
              <p className="text-xs text-muted">Secure SAWRNA checkout</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {items.map((item) => (
              <div key={`${item.slug}-${item.size}-${item.color}`} className="flex justify-between gap-4 border-b border-emerald/10 pb-4 text-sm">
                <span>
                  <span className="block font-medium text-emerald">{item.name}</span>
                  <span className="mt-1 block text-xs text-muted">{item.color} / {item.size} x {item.qty}</span>
                </span>
                <span className="font-semibold text-emerald">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[8px] border border-emerald/10 bg-ivory/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Coupon</p>
            <div className="mt-3 flex gap-2">
              <input
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value)}
                placeholder="SAWRNA10"
                className="h-10 min-w-0 flex-1 rounded-full border border-emerald/12 bg-white px-4 text-sm text-emerald outline-none focus:border-gold"
              />
              <Button type="button" size="sm" variant="outline" onClick={() => setCoupon(normalizeCoupon(couponInput) || null)}>Apply</Button>
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
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping ? formatPrice(shipping) : "Free"}</span></div>
            {couponBenefit.discount > 0 && <div className="flex justify-between text-emerald"><span>Coupon</span><span>-{formatPrice(couponBenefit.discount)}</span></div>}
            {couponBenefit.shippingDiscount > 0 && <div className="flex justify-between text-emerald"><span>Shipping Coupon</span><span>-{formatPrice(couponBenefit.shippingDiscount)}</span></div>}
            <div className="gold-rule my-2" />
            <div className="flex justify-between text-lg font-semibold text-emerald">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <p className="mt-5 text-xs leading-5 text-muted">Manual UPI orders stay in payment-verification pending until your screenshot is checked by admin.</p>
        </aside>
      </div>
    </section>
  );
}

function Field({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid gap-1 ${className}`}>{children}</div>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="px-2 text-xs font-medium text-[#8a4f1f]">{message}</p>;
}
