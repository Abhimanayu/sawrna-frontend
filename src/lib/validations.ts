import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(10),
  city: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  paymentMethod: z.enum(["cod", "whatsapp", "upi", "payment-link"]),
  upiScreenshot: z.string().optional(),
  coupon: z.string().optional(),
  total: z.number().nonnegative(),
  items: z.array(z.object({
    slug: z.string(),
    name: z.string(),
    price: z.number(),
    image: z.string(),
    size: z.string(),
    color: z.string(),
    qty: z.number().int().positive(),
  })).min(1),
});
