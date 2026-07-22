import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { getCatalogProduct, getCatalogProducts, getRelatedCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return {};
  return {
    title: product.metaTitle,
    description: product.metaDescription,
    keywords: product.keywords,
    alternates: { canonical: product.canonicalUrl },
    openGraph: { title: product.metaTitle, description: product.metaDescription, images: [product.ogImage] },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  const related = await getRelatedCatalogProducts(product);

  return <ProductDetailClient product={product} related={related} />;
}
