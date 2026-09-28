"use client";

import { useEffect, useState } from "react";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

/**
 * Opens the lightbox for any `[data-lightbox-index]` button inside `containerId`,
 * and reveals `[data-gallery-more]` items on "Show all".
 */
export function GalleryLightbox({
  containerId,
  images,
  label,
  hiddenCount = 0,
}: {
  containerId: string;
  images: LightboxImage[];
  label: string;
  hiddenCount?: number;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = document.getElementById(containerId);
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox-index]");
      if (btn && el.contains(btn)) setIndex(Number(btn.dataset.lightboxIndex));
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [containerId]);

  function showAll() {
    document
      .getElementById(containerId)
      ?.querySelectorAll<HTMLElement>("[data-gallery-more]")
      .forEach((li) => (li.hidden = false));
    setExpanded(true);
  }

  return (
    <>
      {hiddenCount > 0 && !expanded && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={showAll}
            aria-controls={containerId}
            className="border border-bone/40 px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-bone hover:text-ink"
          >
            Show all {images.length} tattoos
          </button>
        </div>
      )}
      <Lightbox images={images} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} label={label} />
    </>
  );
}
