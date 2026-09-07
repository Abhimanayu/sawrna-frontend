import mongoose, { Schema } from "mongoose";

const CartItemSchema = new Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    qty: { type: Number, required: true, min: 1, max: 10 },
  },
  { _id: false },
);

const CustomerStateSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    cart: { type: [CartItemSchema], default: [] },
    wishlist: { type: [String], default: [] },
    coupon: { type: String, default: null },
  },
  { timestamps: true },
);

export const CustomerStateModel =
  mongoose.models.CustomerState || mongoose.model("CustomerState", CustomerStateSchema);
