export function PolicyPage({ title, body }: { title: string; body: string }) {
  return (
    <section className="container-lux py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">SAWRNA care</p>
      <h1 className="font-display mt-3 text-5xl font-semibold text-emerald">{title}</h1>
      <div className="gold-edge mt-8 max-w-3xl rounded-[8px] border border-emerald/12 bg-white/84 p-6 text-lg leading-8 text-muted shadow-[0_18px_50px_rgba(4,45,40,0.08)]">{body}</div>
    </section>
  );
}
