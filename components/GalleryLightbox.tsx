"use client";

import { useEffect, useState } from "react";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

/** Opens the lightbox for any `[data-lightbox-index]` button inside `containerId`. */
export function GalleryLightbox({ containerId, images, label }: { containerId: string; images: LightboxImage[]; label: string }) {
  const [index, setIndex] = useState<number | null>(null);

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

  return <Lightbox images={images} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} label={label} />;
}
