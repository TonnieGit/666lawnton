"use client";

import Link from "next/link";
import { useState } from "react";
import { WixImage } from "@/components/WixImage";
import { getCheckoutUrl, isCheckoutEnabled } from "@/lib/data/cart";
import { useCart } from "./CartProvider";

export function CartContents({ onNavigate }: { onNavigate?: () => void }) {
  const { cart, ready, busy, update, remove } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  async function checkout() {
    setCheckingOut(true);
    try {
      const url = await getCheckoutUrl();
      if (url) window.location.href = url;
    } finally {
      setCheckingOut(false);
    }
  }

  if (!ready) return <p className="py-8 text-muted">Loading your cart…</p>;

  if (!cart.lines.length) {
    return (
      <div className="py-8">
        <p className="text-muted">Your cart is empty.</p>
        <Link
          href="/category/all-products"
          onClick={onNavigate}
          className="mt-4 inline-block border border-bone/40 px-5 py-3 text-sm font-medium uppercase tracking-wider hover:bg-bone hover:text-ink"
        >
          Browse the antiques
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="divide-y divide-bone/10" aria-busy={busy}>
        {cart.lines.map((line) => (
          <li key={line._id} className="flex gap-4 py-4">
            <div className="relative size-20 shrink-0 overflow-hidden bg-bone-2">
              <WixImage image={line.image} alt={line.name} sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/product-page/${line.slug}`}
                onClick={onNavigate}
                className="line-clamp-2 text-sm font-medium hover:underline"
              >
                {line.name}
              </Link>
              {Object.entries(line.options).map(([k, v]) => (
                <p key={k} className="text-xs text-muted">
                  {k}: {v}
                </p>
              ))}
              <p className="mt-1 text-sm">{line.price.formatted.discountedPrice}</p>
              <div className="mt-2 flex items-center gap-3">
                <label className="sr-only" htmlFor={`qty-${line._id}`}>
                  Quantity for {line.name}
                </label>
                <select
                  id={`qty-${line._id}`}
                  value={line.quantity}
                  disabled={busy}
                  onChange={(e) => update(line._id, Number(e.target.value))}
                  className="border border-bone/30 bg-ink-2 px-2 py-1 text-sm"
                >
                  {Array.from({ length: Math.max(1, Math.min(10, line.maxQuantity ?? 10)) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => remove(line._id)}
                  disabled={busy}
                  className="text-xs text-muted underline hover:text-bone"
                >
                  Remove<span className="sr-only"> {line.name}</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-bone/10 pt-4">
        <div className="flex justify-between text-base">
          <span>Subtotal</span>
          <span className="font-semibold">{cart.subtotal.formatted}</span>
        </div>
        <p className="mt-1 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
        <button
          type="button"
          onClick={checkout}
          disabled={!isCheckoutEnabled || checkingOut}
          aria-describedby={isCheckoutEnabled ? undefined : "checkout-note"}
          className="mt-4 w-full bg-blood px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checkingOut ? "Redirecting…" : "Checkout"}
        </button>
        {!isCheckoutEnabled && (
          <p id="checkout-note" className="mt-2 text-center text-xs text-muted">
            Checkout available once connected to your store.
          </p>
        )}
      </div>
    </div>
  );
}
