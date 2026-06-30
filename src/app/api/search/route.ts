import { NextRequest, NextResponse } from "next/server";
import { searchCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const results = await searchCatalogProducts(query);
  return NextResponse.json({ results });
}
