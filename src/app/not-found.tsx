import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-lux grid min-h-[70vh] place-items-center py-20 text-center">
      <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/86 p-7 shadow-[0_20px_60px_rgba(4,45,40,0.09)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">404</p>
        <h1 className="font-display mt-3 text-6xl font-semibold text-emerald">This piece slipped away.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">The page you are looking for does not exist or has moved.</p>
        <Button asChild className="mt-8"><Link href="/products">Shop Collection</Link></Button>
      </div>
    </section>
  );
}
