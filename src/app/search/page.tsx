import type { Metadata } from "next";
import { SearchExperience } from "@/components/search/search-experience";
import { getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search SAWRNA products by fabric, color, size, rating, price, and availability.",
};

export default async function SearchPage() {
  const products = await getCatalogProducts();
  return <SearchExperience products={products} />;
}
