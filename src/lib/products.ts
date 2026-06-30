import { siteConfig } from "@/lib/config";

export type Product = {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  discount?: number;
  stock: number;
  fabric: string;
  colors: string[];
  sizes: string[];
  variants: { color: string; size: string; stock: number }[];
  images: string[];
  gallery: string[];
  tags: string[];
  features: string[];
  specifications: Record<string, string>;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  status: "active" | "draft";
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
};

type ProductSeed = {
  name: string;
  slug: string;
  image: string;
  color: string;
  fabric: string;
  neckline: string;
  sleeve: string;
  fit: string;
  price: number;
  salePrice?: number;
  stock: number;
  tags: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
};

const commonSizes = ["S", "M", "L", "XL", "XXL"];
const productBase = "/products";

const seeds: ProductSeed[] = [
  {
    name: "Gulbahar Rani Floral Short Kurti",
    slug: "gulbahar-rani-floral-short-kurti",
    image: "sawrna-short-kurti-01.jpeg",
    color: "Rani Pink",
    fabric: "Rayon Cotton",
    neckline: "Square neck",
    sleeve: "Three-quarter bell sleeves",
    fit: "Straight short kurti",
    price: 1599,
    salePrice: 1299,
    stock: 28,
    tags: ["new-arrival", "floral", "short-kurti", "premium"],
    rating: 4.8,
    reviews: 37,
    isNew: true,
    isBestSeller: true,
  },
  {
    name: "Roselle Pink Bell Sleeve Short Kurti",
    slug: "roselle-pink-bell-sleeve-short-kurti",
    image: "sawrna-short-kurti-02.jpeg",
    color: "Rose Pink",
    fabric: "Muslin Cotton",
    neckline: "Square neck",
    sleeve: "Bell sleeves with lace trim",
    fit: "A-line short kurti",
    price: 1499,
    salePrice: 1199,
    stock: 34,
    tags: ["new-arrival", "floral", "lace-trim", "short-kurti"],
    rating: 4.7,
    reviews: 29,
    isNew: true,
    isTrending: true,
  },
  {
    name: "Noor Ivory Mirror Work Short Kurti",
    slug: "noor-ivory-mirror-work-short-kurti",
    image: "sawrna-short-kurti-03.jpeg",
    color: "Ivory",
    fabric: "Cotton Silk",
    neckline: "Keyhole square neck",
    sleeve: "Full sleeves",
    fit: "Fitted short kurti",
    price: 2199,
    salePrice: 1899,
    stock: 16,
    tags: ["premium", "mirror-work", "party-wear", "short-kurti"],
    rating: 4.9,
    reviews: 44,
    isBestSeller: true,
  },
  {
    name: "Mahira Maroon Printed Short Kurti",
    slug: "mahira-maroon-printed-short-kurti",
    image: "sawrna-short-kurti-04.jpeg",
    color: "Maroon",
    fabric: "Cotton Flex",
    neckline: "Mandarin V neck",
    sleeve: "Three-quarter sleeves",
    fit: "Pleated waist short kurti",
    price: 1399,
    salePrice: 1099,
    stock: 42,
    tags: ["best-seller", "printed", "daily-wear", "short-kurti"],
    rating: 4.8,
    reviews: 51,
    isBestSeller: true,
  },
  {
    name: "Navy Dori Tie Sleeveless Short Kurti",
    slug: "navy-dori-tie-sleeveless-short-kurti",
    image: "sawrna-short-kurti-05.jpeg",
    color: "Navy Blue",
    fabric: "Rayon Slub",
    neckline: "Straight square neck",
    sleeve: "Sleeveless tie straps",
    fit: "Side-slit short kurti",
    price: 1299,
    salePrice: 999,
    stock: 25,
    tags: ["handpicked", "sleeveless", "summer", "short-kurti"],
    rating: 4.6,
    reviews: 22,
    isTrending: true,
  },
  {
    name: "Pista Leaf Print Sleeveless Short Kurti",
    slug: "pista-leaf-print-sleeveless-short-kurti",
    image: "sawrna-short-kurti-06.jpeg",
    color: "Pista Green",
    fabric: "Rayon Slub",
    neckline: "Square neck",
    sleeve: "Sleeveless",
    fit: "Straight easy fit",
    price: 1199,
    salePrice: 899,
    stock: 38,
    tags: ["handpicked", "summer", "leaf-print", "short-kurti"],
    rating: 4.5,
    reviews: 18,
  },
  {
    name: "Indigo Frill Sleeve Short Kurti",
    slug: "indigo-frill-sleeve-short-kurti",
    image: "sawrna-short-kurti-07.jpeg",
    color: "Indigo Blue",
    fabric: "Cambric Cotton",
    neckline: "Square neck",
    sleeve: "Bell sleeves with frill edge",
    fit: "Peplum short kurti",
    price: 1499,
    salePrice: 1199,
    stock: 31,
    tags: ["trending", "printed", "indigo", "short-kurti"],
    rating: 4.7,
    reviews: 33,
    isTrending: true,
  },
  {
    name: "Rani Sleeveless Straight Short Kurti",
    slug: "rani-sleeveless-straight-short-kurti",
    image: "sawrna-short-kurti-08.jpeg",
    color: "Rani Pink",
    fabric: "Cotton Flex",
    neckline: "Round neck",
    sleeve: "Sleeveless",
    fit: "Straight longline short kurti",
    price: 1299,
    salePrice: 999,
    stock: 46,
    tags: ["daily-wear", "sleeveless", "printed", "short-kurti"],
    rating: 4.6,
    reviews: 26,
  },
  {
    name: "Blush Swirl Long Sleeve Short Kurti",
    slug: "blush-swirl-long-sleeve-short-kurti",
    image: "sawrna-short-kurti-09.jpeg",
    color: "Blush Pink",
    fabric: "Viscose Rayon",
    neckline: "Round neck",
    sleeve: "Full sleeves",
    fit: "Relaxed straight fit",
    price: 1699,
    salePrice: 1399,
    stock: 19,
    tags: ["premium", "printed", "work-wear", "short-kurti"],
    rating: 4.8,
    reviews: 35,
    isNew: true,
  },
  {
    name: "Ivory Angrakha Tie-Up Short Kurti",
    slug: "ivory-angrakha-tie-up-short-kurti",
    image: "sawrna-short-kurti-10.jpeg",
    color: "Ivory",
    fabric: "Cotton Linen",
    neckline: "Angrakha V neck",
    sleeve: "Full sleeves",
    fit: "Wrap short kurti",
    price: 1699,
    salePrice: 1399,
    stock: 21,
    tags: ["handpicked", "angrakha", "printed", "short-kurti"],
    rating: 4.7,
    reviews: 24,
  },
  {
    name: "Black Maroon Border Short Kurti",
    slug: "black-maroon-border-short-kurti",
    image: "sawrna-short-kurti-11.jpeg",
    color: "Black",
    fabric: "Rayon Cotton",
    neckline: "Sweetheart neck",
    sleeve: "Bell sleeves",
    fit: "Straight short kurti",
    price: 1799,
    salePrice: 1499,
    stock: 17,
    tags: ["best-seller", "premium", "border-print", "short-kurti"],
    rating: 4.9,
    reviews: 48,
    isBestSeller: true,
  },
  {
    name: "Olive Lace-Up Cotton Short Kurti",
    slug: "olive-lace-up-cotton-short-kurti",
    image: "sawrna-short-kurti-12.jpeg",
    color: "Olive Green",
    fabric: "Cotton Linen",
    neckline: "V neck",
    sleeve: "Full sleeves",
    fit: "Side lace-up short kurti",
    price: 1499,
    salePrice: 1199,
    stock: 29,
    tags: ["new-arrival", "solid", "lace-up", "short-kurti"],
    rating: 4.6,
    reviews: 17,
    isNew: true,
  },
  {
    name: "Mocha Printed Peplum Short Kurti",
    slug: "mocha-printed-peplum-short-kurti",
    image: "sawrna-short-kurti-13.jpeg",
    color: "Mocha Brown",
    fabric: "Cotton Flex",
    neckline: "V neck",
    sleeve: "Three-quarter sleeves",
    fit: "Peplum short kurti",
    price: 1399,
    salePrice: 1099,
    stock: 36,
    tags: ["printed", "daily-wear", "handpicked", "short-kurti"],
    rating: 4.7,
    reviews: 32,
  },
  {
    name: "Wine Lace Edge Bell Sleeve Short Kurti",
    slug: "wine-lace-edge-bell-sleeve-short-kurti",
    image: "sawrna-short-kurti-14.jpeg",
    color: "Wine",
    fabric: "Modal Cotton",
    neckline: "Square neck",
    sleeve: "Bell sleeves with lace",
    fit: "Straight short kurti",
    price: 1599,
    salePrice: 1299,
    stock: 23,
    tags: ["trending", "solid", "lace-trim", "short-kurti"],
    rating: 4.8,
    reviews: 40,
    isTrending: true,
  },
  {
    name: "Ivory Floral Pom-Pom Short Kurti",
    slug: "ivory-floral-pom-pom-short-kurti",
    image: "sawrna-short-kurti-15.jpeg",
    color: "Ivory Floral",
    fabric: "Cambric Cotton",
    neckline: "Round notch neck",
    sleeve: "Full sleeves",
    fit: "Angrakha short kurti",
    price: 1699,
    salePrice: 1399,
    stock: 27,
    tags: ["floral", "pom-pom", "premium", "short-kurti"],
    rating: 4.7,
    reviews: 28,
  },
  {
    name: "Fuchsia Wrap Bell Sleeve Short Kurti",
    slug: "fuchsia-wrap-bell-sleeve-short-kurti",
    image: "sawrna-short-kurti-16.jpeg",
    color: "Fuchsia",
    fabric: "Muslin Cotton",
    neckline: "Wrap V neck",
    sleeve: "Bell sleeves",
    fit: "Wrap short kurti",
    price: 1599,
    salePrice: 1299,
    stock: 33,
    tags: ["best-seller", "wrap", "printed", "short-kurti"],
    rating: 4.8,
    reviews: 45,
    isBestSeller: true,
  },
  {
    name: "Baby Pink Lace Trim Short Kurti",
    slug: "baby-pink-lace-trim-short-kurti",
    image: "sawrna-short-kurti-17.jpeg",
    color: "Baby Pink",
    fabric: "Modal Cotton",
    neckline: "Square neck",
    sleeve: "Bell sleeves",
    fit: "Straight short kurti",
    price: 1399,
    salePrice: 1099,
    stock: 41,
    tags: ["solid", "lace-trim", "daily-wear", "short-kurti"],
    rating: 4.6,
    reviews: 21,
  },
  {
    name: "Sky Blue Embroidered Short Kurti",
    slug: "sky-blue-embroidered-short-kurti",
    image: "sawrna-short-kurti-18.jpeg",
    color: "Sky Blue",
    fabric: "Cotton Slub",
    neckline: "Square neck",
    sleeve: "Full sleeves",
    fit: "Straight side-slit short kurti",
    price: 1799,
    salePrice: 1499,
    stock: 18,
    tags: ["premium", "embroidered", "new-arrival", "short-kurti"],
    rating: 4.8,
    reviews: 34,
    isNew: true,
  },
  {
    name: "Radhika Blush Tassel Short Kurti",
    slug: "radhika-blush-tassel-short-kurti",
    image: "sawrna-short-kurti-19.jpeg",
    color: "Dusty Blush",
    fabric: "Viscose Rayon",
    neckline: "Round neck",
    sleeve: "Full sleeves",
    fit: "Straight short kurti",
    price: 2199,
    salePrice: 1799,
    stock: 15,
    tags: ["premium", "tassel", "party-wear", "short-kurti"],
    rating: 4.9,
    reviews: 39,
    isTrending: true,
  },
];

function buildVariants(color: string, stock: number) {
  const split = [0.18, 0.24, 0.24, 0.2, 0.14];
  return commonSizes.map((size, index) => ({
    color,
    size,
    stock: Math.max(1, Math.floor(stock * split[index])),
  }));
}

function makeProduct(seed: ProductSeed, index: number): Product {
  const image = `${productBase}/${seed.image}`;
  const discount = seed.salePrice ? Math.round(((seed.price - seed.salePrice) / seed.price) * 100) : undefined;

  return {
    name: seed.name,
    slug: seed.slug,
    sku: `SAW-SK-${String(index + 1).padStart(3, "0")}`,
    shortDescription: `${seed.color} ${seed.fit.toLowerCase()} in ${seed.fabric.toLowerCase()}, designed for denim, palazzos, and everyday styling.`,
    description: `${seed.name} is a premium short kurti crafted in ${seed.fabric.toLowerCase()} with a ${seed.neckline.toLowerCase()}, ${seed.sleeve.toLowerCase()}, and a polished ${seed.fit.toLowerCase()} silhouette. Pair it with denim, flared pants, or straight trousers for a complete SAWRNA look.`,
    price: seed.price,
    salePrice: seed.salePrice,
    discount,
    stock: seed.stock,
    fabric: seed.fabric,
    colors: [seed.color],
    sizes: commonSizes,
    variants: buildVariants(seed.color, seed.stock),
    images: [image],
    gallery: [image],
    tags: seed.tags,
    features: [
      "Premium short kurti silhouette",
      seed.neckline,
      seed.sleeve,
      "Pairs well with denim and wide-leg pants",
    ],
    specifications: {
      Fit: seed.fit,
      Fabric: seed.fabric,
      Neckline: seed.neckline,
      Sleeve: seed.sleeve,
      Length: "Short kurti length",
      Care: "Gentle hand wash separately",
    },
    metaTitle: `${seed.name} | SAWRNA Short Kurtis`,
    metaDescription: `Shop ${seed.name}, a premium ${seed.color.toLowerCase()} short kurti from SAWRNA with dummy stock and size variants.`,
    keywords: ["short kurti", "women short kurti", seed.color.toLowerCase(), seed.fabric.toLowerCase(), "SAWRNA"],
    canonicalUrl: `${siteConfig.url}/products/${seed.slug}`,
    ogImage: image,
    status: "active",
    rating: seed.rating,
    reviews: seed.reviews,
    isNew: seed.isNew,
    isBestSeller: seed.isBestSeller,
    isTrending: seed.isTrending,
  };
}

export const products: Product[] = seeds.map(makeProduct);

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((item) => item.slug !== product.slug && item.tags.some((tag) => product.tags.includes(tag)))
    .concat(products.filter((item) => item.slug !== product.slug))
    .filter((item, index, list) => list.findIndex((next) => next.slug === item.slug) === index)
    .slice(0, limit);
}
