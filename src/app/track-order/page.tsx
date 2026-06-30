import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findOrderByLookup, orderStatuses } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

const progressStatuses = orderStatuses.filter((status) => !["Cancelled", "Failed"].includes(status));

export const dynamic = "force-dynamic";

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ lookup?: string }> }) {
  const { lookup = "" } = await searchParams;
  const order = lookup ? await findOrderByLookup(lookup) : null;
  const activeIndex = order ? progressStatuses.indexOf(order.status) : -1;

  return (
    <section className="container-lux py-12 lg:py-16">
      <div className="relative overflow-hidden rounded-[8px] border border-white/10 emerald-depth p-6 text-white lg:p-9">
        <div className="absolute inset-0 luxury-texture opacity-60" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Order timeline</p>
          <h1 className="font-display mt-2 text-5xl font-semibold text-white lg:text-7xl">Track Order</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">Use the preview order ID, phone number, or email from checkout.</p>
        </div>
      </div>

      <form className="gold-edge mt-8 grid gap-3 rounded-[8px] border border-emerald/12 bg-white/86 p-4 shadow-[0_18px_50px_rgba(4,45,40,0.08)] sm:grid-cols-[1fr_auto]">
        <Input name="lookup" defaultValue={lookup} placeholder="Enter order ID, phone, or email" />
        <Button type="submit">Track</Button>
      </form>

      {lookup && !order && (
        <div className="mt-8 rounded-[8px] border border-emerald/12 bg-white/84 p-8 text-center shadow-[0_14px_34px_rgba(4,45,40,0.07)]">
          <h2 className="font-display text-4xl font-semibold text-emerald">Order not found.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
            Please check the order ID from checkout. For preview, place a fresh order and use the generated SAW order ID.
          </p>
          <Button asChild className="mt-6"><Link href="/products">Shop Collection</Link></Button>
        </div>
      )}

      {order && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/84 p-5 shadow-[0_18px_50px_rgba(4,45,40,0.08)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Order {order.orderId}</p>
                <h2 className="font-display mt-2 text-4xl font-semibold text-emerald">{order.status}</h2>
                <p className="mt-2 text-sm text-muted">{order.customer.name} / {order.customer.city} {order.customer.pincode}</p>
              </div>
              <span className="w-fit rounded-full border border-gold/25 bg-ivory px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                {formatPrice(order.total)}
              </span>
            </div>

            <div className="mt-8 grid gap-4">
              {progressStatuses.map((status, index) => {
                const active = index <= activeIndex;
                const current = status === order.status;
                return (
                  <div key={status} className="grid grid-cols-[36px_1fr] gap-4">
                    <span className={`grid h-9 w-9 place-items-center rounded-full text-xs font-semibold ${active ? "bg-emerald text-gold" : "bg-ivory text-muted"}`}>
                      {index + 1}
                    </span>
                    <div className={`rounded-[8px] border p-4 ${current ? "border-gold/35 bg-[linear-gradient(135deg,#fff,#f8f7f4)]" : "border-emerald/10 bg-white/70"}`}>
                      <p className="font-semibold text-emerald">{status}</p>
                      <p className="mt-1 text-xs text-muted">{timelineText(status, current)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="gold-edge h-fit rounded-[8px] border border-emerald/12 bg-white/86 p-5 shadow-[0_18px_50px_rgba(4,45,40,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-emerald">Order summary</h2>
            <div className="mt-5 grid gap-3">
              {order.items.map((item) => (
                <div key={`${item.slug}-${item.size}-${item.color}`} className="border-b border-emerald/10 pb-3 text-sm">
                  <p className="font-medium text-emerald">{item.name}</p>
                  <p className="mt-1 text-xs text-muted">{item.color} / {item.size} x {item.qty}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2 text-sm text-muted">
              <p><span className="font-semibold text-emerald">Payment:</span> {paymentLabel(order.paymentMethod)}</p>
              <p><span className="font-semibold text-emerald">Phone:</span> {order.customer.phone}</p>
              <p><span className="font-semibold text-emerald">Address:</span> {order.customer.address}</p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function timelineText(status: string, current: boolean) {
  if (current) return "Current order stage in the SAWRNA preview timeline.";
  if (status === "Payment Verification Pending") return "Manual UPI screenshot will be verified by admin.";
  if (status === "Confirmed") return "Order confirmed by SAWRNA care.";
  if (status === "Delivered") return "Order delivered to customer.";
  return "Stage updates appear here as admin changes status.";
}

function paymentLabel(value: string) {
  if (value === "cod") return "Cash on Delivery";
  if (value === "upi") return "Manual UPI";
  if (value === "whatsapp") return "WhatsApp Order";
  return "Payment Link";
}
