import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    description: String,
    shortDescription: String,
    price: Number,
    salePrice: Number,
    discount: Number,
    stock: Number,
    fabric: String,
    colors: [String],
    sizes: [String],
    variants: [{ color: String, size: String, stock: Number }],
    images: [String],
    gallery: [String],
    tags: [String],
    features: [String],
    specifications: Schema.Types.Mixed,
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    canonicalUrl: String,
    ogImage: String,
    status: { type: String, enum: ["active", "draft"], default: "active" },
    rating: { type: Number, default: 4.7 },
    reviews: { type: Number, default: 0 },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
