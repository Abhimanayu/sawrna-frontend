import Link from "next/link";
import { Heart, MapPin, ReceiptText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrdersSnapshot } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const snapshot = await getOrdersSnapshot();
  const latestOrder = snapshot.orders[0];

  return (
    <section className="container-lux grid gap-6 py-12 lg:grid-cols-[1fr_360px] lg:py-16">
      <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/86 p-6 shadow-[0_20px_60px_rgba(4,45,40,0.09)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Account Preview</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-emerald lg:text-7xl">Your SAWRNA profile</h1>
        <p className="mt-4 max-w-xl text-muted">
          A client-ready preview account area for saved addresses, wishlist, and order history. Production can connect this to real user sessions.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            [ReceiptText, `${snapshot.orders.length}`, "Preview orders"],
            [Heart, "Wishlist", "Saved locally"],
            [ShieldCheck, "Verified", "Secure checkout"],
          ].map(([Icon, value, label]) => (
            <div key={String(label)} className="rounded-[8px] border border-emerald/10 bg-ivory/72 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald text-gold"><Icon size={18} /></span>
              <p className="font-display mt-4 text-3xl font-semibold text-emerald">{String(value)}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{String(label)}</p>
            </div>
          ))}
        </div>

        {latestOrder && (
          <Link href={`/track-order?lookup=${latestOrder.orderId}`} className="mt-6 block rounded-[8px] border border-gold/25 bg-[linear-gradient(135deg,#fff,#f8f7f4)] p-4 transition hover:border-gold/50">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Latest order</p>
            <p className="font-display mt-2 text-3xl font-semibold text-emerald">{latestOrder.orderId}</p>
            <p className="mt-1 text-sm text-muted">{latestOrder.status}</p>
          </Link>
        )}
      </div>

      <aside className="grid gap-4">
        <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/86 p-6 shadow-[0_18px_50px_rgba(4,45,40,0.08)]">
          <h2 className="font-display text-3xl font-semibold text-emerald">Quick links</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <Link href="/order-history" className="hover:text-gold">Order history</Link>
            <Link href="/wishlist" className="hover:text-gold">Wishlist</Link>
            <Link href="/track-order" className="hover:text-gold">Track order</Link>
            <Link href="/checkout" className="hover:text-gold">Checkout</Link>
          </div>
        </div>
        <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/86 p-6 shadow-[0_18px_50px_rgba(4,45,40,0.08)]">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald text-gold"><MapPin size={18} /></span>
          <h2 className="font-display mt-4 text-3xl font-semibold text-emerald">Saved address</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Preview customer address appears from checkout orders.</p>
          <Button asChild className="mt-5 w-full" variant="outline"><Link href="/login">Demo Login</Link></Button>
        </div>
      </aside>
    </section>
  );
}
