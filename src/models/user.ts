import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    label: { type: String, default: "Home" },
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String,
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    addresses: [AddressSchema],
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpiresAt: { type: Date, select: false },
  },
  { timestamps: true },
);

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
