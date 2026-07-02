export const siteConfig = {
  name: "SAWRNA",
  tagline: "Premium Women's Wear",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sawrna-frontend.vercel.app",
  supportEmail: "care@sawrna.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999",
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "sawrna@upi",
  currency: "INR",
};

export const navItems = [
  { label: "New In", href: "/products?highlight=New%20In" },
  { label: "Shop", href: "/products" },
  { label: "Collections", href: "/products" },
  { label: "Best Sellers", href: "/products?highlight=Best%20Sellers" },
  { label: "Lookbook", href: "/#lookbook" },
];
