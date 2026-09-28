"use client";

import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import { WixImage } from "@/components/WixImage";
import type { WixGalleryItem } from "@/lib/data/types";

export function ArtistGallery({ items, artist }: { items: WixGalleryItem[]; artist: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const alt = (g: WixGalleryItem, i: number) => g.title || `Tattoo by ${artist}, ${i + 1} of ${items.length}`;

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {items.map((g, i) => (
          <li key={`${g.src}-${i}`} className="mb-3 break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block w-full cursor-zoom-in overflow-hidden bg-ink-3"
              aria-label={`Enlarge ${alt(g, i)}`}
            >
              <WixImage
                image={g.src}
                alt=""
                intrinsic
                sizes="(min-width: 1024px) 280px, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition duration-500 hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        images={items.map((g, i) => ({ image: g.src, alt: alt(g, i) }))}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
        label={`${artist}'s portfolio`}
      />
    </>
  );
}
