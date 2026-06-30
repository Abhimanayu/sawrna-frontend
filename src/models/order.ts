import mongoose, { Schema } from "mongoose";

const StatusHistorySchema = new Schema({ status: String, note: String, at: { type: Date, default: Date.now } }, { _id: false });

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },
    items: [{ slug: String, name: String, price: Number, image: String, size: String, color: String, qty: Number }],
    total: Number,
    coupon: String,
    paymentMethod: { type: String, enum: ["cod", "whatsapp", "upi", "payment-link"] },
    upiScreenshot: String,
    status: {
      type: String,
      enum: ["Pending", "Payment Verification Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Failed"],
      default: "Pending",
    },
    statusHistory: [StatusHistorySchema],
  },
  { timestamps: true },
);

export const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);
