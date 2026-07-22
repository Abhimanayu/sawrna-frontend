"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteCatalogProduct, saveCatalogProduct, seedCatalogProducts, updateCatalogProductStatus } from "@/lib/catalog";
import { siteConfig } from "@/lib/config";

const productFormSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  sku: z.string().optional(),
  shortDescription: z.string().min(8),
  description: z.string().min(12),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative(),
  fabric: z.string().min(2),
  colors: z.string().min(2),
  sizes: z.string().min(1),
  tags: z.string().min(2),
  image: z.string().min(2),
  status: z.enum(["active", "draft"]),
  rating: z.coerce.number().min(0).max(5).default(4.7),
  reviews: z.coerce.number().int().nonnegative().default(0),
});

export async function createOrUpdateProductAction(formData: FormData) {
  const parsed = productFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.name);
  const sku = data.sku?.trim() || `SAW-SK-${Date.now().toString(36).toUpperCase()}`;
  const colors = splitList(data.colors);
  const sizes = splitList(data.sizes);
  const images = splitList(data.image);
  const tags = Array.from(new Set([...splitList(data.tags), "short-kurti"]));
  const salePrice = data.salePrice && data.salePrice > 0 ? data.salePrice : undefined;
  const discount = salePrice ? Math.round(((data.price - salePrice) / data.price) * 100) : undefined;

  const product = {
    name: data.name,
    slug,
    sku,
    shortDescription: data.shortDescription,
    description: data.description,
    price: data.price,
    salePrice,
    discount,
    stock: data.stock,
    fabric: data.fabric,
    colors,
    sizes,
    variants: buildVariants(colors, sizes, data.stock),
    images,
    gallery: images,
    tags,
    features: [
      "Premium short kurti silhouette",
      `${data.fabric} fabric`,
      "Denim-friendly styling",
      "SAWRNA premium finish",
    ],
    specifications: {
      Fit: "Short kurti fit",
      Fabric: data.fabric,
      Colors: colors.join(", "),
      Sizes: sizes.join(", "),
      Care: "Gentle hand wash separately",
    },
    metaTitle: `${data.name} | SAWRNA Short Kurtis`,
    metaDescription: data.shortDescription,
    keywords: ["SAWRNA", "short kurti", data.fabric, ...colors, ...tags],
    canonicalUrl: `${siteConfig.url}/products/${slug}`,
    ogImage: images[0],
    status: data.status,
    rating: data.rating,
    reviews: data.reviews,
    isNew: formData.get("isNew") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    isTrending: formData.get("isTrending") === "on",
  };

  try {
    await saveCatalogProduct(product);
    revalidateCatalog();
  } catch (error) {
    console.error("SAWRNA admin product save failed", error);
  }
}

export async function toggleProductStatusAction(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  const status = formData.get("status") === "active" ? "draft" : "active";
  if (!slug) return;

  try {
    await updateCatalogProductStatus(slug, status);
    revalidateCatalog();
  } catch (error) {
    console.error("SAWRNA product status update failed", error);
  }
}

export async function deleteProductAction(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  if (!slug) return;

  try {
    await deleteCatalogProduct(slug);
    revalidateCatalog();
  } catch (error) {
    console.error("SAWRNA product delete failed", error);
  }
}

export async function seedProductsAction() {
  try {
    await seedCatalogProducts();
    revalidateCatalog();
  } catch (error) {
    console.error("SAWRNA seed product import failed", error);
  }
}

function splitList(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function buildVariants(colors: string[], sizes: string[], stock: number) {
  const perVariant = Math.max(1, Math.floor(stock / Math.max(colors.length * sizes.length, 1)));
  return colors.flatMap((color) => sizes.map((size) => ({ color, size, stock: perVariant })));
}

function revalidateCatalog() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/search");
  revalidatePath("/sitemap.xml");
}
