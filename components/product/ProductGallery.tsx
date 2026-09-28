"use client";

import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import { WixImage } from "@/components/WixImage";
import type { WixMediaItem } from "@/lib/data/types";

export function ProductGallery({ items, name }: { items: WixMediaItem[]; name: string }) {
  const images = items.filter((m) => m.image);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  // seo.md §B6: product name; gallery extras "{name}, view {n}".
  const alt = (m: WixMediaItem, i: number) => m.image?.altText || (i === 0 ? name : `${name}, view ${i + 1}`);

  if (!images.length) return <div className="aspect-square bg-bone-2" />;
  const current = images[active];

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(active)}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-bone-2"
        aria-label={`Enlarge image ${active + 1} of ${images.length}`}
      >
        <WixImage
          image={current.image}
          alt={alt(current, active)}
          sizes="(min-width: 1024px) 560px, 100vw"
          priority
          quality={85}
          className="object-contain"
        />
      </button>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2" aria-label="Product images">
          {images.map((m, i) => (
            <li key={m._id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === active}
                className="relative block aspect-square w-full overflow-hidden bg-bone-2 opacity-70 ring-brass hover:opacity-100 aria-pressed:opacity-100 aria-pressed:ring-2"
              >
                <WixImage image={m.image} alt="" sizes="100px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        images={images.map((m, i) => ({ image: m.image!, alt: alt(m, i) }))}
        index={lightbox}
        onIndexChange={setLightbox}
        onClose={() => setLightbox(null)}
        label={`${name} images`}
      />
    </div>
  );
}
