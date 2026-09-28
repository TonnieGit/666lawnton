"use client";

// Cart half of the public data API (spec §4). Browser-only.
// Implementations are loaded on demand so the mock build never ships the
// Wix SDK (~2.4 MB) to the browser, and vice versa.
import type { Cart, CartSource } from "./types";

export const isCheckoutEnabled = process.env.NEXT_PUBLIC_DATA_SOURCE === "wix";

let sourcePromise: Promise<CartSource> | null = null;

function source(): Promise<CartSource> {
  sourcePromise ??=
    process.env.NEXT_PUBLIC_DATA_SOURCE === "wix"
      ? import("./wix/cart").then((m) => m.wixCart)
      : import("./mock/cart").then((m) => m.mockCart);
  return sourcePromise;
}

export const getCart = async (): Promise<Cart> => (await source()).getCart();

export const addToCart = async (productId: string, quantity: number, options?: Record<string, string>) =>
  (await source()).addToCart(productId, quantity, options);

export const updateCartLine = async (lineId: string, quantity: number) =>
  (await source()).updateCartLine(lineId, quantity);

export const removeCartLine = async (lineId: string) => (await source()).removeCartLine(lineId);

/** Returns null in mock mode. */
export const getCheckoutUrl = async () => (await source()).getCheckoutUrl();
