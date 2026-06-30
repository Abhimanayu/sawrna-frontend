import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <section className="container-lux grid gap-10 py-16 lg:grid-cols-[0.8fr_1fr]">
      <div className="gold-edge rounded-[8px] border border-emerald/12 bg-white/86 p-6 shadow-[0_20px_60px_rgba(4,45,40,0.09)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Contact</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-emerald">We are here to help.</h1>
        <p className="mt-4 text-muted">For sizing, custom help, order updates, or payment verification, reach the SAWRNA care team.</p>
      </div>
      <ContactForm />
    </section>
  );
}
