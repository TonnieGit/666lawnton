import type { Metadata } from "next";
import { CartContents } from "@/components/cart/CartContents";

// Never indexed (seo.md §B7), also disallowed in robots.txt.
export const metadata: Metadata = {
  title: { absolute: "Your cart | 666 Tattoo & Antiques" },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
      <h1 className="font-display text-4xl">Your cart</h1>
      <div className="mt-8">
        <CartContents />
      </div>
    </div>
  );
}
