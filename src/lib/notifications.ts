import { siteConfig } from "@/lib/config";
import type { OrderRecord } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export async function sendOrderConfirmation(order: OrderRecord) {
  return sendEmail({
    to: order.customer.email,
    subject: `SAWRNA order ${order.orderId} received`,
    html: emailShell(
      "Thank you for choosing SAWRNA",
      `<p>We have received order <strong>${escapeHtml(order.orderId)}</strong>.</p>
       <p>Total: <strong>${escapeHtml(formatPrice(order.total))}</strong><br>Payment: ${escapeHtml(paymentLabel(order.paymentMethod))}<br>Status: ${escapeHtml(order.status)}</p>
       <p><a href="${siteConfig.url}/track-order?lookup=${encodeURIComponent(order.orderId)}">Track your order</a> using the email or phone entered at checkout.</p>`,
    ),
  });
}

export async function sendOrderStatusNotification(order: OrderRecord) {
  return sendEmail({
    to: order.customer.email,
    subject: `SAWRNA order ${order.orderId}: ${order.status}`,
    html: emailShell(
      "Your order has been updated",
      `<p>Order <strong>${escapeHtml(order.orderId)}</strong> is now <strong>${escapeHtml(order.status)}</strong>.</p>
       <p><a href="${siteConfig.url}/track-order?lookup=${encodeURIComponent(order.orderId)}">View the latest timeline</a>.</p>`,
    ),
  });
}

async function sendEmail(input: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [input.to], subject: input.subject, html: input.html }),
  });
  if (!response.ok) console.error("SAWRNA transactional email failed", response.status);
  return response.ok;
}

function emailShell(title: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#032f27">
    <p style="font-size:12px;letter-spacing:2px;color:#9b7a42">SAWRNA PREMIUM APPAREL</p>
    <h1 style="font-family:Georgia,serif;font-weight:500">${escapeHtml(title)}</h1>
    <div style="line-height:1.7;color:#4d504b">${body}</div>
    <p style="margin-top:28px;font-size:12px;color:#777">Need help? ${escapeHtml(siteConfig.supportEmail)}</p>
  </div>`;
}

function paymentLabel(value: OrderRecord["paymentMethod"]) {
  if (value === "cod") return "Cash on Delivery";
  if (value === "upi") return "Manual UPI";
  if (value === "whatsapp") return "WhatsApp Order";
  return "Payment Link";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
