// Demo cart: stored in localStorage (spec §7 "Cart & checkout", Phase 1).
// Only product IDs, quantities and options are stored; product details are
// re-read from /api/mock-products on every read so prices can't go stale.

import { formatPrice } from "@/lib/format";
import type { Cart, CartLine, CartSource, WixProduct } from "../types";

const STORAGE_KEY = "666-cart-v1";

interface StoredLine {
  _id: string;
  productId: string;
  quantity: number;
  options: Record<string, string>;
}

function readStored(): StoredLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredLine[]) : [];
  } catch {
    return [];
  }
}

function writeStored(lines: StoredLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage blocked (private mode etc.): the cart just won't persist.
  }
}

async function fetchProducts(ids: string[]): Promise<WixProduct[]> {
  if (!ids.length) return [];
  const res = await fetch(`/api/mock-products?ids=${ids.map(encodeURIComponent).join(",")}`);
  if (!res.ok) return [];
  return (await res.json()) as WixProduct[];
}

async function buildCart(stored: StoredLine[]): Promise<Cart> {
  const products = await fetchProducts([...new Set(stored.map((l) => l.productId))]);
  const byId = new Map(products.map((p) => [p._id, p]));

  // Drop lines whose product has gone (deleted or hidden), like Wix does.
  let changed = false;
  const kept = stored
    .filter((l) => byId.has(l.productId))
    .map((l) => {
      const s = byId.get(l.productId)!.stock;
      const max = s.trackInventory ? (s.quantity ?? 0) : Infinity;
      if (l.quantity > max) {
        changed = true;
        return { ...l, quantity: max };
      }
      return l;
    })
    .filter((l) => l.quantity > 0);
  if (changed || kept.length !== stored.length) writeStored(kept);

  const lines: CartLine[] = kept.map((l) => {
    const p = byId.get(l.productId)!;
    return {
      _id: l._id,
      productId: p._id,
      name: p.name,
      slug: p.slug,
      quantity: l.quantity,
      options: l.options,
      price: p.priceData,
      image: p.media.mainMedia?.image,
      maxQuantity: p.stock.trackInventory ? (p.stock.quantity ?? 0) : undefined,
    };
  });

  const amount = lines.reduce((sum, l) => sum + l.price.discountedPrice * l.quantity, 0);
  return {
    lines,
    currency: "AUD",
    subtotal: { amount, formatted: formatPrice(amount) },
    itemCount: lines.reduce((n, l) => n + l.quantity, 0),
  };
}

function sameOptions(a: Record<string, string>, b: Record<string, string>) {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
}

export const mockCart: CartSource = {
  async getCart() {
    return buildCart(readStored());
  },

  async addToCart(productId, quantity, options = {}) {
    const stored = readStored();
    const existing = stored.find((l) => l.productId === productId && sameOptions(l.options, options));
    if (existing) existing.quantity += quantity;
    else stored.push({ _id: crypto.randomUUID(), productId, quantity, options });
    writeStored(stored);
    return buildCart(stored);
  },

  async updateCartLine(lineId, quantity) {
    let stored = readStored();
    if (quantity <= 0) stored = stored.filter((l) => l._id !== lineId);
    else stored = stored.map((l) => (l._id === lineId ? { ...l, quantity } : l));
    writeStored(stored);
    return buildCart(stored);
  },

  async removeCartLine(lineId) {
    const stored = readStored().filter((l) => l._id !== lineId);
    writeStored(stored);
    return buildCart(stored);
  },

  async getCheckoutUrl() {
    return null; // No checkout in the demo.
  },
};
