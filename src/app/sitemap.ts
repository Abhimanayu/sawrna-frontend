import type { MetadataRoute } from "next";
import { getCatalogProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalogProducts();
  const staticPages = ["", "/products", "/search", "/about", "/contact", "/faq", "/privacy-policy", "/refund-policy", "/shipping-policy", "/terms-and-conditions"];
  return [
    ...staticPages.map((url) => ({ url: `${siteConfig.url}${url}`, lastModified: new Date() })),
    ...products.map((product) => ({ url: product.canonicalUrl, lastModified: new Date() })),
  ];
}
