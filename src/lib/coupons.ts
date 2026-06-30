export const previewCoupons = [
  { code: "SAWRNA10", label: "10% off up to Rs. 300", minSubtotal: 999 },
  { code: "WELCOME150", label: "Flat Rs. 150 off", minSubtotal: 1199 },
  { code: "FREESHIP", label: "Free shipping", minSubtotal: 1499 },
] as const;

export function normalizeCoupon(code?: string | null) {
  return String(code || "").trim().toUpperCase();
}

export function getCouponBenefit(code: string | null | undefined, subtotal: number, shipping: number) {
  const normalized = normalizeCoupon(code);
  if (!normalized) return { code: "", valid: false, discount: 0, shippingDiscount: 0, message: "Add a preview coupon." };

  if (normalized === "SAWRNA10") {
    if (subtotal < 999) return invalid(normalized, "SAWRNA10 needs cart value above Rs. 999.");
    return { code: normalized, valid: true, discount: Math.min(Math.round(subtotal * 0.1), 300), shippingDiscount: 0, message: "SAWRNA10 applied." };
  }

  if (normalized === "WELCOME150") {
    if (subtotal < 1199) return invalid(normalized, "WELCOME150 needs cart value above Rs. 1199.");
    return { code: normalized, valid: true, discount: 150, shippingDiscount: 0, message: "WELCOME150 applied." };
  }

  if (normalized === "FREESHIP") {
    if (subtotal < 1499) return invalid(normalized, "FREESHIP needs cart value above Rs. 1499.");
    return { code: normalized, valid: true, discount: 0, shippingDiscount: shipping, message: "FREESHIP applied." };
  }

  return invalid(normalized, "Coupon not valid for preview.");
}

function invalid(code: string, message: string) {
  return { code, valid: false, discount: 0, shippingDiscount: 0, message };
}
