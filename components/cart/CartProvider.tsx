"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as cartApi from "@/lib/data/cart";
import type { Cart } from "@/lib/data/types";
import { formatPrice } from "@/lib/format";

const EMPTY: Cart = { lines: [], currency: "AUD", subtotal: { amount: 0, formatted: formatPrice(0) }, itemCount: 0 };

interface CartContextValue {
  cart: Cart;
  ready: boolean;
  busy: boolean;
  isOpen: boolean;
  open(): void;
  close(): void;
  add(productId: string, quantity: number, options?: Record<string, string>): Promise<void>;
  update(lineId: string, quantity: number): Promise<void>;
  remove(lineId: string): Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    setCart(await cartApi.getCart());
    setReady(true);
  }, []);

  useEffect(() => {
    // Initial load from localStorage / Wix; this is an external-system sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    // Keep tabs in sync (mock cart lives in localStorage).
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith("666-cart")) void refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const run = useCallback(async (fn: () => Promise<Cart>) => {
    setBusy(true);
    try {
      setCart(await fn());
    } finally {
      setBusy(false);
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      ready,
      busy,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: async (productId, quantity, options) => {
        await run(() => cartApi.addToCart(productId, quantity, options));
        setOpen(true);
      },
      update: (lineId, quantity) => run(() => cartApi.updateCartLine(lineId, quantity)),
      remove: (lineId) => run(() => cartApi.removeCartLine(lineId)),
    }),
    [cart, ready, busy, isOpen, run],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
