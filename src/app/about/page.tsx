const tajCottonBenefits = [
  "Soft and gentle feel on the skin",
  "Lightweight and breathable construction",
  "Excellent comfort for all-day wear",
  "Strong and durable weave for long-lasting quality",
  "Beautiful color retention after washing",
  "Elegant fall and premium appearance",
  "Suitable for every season, especially Indian weather",
];

export default function AboutPage() {
  return (
    <section className="container-lux py-16 lg:py-20">
      <div className="gold-edge relative overflow-hidden rounded-[8px] border border-white/10 emerald-depth p-7 text-white shadow-[0_24px_80px_rgba(4,45,40,0.18)] lg:p-10">
        <div className="absolute inset-0 luxury-texture opacity-60" />
        <div className="relative max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">About SAWRNA</p>
          <h1 className="font-display mt-3 text-5xl font-semibold text-white lg:text-7xl">Tradition, craftsmanship, and everyday elegance.</h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/76">
            At SAWRNA, we believe clothing is more than fashion; it is a reflection of tradition, craftsmanship, and everyday elegance. Every piece is thoughtfully designed for women who appreciate premium quality, timeless style, and lasting comfort.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">
            Our collection is crafted using carefully selected Taj Cotton fabric and enhanced with beautiful hand block print artistry, creating garments that blend heritage with modern fashion.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="gold-edge rounded-[8px] border border-emerald/12 bg-white/86 p-6 shadow-[0_18px_50px_rgba(4,45,40,0.08)] lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Our Signature Block Print</p>
          <h2 className="font-display mt-3 text-4xl font-semibold text-emerald lg:text-5xl">Handcrafted artistry in every print.</h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            Block printing is one of India&apos;s oldest and most respected textile art forms. Skilled artisans hand-carve intricate wooden blocks and stamp each design individually onto the fabric using premium-quality colors.
          </p>
          <p className="mt-4 text-lg leading-8 text-muted">
            Because every print is handcrafted, no two pieces are exactly alike. This makes each SAWRNA kurti unique, carrying the beauty of authentic craftsmanship rather than mass production.
          </p>
          <p className="mt-4 rounded-[8px] border border-gold/20 bg-[#f8f4ea] px-5 py-4 text-base leading-7 text-emerald/80">
            The slight variations in print are not imperfections - they are the hallmark of genuine handmade artistry.
          </p>
        </article>

        <article className="gold-edge rounded-[8px] border border-emerald/12 bg-[linear-gradient(180deg,rgba(255,250,242,0.98),rgba(248,247,244,0.92))] p-6 shadow-[0_18px_50px_rgba(4,45,40,0.08)] lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Why We Choose Taj Cotton</p>
          <h2 className="font-display mt-3 text-4xl font-semibold text-emerald lg:text-5xl">Premium comfort, season after season.</h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            Taj Cotton is known for its premium finish, soft texture, and exceptional comfort. We carefully select this fabric because it offers:
          </p>
          <ul className="mt-6 grid gap-3">
            {tajCottonBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 rounded-[8px] border border-emerald/10 bg-white/80 px-4 py-3 text-base leading-7 text-emerald/86 shadow-[0_10px_30px_rgba(4,45,40,0.04)]">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-7 text-muted">
            The combination of Taj Cotton with traditional block printing creates outfits that are both luxurious and practical for everyday wear.
          </p>
        </article>
      </div>

      <article className="gold-edge mt-8 rounded-[8px] border border-emerald/12 bg-white/90 p-6 shadow-[0_18px_50px_rgba(4,45,40,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Our Promise</p>
        <h2 className="font-display mt-3 text-4xl font-semibold text-emerald lg:text-5xl">Made with care, finished with purpose.</h2>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-muted">
          Every SAWRNA garment is designed with attention to detail - from fabric selection and printing to stitching and finishing. Our goal is to offer premium ethnic wear that celebrates Indian craftsmanship while meeting the expectations of modern women.
        </p>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-muted">
          When you choose SAWRNA, you choose authenticity, comfort, quality, and timeless elegance in every stitch.
        </p>
      </article>
    </section>
  );
}
