import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Review SAWRNA returns, exchanges, refund timelines, and manual UPI verification rules.",
};

export default function RefundPolicyPage() { return <PolicyPage title="Refund Policy" body="Eligible products can be returned or exchanged as per product condition and request timelines. Manual UPI refunds are processed after admin verification." />; }
