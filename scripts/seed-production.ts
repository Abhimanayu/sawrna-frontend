import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function seedProductionCatalog() {
  const [{ seedCatalogProducts, getCatalogProducts }, mongoose] = await Promise.all([
    import("../src/lib/catalog"),
    import("mongoose"),
  ]);

  try {
    await seedCatalogProducts();
    const products = await getCatalogProducts({ includeDraft: true, fallbackToSeed: false });
    console.log(`SAWRNA production catalog ready with ${products.length} products.`);
  } finally {
    await mongoose.default.disconnect();
  }
}

seedProductionCatalog().catch((error) => {
  console.error("SAWRNA production catalog seed failed", error);
  process.exitCode = 1;
});
