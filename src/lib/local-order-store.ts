import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { OrderRecord } from "@/lib/orders";

const dataDir = path.join(process.cwd(), ".sawrna-data");
const ordersFile = path.join(dataDir, "orders.json");

export async function readLocalOrders() {
  try {
    const raw = await readFile(ordersFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

export async function writeLocalOrders(orders: OrderRecord[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(ordersFile, JSON.stringify(orders, null, 2), "utf8");
}

export async function saveLocalOrder(order: OrderRecord) {
  const orders = await readLocalOrders();
  await writeLocalOrders([order, ...orders.filter((item) => item.orderId !== order.orderId)]);
}

export async function updateLocalOrder(orderId: string, nextOrder: OrderRecord) {
  const orders = await readLocalOrders();
  await writeLocalOrders(orders.map((order) => (order.orderId === orderId ? nextOrder : order)));
}
