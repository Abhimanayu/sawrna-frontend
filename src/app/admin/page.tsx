import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { Database, ExternalLink, PackageCheck, ReceiptText, ShieldCheck, UsersRound } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { getAdminOrderStats } from "@/lib/admin-dashboard";
import { getAdminCatalogSnapshot } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { createOrUpdateProductAction, deleteProductAction, seedProductsAction, toggleProductStatusAction } from "@/app/actions/products";
import { updateOrderStatusAction } from "@/app/actions/orders";
import { getOrdersSnapshot, orderStatuses } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [catalog, orderStats, orderSnapshot] = await Promise.all([getAdminCatalogSnapshot(), getAdminOrderStats(), getOrdersSnapshot()]);
  const canWrite = catalog.canWrite;
  const activeProducts = catalog.products.filter((product) => product.status === "active").length;
  const draftProducts = catalog.products.filter((product) => product.status === "draft").length;
  const latestOrders = orderSnapshot.orders.slice(0, 8);

  const cards = [
    { label: "Products", value: catalog.products.length, sub: `${activeProducts} live, ${draftProducts} draft`, icon: PackageCheck },
    { label: "Orders", value: orderStats.orders, sub: "Saved checkout orders", icon: ReceiptText },
    { label: "Payment Verification", value: orderStats.paymentVerification, sub: "Manual UPI queue", icon: ShieldCheck },
    { label: "Customers", value: orderStats.customers, sub: "Unique emails captured", icon: UsersRound },
  ];

  return (
    <section className="bg-[linear-gradient(135deg,#ffffff_0%,#f8f7f4_48%,#dfe9e2_100%)] py-10 lg:py-14">
      <div className="container-lux">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Logo />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-gold">SAWRNA Admin</p>
            <h1 className="font-display mt-3 text-5xl font-semibold leading-none text-emerald lg:text-7xl">Store Console</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Products saved here power the public collection, product detail pages, search API, and sitemap. Demo stock remains visible until MongoDB has products.
            </p>
          </div>
          <div className="rounded-[8px] border border-emerald/12 bg-white/80 p-5 shadow-[0_18px_50px_rgba(4,45,40,0.08)]">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald text-gold"><Database size={19} /></span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Catalog Source</p>
                <p className="font-display text-2xl font-semibold text-emerald">
                  {catalog.source === "database" ? "MongoDB Live" : catalog.source === "local" ? "Local Demo" : "Seed Demo"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              {canWrite
                ? `${catalog.databaseCount} saved products are connected to the website.`
                : "Set a valid MONGODB_URI to persist admin edits and sync live website data."}
            </p>
          </div>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-4">
          {cards.map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="rounded-[8px] border border-emerald/12 bg-white/82 p-5 shadow-[0_18px_50px_rgba(4,45,40,0.08)]">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald text-gold"><Icon size={18} /></span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">{label}</p>
              <p className="font-display mt-2 text-5xl font-semibold leading-none text-emerald">{value}</p>
              <p className="mt-2 text-xs text-muted">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 rounded-[8px] border border-emerald/12 bg-emerald p-4 text-ivory shadow-[0_20px_60px_rgba(4,45,40,0.16)] md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Preview tools</p>
            <p className="mt-1 text-sm text-white/75">Open the exact public surfaces connected to this admin catalog.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["Home", "/"],
              ["Products", "/products"],
              ["Search", "/search"],
              ["API", "/api/products"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-gold/50 hover:text-gold">
                {label} <ExternalLink size={13} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[8px] border border-emerald/12 bg-white/86 p-5 shadow-[0_22px_70px_rgba(4,45,40,0.1)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Order Desk</p>
              <h2 className="font-display mt-2 text-3xl font-semibold text-emerald">Preview order management</h2>
            </div>
            <p className="text-xs leading-5 text-muted">
              Source: {orderSnapshot.source === "database" ? "MongoDB" : "Local preview store"}
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            {latestOrders.length ? latestOrders.map((order) => (
              <div key={order.orderId} className="grid gap-4 rounded-[8px] border border-emerald/10 bg-ivory/72 p-4 lg:grid-cols-[1fr_240px] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-2xl font-semibold text-emerald">{order.orderId}</p>
                    <span className="rounded-full border border-gold/25 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">{order.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{order.customer.name} / {order.customer.phone} / {order.customer.city}</p>
                  <p className="mt-2 text-sm text-emerald">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} / {formatPrice(order.total)} / {paymentLabel(order.paymentMethod)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.statusHistory.slice(-3).map((history) => (
                      <span key={`${order.orderId}-${history.status}-${history.at}`} className="rounded-full border border-emerald/10 bg-white px-3 py-1 text-[11px] text-muted">
                        {history.status}
                      </span>
                    ))}
                  </div>
                </div>
                <form action={updateOrderStatusAction} className="grid gap-2">
                  <input type="hidden" name="orderId" value={order.orderId} />
                  <select name="status" defaultValue={order.status} className="h-11 rounded-full border border-emerald/12 bg-white px-4 text-sm text-emerald outline-none focus:border-gold">
                    {orderStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <Button size="sm" variant="outline">Update Status</Button>
                  <Link href={`/track-order?lookup=${order.orderId}`} className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted hover:text-gold">
                    Open tracking
                  </Link>
                </form>
              </div>
            )) : (
              <div className="rounded-[8px] border border-dashed border-emerald/18 bg-ivory/72 p-8 text-center">
                <h3 className="font-display text-3xl font-semibold text-emerald">No preview orders yet.</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
                  Place one order from checkout and it will appear here instantly with tracking and status controls.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="rounded-[8px] border border-emerald/12 bg-white/86 p-5 shadow-[0_22px_70px_rgba(4,45,40,0.1)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Product Manager</p>
                <h2 className="font-display mt-2 text-3xl font-semibold text-emerald">Add or update product</h2>
              </div>
              <form action={seedProductsAction}>
                <Button size="sm" variant="outline" disabled={!canWrite}>Import Stock</Button>
              </form>
            </div>

            <form action={createOrUpdateProductAction} className="mt-6 grid gap-3">
              <AdminInput name="name" label="Product name" placeholder="Emerald Lace Short Kurti" />
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInput name="slug" label="Slug" placeholder="auto if blank" />
                <AdminInput name="sku" label="SKU" placeholder="auto if blank" />
              </div>
              <AdminInput name="shortDescription" label="Short description" placeholder="Premium short kurti with refined lace details." />
              <AdminTextarea name="description" label="Description" placeholder="Write a polished product story for the website." />
              <div className="grid gap-3 sm:grid-cols-3">
                <AdminInput name="price" label="Price" placeholder="1599" type="number" />
                <AdminInput name="salePrice" label="Sale price" placeholder="1299" type="number" />
                <AdminInput name="stock" label="Stock" placeholder="30" type="number" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInput name="fabric" label="Fabric" placeholder="Rayon Cotton" />
                <AdminInput name="colors" label="Colors" placeholder="Emerald, Ivory" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInput name="sizes" label="Sizes" placeholder="S, M, L, XL, XXL" defaultValue="S, M, L, XL, XXL" />
                <AdminInput name="tags" label="Tags" placeholder="new-arrival, premium, floral" />
              </div>
              <AdminInput name="image" label="Image URL" placeholder="/products/sawrna-short-kurti-01.jpeg" />
              <div className="grid gap-3 sm:grid-cols-3">
                <AdminInput name="rating" label="Rating" placeholder="4.8" type="number" step="0.1" defaultValue="4.7" />
                <AdminInput name="reviews" label="Reviews" placeholder="24" type="number" defaultValue="0" />
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald/70">
                  Status
                  <select name="status" className="h-11 rounded-[6px] border border-emerald/14 bg-ivory px-3 text-sm normal-case tracking-normal text-emerald outline-none focus:border-gold">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-2 rounded-[8px] border border-emerald/10 bg-sage/40 p-3 text-sm text-emerald sm:grid-cols-3">
                <label className="flex items-center gap-2"><input name="isNew" type="checkbox" className="accent-gold" /> New</label>
                <label className="flex items-center gap-2"><input name="isBestSeller" type="checkbox" className="accent-gold" /> Best seller</label>
                <label className="flex items-center gap-2"><input name="isTrending" type="checkbox" className="accent-gold" /> Trending</label>
              </div>
              <Button type="submit" disabled={!canWrite}>Save Product</Button>
            </form>
          </div>

          <div className="rounded-[8px] border border-emerald/12 bg-white/86 p-5 shadow-[0_22px_70px_rgba(4,45,40,0.1)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Live Catalog</p>
                <h2 className="font-display mt-2 text-3xl font-semibold text-emerald">Products on website</h2>
              </div>
              <p className="text-xs leading-5 text-muted">Public pages show active products only.</p>
            </div>

            <div className="mt-5 overflow-hidden rounded-[8px] border border-emerald/10">
              {catalog.products.map((product) => (
                <div key={product.slug} className="grid gap-4 border-b border-emerald/10 bg-white/72 p-4 last:border-b-0 md:grid-cols-[76px_1fr_auto] md:items-center">
                  <div className="relative h-24 w-20 overflow-hidden rounded-[6px] bg-sage">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover object-top" sizes="80px" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-2xl font-semibold leading-tight text-emerald">{product.name}</p>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${product.status === "active" ? "bg-emerald text-gold" : "bg-sage text-emerald"}`}>
                        {product.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">{product.sku} / {product.slug}</p>
                    <p className="mt-2 text-sm text-muted">Rs. {product.salePrice || product.price} / Stock {product.stock} / {product.fabric}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <form action={toggleProductStatusAction}>
                      <input type="hidden" name="slug" value={product.slug} />
                      <input type="hidden" name="status" value={product.status} />
                      <Button size="sm" variant="outline" disabled={!canWrite}>{product.status === "active" ? "Draft" : "Publish"}</Button>
                    </form>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="slug" value={product.slug} />
                      <Button size="sm" variant="ghost" disabled={!canWrite}>Delete</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function paymentLabel(value: string) {
  if (value === "cod") return "Cash on Delivery";
  if (value === "upi") return "Manual UPI";
  if (value === "whatsapp") return "WhatsApp Order";
  return "Payment Link";
}

function AdminInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald/70">
      {label}
      <input
        {...props}
        className="h-11 rounded-[6px] border border-emerald/14 bg-ivory px-3 text-sm normal-case tracking-normal text-emerald outline-none transition focus:border-gold"
      />
    </label>
  );
}

function AdminTextarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald/70">
      {label}
      <textarea
        {...props}
        rows={4}
        className="resize-none rounded-[6px] border border-emerald/14 bg-ivory px-3 py-2 text-sm normal-case tracking-normal text-emerald outline-none transition focus:border-gold"
      />
    </label>
  );
}
