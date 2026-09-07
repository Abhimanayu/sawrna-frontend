import assert from "node:assert/strict";
import { MongoMemoryReplSet } from "mongodb-memory-server";

async function run() {
  const database = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  process.env.MONGODB_URI = database.getUri("sawrna");
  process.env.MONGODB_DB = "sawrna";

  try {
  const [{ connectDB }, { products }, { ProductModel }, { OrderModel }, users, orders] = await Promise.all([
    import("../src/lib/db"),
    import("../src/lib/products"),
    import("../src/models/product"),
    import("../src/models/order"),
    import("../src/lib/users"),
    import("../src/lib/orders"),
  ]);

  await connectDB();
  await ProductModel.insertMany(products.map(({ isNew, ...product }) => ({ ...product, isNewArrival: isNew })));

  const email = "commerce-smoke@sawrna.test";
  const password = "SawrnaSmoke#2026";
  const user = await users.registerUser({ name: "Commerce Smoke", email, password });
  const authenticated = await users.authenticateUser(email, password);
  assert.equal(authenticated?.id, user.id, "credentials should authenticate the created customer");

  const selected = products[0];
  const size = selected.sizes[0];
  const color = selected.colors[0];
  const originalVariantStock = selected.variants.find((variant) => variant.size === size && variant.color === color)?.stock || 0;
  const quantity = 2;
  const order = await orders.createVerifiedOrderRecord(
    {
      name: "Commerce Smoke",
      email,
      phone: "9876543210",
      address: "12 SAWRNA Test Colony, Main Road",
      city: "Jaipur",
      pincode: "302001",
      paymentMethod: "cod",
      coupon: "SAWRNA10",
      items: [{ slug: selected.slug, size, color, qty: quantity }],
    },
    { id: user.id, email },
  );
  assert.equal(order.items[0].price, selected.salePrice || selected.price, "server catalog must own item pricing");
  await orders.saveOrderRecord(order);

  const afterOrder = await ProductModel.findOne({ slug: selected.slug }).lean();
  assert.equal(afterOrder.stock, selected.stock - quantity, "order should decrement total stock");
  assert.equal(
    afterOrder.variants.find((variant: { size: string; color: string }) => variant.size === size && variant.color === color)?.stock,
    originalVariantStock - quantity,
    "order should decrement selected variant stock",
  );

  await orders.updateOrderStatus(order.orderId, "Cancelled", "Smoke test cancellation");
  await orders.updateOrderStatus(order.orderId, "Cancelled", "Duplicate cancellation");
  const afterCancellation = await ProductModel.findOne({ slug: selected.slug }).lean();
  const cancelledOrder = await OrderModel.findOne({ orderId: order.orderId }).lean();
  assert.equal(afterCancellation.stock, selected.stock, "cancellation should restore total stock once");
  assert.equal(
    afterCancellation.variants.find((variant: { size: string; color: string }) => variant.size === size && variant.color === color)?.stock,
    originalVariantStock,
    "cancellation should restore variant stock once",
  );
  assert.equal(cancelledOrder.stockRestored, true, "cancelled order should record stock restoration");
  assert.equal(cancelledOrder.statusHistory.length, 2, "duplicate terminal updates should not duplicate history");

  console.log("Commerce smoke passed: auth, server pricing, stock decrement, cancellation, and idempotent restoration.");
  } finally {
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect();
    await database.stop();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
