import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LoadingCurtain } from "@/components/layout/loading-curtain";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Luxury women's short kurtis crafted for modern everyday styling. Shop premium printed, embroidered, lace-trim, and party-wear short kurtis from SAWRNA.",
  keywords: [
    "SAWRNA",
    "premium apparel",
    "short kurtis",
    "women short kurtis",
    "premium kurtis",
    "Indian fashion ecommerce",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: "Premium women's short kurtis with elegant fabrics, refined details, and modern silhouettes.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: "/brand/sawrna-logo-official.jpg", width: 1080, height: 1080, alt: "SAWRNA Premium Apparel" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: "Premium women's short kurtis for modern everyday styling.",
    images: ["/brand/sawrna-logo-official.jpg"],
  },
  icons: {
    icon: "/brand/sawrna-iconmark-official.jpg",
    shortcut: "/brand/sawrna-iconmark-official.jpg",
    apple: "/brand/sawrna-iconmark-official.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LoadingCurtain />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
