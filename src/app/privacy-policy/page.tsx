import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how SAWRNA handles customer details, checkout information, and shopping support data.",
};

export default function PrivacyPolicyPage() { return <PolicyPage title="Privacy Policy" body="SAWRNA collects only the information required to process orders, support accounts, prevent fraud, and improve the shopping experience. Customer data is never sold." />; }
