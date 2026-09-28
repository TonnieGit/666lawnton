"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ButtonLink";
import type { BusinessInfo } from "@/lib/data/types";

/**
 * Google Maps is heavy third-party JS, so the iframe only loads when asked
 * (keeps Lighthouse performance ≥ 90, spec §12 M6).
 */
export function MapEmbed({ business: b, query, className = "" }: { business: BusinessInfo; query: string; className?: string }) {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <iframe
        title={`Map showing ${b.name}, ${b.address.street}, ${b.address.suburb}`}
        src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
        referrerPolicy="no-referrer-when-downgrade"
        className={`h-full min-h-72 w-full border-0 grayscale-[60%] invert-[90%] hue-rotate-180 ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full min-h-72 w-full flex-col items-center justify-center gap-4 overflow-hidden border border-bone/10 bg-ink-2 p-6 text-center ${className}`}
    >
      {/* Street-grid texture, purely decorative */}
      <svg aria-hidden="true" className="absolute inset-0 size-full opacity-[0.07]" preserveAspectRatio="none" viewBox="0 0 400 300">
        <path d="M0 60h400M0 150h400M0 240h400M80 0v300M210 0l-40 300M330 0v300M0 0l400 300" stroke="currentColor" strokeWidth="6" fill="none" />
      </svg>
      <span aria-hidden="true" className="relative grid size-12 place-items-center rounded-full bg-blood text-2xl text-white">
        ✦
      </span>
      <p className="relative font-display text-xl">
        {b.address.street}, {b.address.suburb}
      </p>
      <div className="relative flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setShow(true)}
          className={buttonClass("outline", "sm")}
        >
          Show map
        </button>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("primary", "sm")}
        >
          Directions
        </a>
      </div>
    </div>
  );
}
