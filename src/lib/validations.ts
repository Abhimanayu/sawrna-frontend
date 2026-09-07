import { z } from "zod";

export const checkoutOrderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  address: z.string().trim().min(10).max(300),
  city: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/),
  paymentMethod: z.enum(["cod", "whatsapp", "upi", "payment-link"]),
  upiScreenshot: z.string().url().optional(),
  coupon: z.string().trim().max(32).optional(),
  items: z.array(z.object({
    slug: z.string().trim().min(1),
    size: z.string().trim().min(1),
    color: z.string().trim().min(1),
    qty: z.number().int().min(1).max(10),
  })).min(1).max(20),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/),
  message: z.string().trim().min(10).max(2000),
});

export const newsletterSchema = z.object({ email: z.string().trim().email() });
