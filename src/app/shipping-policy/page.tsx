import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about SAWRNA packing, dispatch, tracking, and delivery updates across India.",
};

export default function ShippingPolicyPage() { return <PolicyPage title="Shipping Policy" body="Orders are packed with care and dispatched through trusted logistics partners. Tracking updates appear across packed, shipped, and delivered states." />; }
