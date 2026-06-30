import Link from "next/link";
import { Camera, Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/lib/config";

const columns = [
  { title: "Shop", links: [["New Arrivals", "/products?highlight=New%20arrivals"], ["Best Sellers", "/products?highlight=Best%20sellers"], ["Wishlist", "/wishlist"], ["Track Order", "/track-order"]] },
  { title: "Care", links: [["Contact", "/contact"], ["FAQ", "/faq"], ["Shipping Policy", "/shipping-policy"], ["Refund Policy", "/refund-policy"]] },
  { title: "Company", links: [["About", "/about"], ["Privacy Policy", "/privacy-policy"], ["Terms & Conditions", "/terms-and-conditions"]] },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-emerald text-white">
      <div className="container-lux grid gap-10 py-14 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <Logo surface="dark" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
            Premium short kurtis made for denim days, graceful workwear, casual outings, and polished everyday styling.
          </p>
          <div className="mt-6 flex gap-3 text-blush">
            {[Camera, Mail, MessageCircle].map((Icon, index) => (
              <span key={index} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                <Icon size={18} />
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-blush">{column.title}</h3>
              <div className="mt-4 grid gap-3">
                {column.links.map(([label, href]) => (
                  <Link key={href} href={href} className="text-sm text-white/68 transition hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-lux flex flex-col justify-between gap-3 text-xs text-white/55 sm:flex-row">
          <span>Copyright 2026 {siteConfig.name}. All rights reserved.</span>
          <span>COD, Manual UPI, WhatsApp order, payment link supported.</span>
        </div>
      </div>
    </footer>
  );
}
