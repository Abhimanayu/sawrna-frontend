export default function Loading() {
  return (
    <section className="container-lux py-12 lg:py-16" aria-label="Loading SAWRNA page">
      <div className="relative overflow-hidden rounded-[8px] border border-emerald/12 bg-white/78 p-5 shadow-[0_18px_54px_rgba(4,45,40,0.08)] lg:p-8">
        <div className="absolute inset-0 ivory-texture opacity-70" />
        <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="grid gap-4">
            <div className="h-9 w-48 animate-pulse rounded-full bg-gold/20" />
            <div className="h-16 w-full max-w-xl animate-pulse rounded-[8px] bg-emerald/10" />
            <div className="h-16 w-4/5 animate-pulse rounded-[8px] bg-emerald/10" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-emerald/10" />
            <div className="mt-4 flex gap-3">
              <div className="h-12 w-40 animate-pulse rounded-full bg-emerald/15" />
              <div className="h-12 w-40 animate-pulse rounded-full bg-gold/20" />
            </div>
          </div>
          <div className="aspect-[4/3] animate-pulse rounded-[8px] border border-gold/20 bg-[linear-gradient(135deg,#f8f3ea,#dfe9e2)]" />
        </div>
      </div>
    </section>
  );
}
