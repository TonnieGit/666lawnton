"use client";

// Cart half of the public data API (spec §4). Browser-only.
import type { CartSource } from "./types";
import { mockCart } from "./mock/cart";
import { wixCart } from "./wix/cart";

const source: CartSource = process.env.NEXT_PUBLIC_DATA_SOURCE === "wix" ? wixCart : mockCart;

export const isCheckoutEnabled = process.env.NEXT_PUBLIC_DATA_SOURCE === "wix";

export const getCart = source.getCart;
export const addToCart = source.addToCart;
export const updateCartLine = source.updateCartLine;
export const removeCartLine = source.removeCartLine;
/** Returns null in mock mode. */
export const getCheckoutUrl = source.getCheckoutUrl;
