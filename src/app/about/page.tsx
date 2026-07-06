export default function AboutPage() {
  return (
    <section className="container-lux py-16">
      <div className="gold-edge relative overflow-hidden rounded-[8px] border border-white/10 emerald-depth p-7 text-white lg:p-10">
        <div className="absolute inset-0 luxury-texture opacity-60" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">About SAWRNA</p>
          <h1 className="font-display mt-3 max-w-4xl text-5xl font-semibold text-white lg:text-7xl">Premium apparel for everyday denim styling.</h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70">
          SAWRNA is built around soft luxury: refined tones, flattering short-kurti silhouettes, breathable fabrics, and details that feel polished without losing comfort.
          </p>
        </div>
      </div>
    </section>
  );
}
