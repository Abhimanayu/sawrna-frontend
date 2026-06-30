import { siteConfig } from "@/lib/config";
import { connectDB } from "@/lib/db";
import {
  readLocalCatalogProducts,
  writeLocalCatalogProducts,
} from "@/lib/local-catalog-store";
import { products as seedProducts } from "@/lib/products";
import type { Product } from "@/lib/products";
import { ProductModel } from "@/models/product";

type CatalogOptions = {
  includeDraft?: boolean;
  fallbackToSeed?: boolean;
};

type ProductRecord = Partial<Product> & {
  isNewArrival?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

const fallbackOptions = { fallbackToSeed: true };

export function hasMongoConfig() {
  return Boolean(process.env.MONGODB_URI);
}

export async function getCatalogProducts(options: CatalogOptions = fallbackOptions): Promise<Product[]> {
  const includeDraft = Boolean(options.includeDraft);
  const fallbackToSeed = options.fallbackToSeed !== false;

  if (!hasMongoConfig()) {
    const localProducts = await readLocalCatalogProducts();
    if (localProducts.length > 0) return filterProducts(localProducts, includeDraft);
    return fallbackToSeed ? filterSeedProducts(includeDraft) : [];
  }

  try {
    await connectDB();
    const query = includeDraft ? {} : { status: "active" };
    const docs = await ProductModel.find(query).sort({ createdAt: -1 }).lean<ProductRecord[]>();
    if (docs.length > 0) return docs.map(toProduct);
    return fallbackToSeed ? filterSeedProducts(includeDraft) : [];
  } catch (error) {
    console.error("SAWRNA catalog database read failed", error);
    return fallbackToSeed ? filterSeedProducts(includeDraft) : [];
  }
}

export async function getCatalogProduct(slug: string) {
  if (hasMongoConfig()) {
    try {
      await connectDB();
      const doc = await ProductModel.findOne({ slug, status: "active" }).lean<ProductRecord>();
      if (doc) return toProduct(doc);
    } catch (error) {
      console.error("SAWRNA product database read failed", error);
    }
  }

  const localProducts = await readLocalCatalogProducts();
  return (
    localProducts.find((product) => product.slug === slug && product.status === "active") ||
    seedProducts.find((product) => product.slug === slug && product.status === "active")
  );
}

export async function getRelatedCatalogProducts(product: Product, limit = 4) {
  const products = await getCatalogProducts();
  return products
    .filter((item) => item.slug !== product.slug && item.tags.some((tag) => product.tags.includes(tag)))
    .concat(products.filter((item) => item.slug !== product.slug))
    .filter((item, index, list) => list.findIndex((next) => next.slug === item.slug) === index)
    .slice(0, limit);
}

export async function searchCatalogProducts(query: string) {
  const q = query.trim().toLowerCase();
  const products = await getCatalogProducts();
  if (!q) return products;
  return products.filter((product) =>
    [product.name, product.description, product.fabric, product.colors.join(" "), product.tags.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export async function getAdminCatalogSnapshot() {
  if (!hasMongoConfig()) {
    const localProducts = await readLocalCatalogProducts();
    return {
      products: localProducts.length > 0 ? filterProducts(localProducts, true) : filterSeedProducts(true),
      databaseConfigured: false,
      databaseConnected: false,
      databaseCount: localProducts.length,
      canWrite: true,
      source: localProducts.length > 0 ? ("local" as const) : ("seed" as const),
    };
  }

  try {
    await connectDB();
    const docs = await ProductModel.find({}).sort({ createdAt: -1 }).lean<ProductRecord[]>();
    return {
      products: docs.length > 0 ? docs.map(toProduct) : filterSeedProducts(true),
      databaseConfigured: true,
      databaseConnected: true,
      databaseCount: docs.length,
      canWrite: true,
      source: docs.length > 0 ? ("database" as const) : ("seed" as const),
    };
  } catch (error) {
    console.error("SAWRNA admin catalog snapshot failed", error);
    return {
      products: filterSeedProducts(true),
      databaseConfigured: true,
      databaseConnected: false,
      databaseCount: 0,
      canWrite: false,
      source: "seed" as const,
    };
  }
}

export async function seedCatalogProducts() {
  if (!hasMongoConfig()) {
    await writeLocalCatalogProducts(seedProducts);
    return;
  }

  await connectDB();
  await Promise.all(
    seedProducts.map((product) =>
      ProductModel.updateOne({ slug: product.slug }, { $set: toDatabaseProduct(product) }, { upsert: true, runValidators: true }),
    ),
  );
}

export async function saveCatalogProduct(product: Product) {
  if (!hasMongoConfig()) {
    const localProducts = await readLocalCatalogProducts();
    const baseProducts = localProducts.length > 0 ? localProducts : seedProducts;
    const next = baseProducts.some((item) => item.slug === product.slug)
      ? baseProducts.map((item) => (item.slug === product.slug ? product : item))
      : [product, ...baseProducts];
    await writeLocalCatalogProducts(next);
    return;
  }

  await connectDB();
  await ProductModel.updateOne({ slug: product.slug }, { $set: toDatabaseProduct(product) }, { upsert: true, runValidators: true });
}

export async function updateCatalogProductStatus(slug: string, status: Product["status"]) {
  if (!hasMongoConfig()) {
    const localProducts = await readLocalCatalogProducts();
    const baseProducts = localProducts.length > 0 ? localProducts : seedProducts;
    await writeLocalCatalogProducts(baseProducts.map((product) => (product.slug === slug ? { ...product, status } : product)));
    return;
  }

  await connectDB();
  await ProductModel.updateOne({ slug }, { $set: { status } });
}

export async function deleteCatalogProduct(slug: string) {
  if (!hasMongoConfig()) {
    const localProducts = await readLocalCatalogProducts();
    const baseProducts = localProducts.length > 0 ? localProducts : seedProducts;
    await writeLocalCatalogProducts(baseProducts.filter((product) => product.slug !== slug));
    return;
  }

  await connectDB();
  await ProductModel.deleteOne({ slug });
}

function filterSeedProducts(includeDraft: boolean) {
  return includeDraft ? seedProducts : seedProducts.filter((product) => product.status === "active");
}

function filterProducts(products: Product[], includeDraft: boolean) {
  return includeDraft ? products : products.filter((product) => product.status === "active");
}

function toProduct(record: ProductRecord): Product {
  const images = normalizeList(record.images);
  const gallery = normalizeList(record.gallery);
  const firstImage = images[0] || gallery[0] || "/products/sawrna-short-kurti-01.jpeg";
  const price = Number(record.price || 0);
  const salePrice = record.salePrice ? Number(record.salePrice) : undefined;

  return {
    name: record.name || "SAWRNA Short Kurti",
    slug: record.slug || "sawrna-short-kurti",
    sku: record.sku || `SAW-SK-${Date.now()}`,
    description: record.description || "Premium SAWRNA short kurti crafted for modern everyday styling.",
    shortDescription: record.shortDescription || "Premium short kurti with SAWRNA finish.",
    price,
    salePrice,
    discount: record.discount ?? (salePrice && price ? Math.round(((price - salePrice) / price) * 100) : undefined),
    stock: Number(record.stock || 0),
    fabric: record.fabric || "Premium Cotton",
    colors: normalizeList(record.colors, ["Emerald"]),
    sizes: normalizeList(record.sizes, ["S", "M", "L", "XL", "XXL"]),
    variants: Array.isArray(record.variants) && record.variants.length ? record.variants : [],
    images: images.length ? images : [firstImage],
    gallery: gallery.length ? gallery : [firstImage],
    tags: normalizeList(record.tags, ["short-kurti", "premium"]),
    features: normalizeList(record.features, ["Premium short kurti silhouette", "Easy denim-friendly styling"]),
    specifications: record.specifications || {},
    metaTitle: record.metaTitle || `${record.name || "SAWRNA Short Kurti"} | SAWRNA`,
    metaDescription: record.metaDescription || "Shop premium short kurtis from SAWRNA Premium Apparel.",
    keywords: normalizeList(record.keywords, ["SAWRNA", "short kurti", "premium apparel"]),
    canonicalUrl: record.canonicalUrl || `${siteConfig.url}/products/${record.slug || "sawrna-short-kurti"}`,
    ogImage: record.ogImage || firstImage,
    status: record.status === "draft" ? "draft" : "active",
    rating: Number(record.rating || 4.7),
    reviews: Number(record.reviews || 0),
    isNew: Boolean(record.isNewArrival ?? record.isNew),
    isBestSeller: Boolean(record.isBestSeller),
    isTrending: Boolean(record.isTrending),
  };
}

function toDatabaseProduct(product: Product) {
  const { isNew, ...rest } = product;
  return { ...rest, isNewArrival: Boolean(isNew) };
}

function normalizeList(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return fallback;
}
