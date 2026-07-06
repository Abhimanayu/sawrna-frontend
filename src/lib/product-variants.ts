import type { Product } from "@/lib/products";

export function getColorVariants(product: Product, color: string) {
  return product.variants.filter((variant) => variant.color === color);
}

export function getVariantStock(product: Product, color: string, size: string) {
  const match = product.variants.find((variant) => variant.color === color && variant.size === size);
  if (match) return Math.max(Number(match.stock || 0), 0);
  return product.variants.length ? 0 : Math.max(Number(product.stock || 0), 0);
}

export function getAvailableSizes(product: Product, color: string) {
  if (!product.variants.length) return product.sizes;
  return product.sizes.filter((size) => getVariantStock(product, color, size) > 0);
}

export function getColorStock(product: Product, color: string) {
  if (!product.variants.length) return Math.max(Number(product.stock || 0), 0);
  return getColorVariants(product, color).reduce((sum, variant) => sum + Math.max(Number(variant.stock || 0), 0), 0);
}

export function getFirstAvailableColor(product: Product) {
  return product.colors.find((color) => getColorStock(product, color) > 0) || product.colors[0] || "";
}

export function getFirstAvailableSize(product: Product, color: string) {
  return getAvailableSizes(product, color)[0] || product.sizes[0] || "";
}
