"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import type { CartItem } from "@/store/cart-store";
import { useCartStore } from "@/store/cart-store";

type RemoteState = { cart: CartItem[]; wishlist: string[]; coupon: string | null };

export function CustomerStateSync() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    let unsubscribe = () => {};
    let timer: number | undefined;

    const start = async () => {
      await waitForHydration();
      const response = await fetch("/api/customer-state", { cache: "no-store" });
      if (!response.ok || cancelled) return;
      const remote = await response.json() as RemoteState;
      const local = useCartStore.getState();
      const merged = mergeState(
        { cart: local.items, wishlist: local.wishlist, coupon: local.coupon },
        remote,
      );
      useCartStore.getState().setCustomerState(merged);
      await saveState(merged);
      if (cancelled) return;

      let previous = signature(useCartStore.getState());
      unsubscribe = useCartStore.subscribe((state) => {
        const next = signature(state);
        if (next === previous) return;
        previous = next;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          void saveState({ cart: state.items, wishlist: state.wishlist, coupon: state.coupon });
        }, 650);
      });
    };

    void start();
    return () => {
      cancelled = true;
      unsubscribe();
      window.clearTimeout(timer);
    };
  }, [status]);

  return null;
}

function mergeState(local: RemoteState, remote: RemoteState): RemoteState {
  const items = new Map<string, CartItem>();
  for (const item of [...remote.cart, ...local.cart]) {
    const key = `${item.slug}::${item.size}::${item.color}`;
    const current = items.get(key);
    items.set(key, current ? { ...item, qty: Math.min(10, Math.max(current.qty, item.qty)) } : item);
  }
  return {
    cart: Array.from(items.values()),
    wishlist: Array.from(new Set([...remote.wishlist, ...local.wishlist])).slice(0, 100),
    coupon: local.coupon || remote.coupon || null,
  };
}

async function saveState(state: RemoteState) {
  await fetch("/api/customer-state", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  }).catch(() => undefined);
}

function signature(state: ReturnType<typeof useCartStore.getState>) {
  return JSON.stringify([state.items, state.wishlist, state.coupon]);
}

function waitForHydration() {
  if (useCartStore.persist.hasHydrated()) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const unsubscribe = useCartStore.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
}
