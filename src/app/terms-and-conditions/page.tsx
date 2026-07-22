import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the SAWRNA terms for customer accounts, payments, product availability, and order verification.",
};

export default function TermsPage() { return <PolicyPage title="Terms & Conditions" body="By using SAWRNA, customers agree to accurate account details, lawful payments, product availability rules, and order verification where required." />; }
