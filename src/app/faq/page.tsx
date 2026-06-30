const faqs = [
  ["Do you offer COD?", "Yes, Cash on Delivery is available for eligible Indian pincodes."],
  ["How does manual UPI work?", "Pay to the displayed UPI ID, upload the screenshot, and the admin team verifies the payment before confirmation."],
  ["Can I order on WhatsApp?", "Yes, checkout can generate a complete order summary message for WhatsApp."],
  ["What sizes are available?", "Most products support XS to XXL depending on stock and silhouette."],
];

export default function FAQPage() {
  return (
    <section className="container-lux py-16">
      <div className="relative overflow-hidden rounded-[8px] border border-white/10 emerald-depth p-6 text-white">
        <div className="absolute inset-0 luxury-texture opacity-60" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Care desk</p>
          <h1 className="font-display mt-2 text-5xl font-semibold text-white">FAQ</h1>
        </div>
      </div>
      <div className="mt-8 grid gap-4">
        {faqs.map(([q, a]) => (
          <div key={q} className="gold-edge rounded-[8px] border border-emerald/12 bg-white/84 p-5 shadow-[0_14px_34px_rgba(4,45,40,0.07)]">
            <h2 className="font-display text-2xl font-semibold text-emerald">{q}</h2>
            <p className="mt-2 text-muted">{a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
