"use client";

import { useEffect, useRef } from "react";
import { CartContents } from "./CartContents";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { isOpen, close, cart } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => e.target === ref.current && close()}
      aria-labelledby="cart-title"
      className="ml-auto mr-0 h-dvh max-h-dvh w-full max-w-md bg-ink-2 p-0 text-bone backdrop:bg-black/60"
    >
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <h2 id="cart-title" className="font-display text-2xl">
            Your cart{cart.itemCount ? ` (${cart.itemCount})` : ""}
          </h2>
          <button type="button" onClick={close} className="p-2 text-2xl leading-none" aria-label="Close cart">
            ×
          </button>
        </div>
        <div className="mt-4 flex-1 overflow-y-auto">
          <CartContents onNavigate={close} />
        </div>
      </div>
    </dialog>
  );
}
