import { getOrdersSnapshot } from "@/lib/orders";

export async function getAdminOrderStats() {
  const snapshot = await getOrdersSnapshot();
  const customers = new Set(snapshot.orders.map((order) => order.customer.email).filter(Boolean));

  return {
    orders: snapshot.orders.length,
    paymentVerification: snapshot.orders.filter((order) => order.status === "Payment Verification Pending").length,
    customers: customers.size,
    databaseConnected: snapshot.databaseConnected,
  };
}
