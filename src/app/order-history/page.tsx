import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrdersSnapshot } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderHistoryPage() {
  const snapshot = await getOrdersSnapshot();
  const orders = snapshot.orders.slice(0, 12);

  return (
    <section className="container-lux py-12 lg:py-16">
      <div className="relative overflow-hidden rounded-[8px] border border-white/10 emerald-depth p-6 text-white lg:p-9">
        <div className="absolute inset-0 luxury-texture opacity-60" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Account orders</p>
          <h1 className="font-display mt-2 text-5xl font-semibold text-white lg:text-7xl">Order History</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
            Preview mode shows recent demo orders from checkout. Production mode can scope this to logged-in customers.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {orders.length ? orders.map((order) => (
          <Link
            key={order.orderId}
            href={`/track-order?lookup=${order.orderId}`}
            className="gold-edge grid gap-4 rounded-[8px] border border-emerald/12 bg-white/86 p-5 shadow-[0_18px_50px_rgba(4,45,40,0.08)] transition hover:-translate-y-0.5 hover:border-gold/40 lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-3xl font-semibold text-emerald">{order.orderId}</p>
                <span className="rounded-full border border-gold/25 bg-ivory px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">{order.status}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{order.items.map((item) => item.name).slice(0, 2).join(", ")}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-lg font-semibold text-emerald">{formatPrice(order.total)}</p>
              <p className="mt-1 text-xs text-muted">Track order</p>
            </div>
          </Link>
        )) : (
          <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/84 p-8 text-center shadow-[0_14px_34px_rgba(4,45,40,0.07)]">
            <h2 className="font-display text-4xl font-semibold text-emerald">No preview orders yet.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
              Add a product to cart and complete checkout. The order will appear here and in the admin panel.
            </p>
            <Button asChild className="mt-6"><Link href="/products">Start Shopping</Link></Button>
          </div>
        )}
      </div>
    </section>
  );
}
