"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ButtonLink";
import { useCart } from "@/components/cart/CartProvider";
import type { WixProduct } from "@/lib/data/types";

export function AddToCart({ product }: { product: WixProduct }) {
  const { add, busy, cart } = useCart();
  const [options, setOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const { stock } = product;
  // Tracked stock caps the quantity (one-off antiques are tracked at 1).
  const inCart = cart.lines.filter((l) => l.productId === product._id).reduce((n, l) => n + l.quantity, 0);
  const max = stock.trackInventory ? Math.max(0, (stock.quantity ?? 0) - inCart) : 10;
  const soldOut = !stock.inStock;
  const allInCart = !soldOut && max === 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const missing = product.productOptions.find((o) => !options[o.name]);
    if (missing) {
      setError(`Please choose a ${missing.name.toLowerCase()}.`);
      return;
    }
    setError("");
    await add(product._id, quantity, options);
    setQuantity(1);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {product.productOptions.map((opt) => (
        <div key={opt.name}>
          <label htmlFor={`opt-${opt.name}`} className="block text-sm font-medium">
            {opt.name}
          </label>
          <select
            id={`opt-${opt.name}`}
            value={options[opt.name] ?? ""}
            onChange={(e) => setOptions((o) => ({ ...o, [opt.name]: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-bone/30 bg-ink-2 px-3 py-3"
          >
            <option value="" disabled>
              Select {opt.name.toLowerCase()}
            </option>
            {opt.choices
              .filter((c) => c.visible)
              .map((c) => (
                <option key={c.value} value={c.value} disabled={!c.inStock}>
                  {c.description}
                  {c.inStock ? "" : " (sold out)"}
                </option>
              ))}
          </select>
        </div>
      ))}

      {max > 1 && (
        <div>
          <label htmlFor="qty" className="block text-sm font-medium">
            Quantity
          </label>
          <select
            id="qty"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-2 w-24 rounded-xl border border-bone/30 bg-ink-2 px-3 py-3"
          >
            {Array.from({ length: Math.min(max, 10) }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-blood-bright">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={soldOut || allInCart || busy}
        className={`w-full ${buttonClass()}`}
      >
        {soldOut ? "Sold out" : allInCart ? "In your cart" : busy ? "Adding…" : "Add to cart"}
      </button>
      {stock.trackInventory && stock.quantity === 1 && !soldOut && (
        <p className="text-xs text-muted">One of a kind. Only 1 available.</p>
      )}
    </form>
  );
}
