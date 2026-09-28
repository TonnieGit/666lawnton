"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Pages where the pill would duplicate or get in the way of the page's own action
// (the enquiry form itself, checkout, add-to-cart).
const HIDDEN = [/^\/contact-us/, /^\/cart/, /^\/product-page\//];

/** Always-visible enquiry action, bottom centre. */
export function BookingPill() {
  const pathname = usePathname();
  if (HIDDEN.some((re) => re.test(pathname))) return null;
  return (
    <Link
      href="/contact-us"
      className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-blood py-3 pl-5 pr-4 text-sm font-semibold text-white shadow-xl shadow-black/40 transition-colors hover:bg-blood/90 md:bottom-6"
    >
      Book a tattoo
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </Link>
  );
}
