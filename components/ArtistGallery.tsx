import { WixImage } from "@/components/WixImage";
import type { WixGalleryItem } from "@/lib/data/types";
import { GalleryLightbox } from "./GalleryLightbox";

// Server-rendered grid (no hydration cost per thumbnail); a single small client
// component opens the lightbox via event delegation.
export function ArtistGallery({ items, artist }: { items: WixGalleryItem[]; artist: string }) {
  // seo.md §B6: "{style} tattoo by {artist} at 666 Tattoo Lawnton", style when known.
  const alt = (g: WixGalleryItem, i: number) =>
    g.style
      ? `${g.style} tattoo by ${artist} at 666 Tattoo Lawnton`
      : g.title || `Tattoo by ${artist} at 666 Tattoo Lawnton, ${i + 1} of ${items.length}`;
  const id = `gallery-${artist.toLowerCase().replace(/\W+/g, "-")}`;

  return (
    <>
      <ul id={id} className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {items.map((g, i) => (
          <li key={`${g.src}-${i}`} className="mb-3 break-inside-avoid">
            <button
              type="button"
              data-lightbox-index={i}
              className="block w-full cursor-zoom-in overflow-hidden bg-ink-3"
              aria-label={`Enlarge: ${alt(g, i)}`}
            >
              <WixImage
                image={g.src}
                alt={alt(g, i)}
                intrinsic
                sizes="(min-width: 1024px) 280px, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition duration-500 hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>
      <GalleryLightbox
        containerId={id}
        images={items.map((g, i) => ({ image: g.src, alt: alt(g, i) }))}
        label={`${artist}'s portfolio`}
      />
    </>
  );
}
