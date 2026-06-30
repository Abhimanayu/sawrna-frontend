import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Product } from "@/lib/products";

const dataDir = path.join(process.cwd(), ".sawrna-data");
const catalogFile = path.join(dataDir, "products.json");

export async function readLocalCatalogProducts() {
  try {
    const raw = await readFile(catalogFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch {
    return [];
  }
}

export async function writeLocalCatalogProducts(products: Product[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(catalogFile, JSON.stringify(products, null, 2), "utf8");
}

export async function upsertLocalCatalogProduct(product: Product) {
  const products = await readLocalCatalogProducts();
  const next = products.some((item) => item.slug === product.slug)
    ? products.map((item) => (item.slug === product.slug ? product : item))
    : [product, ...products];
  await writeLocalCatalogProducts(next);
}

export async function updateLocalCatalogProductStatus(slug: string, status: Product["status"]) {
  const products = await readLocalCatalogProducts();
  await writeLocalCatalogProducts(products.map((product) => (product.slug === slug ? { ...product, status } : product)));
}

export async function deleteLocalCatalogProduct(slug: string) {
  const products = await readLocalCatalogProducts();
  await writeLocalCatalogProducts(products.filter((product) => product.slug !== slug));
}
