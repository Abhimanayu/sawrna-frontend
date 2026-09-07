import mongoose, { Schema } from "mongoose";

const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed" },
  },
  { timestamps: true },
);

export const NewsletterSubscriberModel =
  mongoose.models.NewsletterSubscriber || mongoose.model("NewsletterSubscriber", NewsletterSubscriberSchema);
