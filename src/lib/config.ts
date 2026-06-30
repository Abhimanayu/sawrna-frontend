export const siteConfig = {
  name: "SAWRNA",
  tagline: "Premium Apparel",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sawrna.vercel.app",
  supportEmail: "care@sawrna.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999",
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "sawrna@upi",
  currency: "INR",
};

export const navItems = [
  { label: "New Arrivals", href: "/products?highlight=New%20arrivals" },
  { label: "Collections", href: "/products" },
  { label: "Lookbook", href: "/#lookbook" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
