"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Pages where the pill would duplicate or get in the way of the page's own action
// (the enquiry form itself, checkout, add-to-cart).
const HIDDEN = [/^\/contact-us/, /^\/cart/, /^\/product-page\//];

/** Always-visible enquiry action, bottom centre. On home it waits until the hero (with its own CTA) is scrolled past. */
export function BookingPill() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (HIDDEN.some((re) => re.test(pathname))) return null;
  const shown = !isHome || pastHero;
  return (
    <Link
      href="/contact-us"
      aria-hidden={!shown || undefined}
      tabIndex={shown ? undefined : -1}
      className={`fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-blood py-3 pl-5 pr-4 text-sm font-semibold text-white shadow-xl shadow-black/40 transition-[background-color,opacity,translate] duration-300 hover:bg-blood/90 md:bottom-6 ${
        shown ? "" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      Book a tattoo
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </Link>
  );
}
