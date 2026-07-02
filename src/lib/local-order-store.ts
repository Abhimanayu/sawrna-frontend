import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getLocalDataDir } from "@/lib/local-data";
import type { OrderRecord } from "@/lib/orders";

const dataDir = getLocalDataDir();
const ordersFile = path.join(dataDir, "orders.json");
let memoryOrders: OrderRecord[] = [];

export async function readLocalOrders() {
  try {
    const raw = await readFile(ordersFile, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryOrders = parsed as OrderRecord[];
      return memoryOrders;
    }
    return memoryOrders;
  } catch {
    return memoryOrders;
  }
}

export async function writeLocalOrders(orders: OrderRecord[]) {
  memoryOrders = orders;
  try {
    await mkdir(dataDir, { recursive: true });
    await writeFile(ordersFile, JSON.stringify(orders, null, 2), "utf8");
  } catch (error) {
    console.warn("SAWRNA local order file write skipped; using memory fallback", error);
  }
}

export async function saveLocalOrder(order: OrderRecord) {
  const orders = await readLocalOrders();
  await writeLocalOrders([order, ...orders.filter((item) => item.orderId !== order.orderId)]);
}

export async function updateLocalOrder(orderId: string, nextOrder: OrderRecord) {
  const orders = await readLocalOrders();
  await writeLocalOrders(orders.map((order) => (order.orderId === orderId ? nextOrder : order)));
}
