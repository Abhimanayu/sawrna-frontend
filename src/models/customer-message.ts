import mongoose, { Schema } from "mongoose";

const CustomerMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["new", "contacted", "resolved"], default: "new" },
  },
  { timestamps: true },
);

export const CustomerMessageModel =
  mongoose.models.CustomerMessage || mongoose.model("CustomerMessage", CustomerMessageSchema);
