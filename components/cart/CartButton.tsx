"use client";

import { useCart } from "./CartProvider";

export function CartButton() {
  const { cart, open } = useCart();
  const count = cart.itemCount;
  return (
    <button
      type="button"
      onClick={open}
      className="relative flex items-center gap-2 p-2 hover:text-brass"
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-blood px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
