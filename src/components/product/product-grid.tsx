import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/products";

export function ProductGrid({ products, priority = false }: { products: Product[]; priority?: boolean }) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12">
      {products.map((product, index) => (
        <ProductCard key={product.slug} product={product} priority={priority && index < 2} />
      ))}
    </div>
  );
}
