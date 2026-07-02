import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getLocalDataDir } from "@/lib/local-data";
import type { Product } from "@/lib/products";

const dataDir = getLocalDataDir();
const catalogFile = path.join(dataDir, "products.json");
let memoryProducts: Product[] = [];

export async function readLocalCatalogProducts() {
  try {
    const raw = await readFile(catalogFile, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryProducts = parsed as Product[];
      return memoryProducts;
    }
    return memoryProducts;
  } catch {
    return memoryProducts;
  }
}

export async function writeLocalCatalogProducts(products: Product[]) {
  memoryProducts = products;
  try {
    await mkdir(dataDir, { recursive: true });
    await writeFile(catalogFile, JSON.stringify(products, null, 2), "utf8");
  } catch (error) {
    console.warn("SAWRNA local catalog file write skipped; using memory fallback", error);
  }
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
