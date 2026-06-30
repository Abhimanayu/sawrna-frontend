import type { Metadata } from "next";
import { ProductCollection } from "@/components/product/product-collection";
import { getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Premium Short Kurtis",
  description: "Explore SAWRNA premium short kurtis with printed, floral, lace-trim, embroidered, sleeveless, and party-wear styles.",
};

export default async function ProductsPage() {
  const products = await getCatalogProducts();
  return <ProductCollection products={products} />;
}
