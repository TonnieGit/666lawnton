"use client";

import { useCallback, useEffect, useRef } from "react";
import { WixImage } from "@/components/WixImage";
import type { WixImageRef, WixMediaImage } from "@/lib/data/types";

export interface LightboxImage {
  image: WixMediaImage | WixImageRef;
  alt: string;
}

export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
  label,
}: {
  images: LightboxImage[];
  index: number | null;
  onIndexChange(i: number): void;
  onClose(): void;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const count = images.length;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const step = useCallback(
    (delta: number) => index !== null && onIndexChange((index + delta + count) % count),
    [index, count, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const current = index !== null ? images[index] : null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={label}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-bone backdrop:bg-black/80"
    >
      {current && (
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between p-4 text-sm">
            <span aria-live="polite">
              {index! + 1} / {count}
            </span>
            <button type="button" onClick={onClose} className="p-2 text-3xl leading-none" aria-label="Close">
              ×
            </button>
          </div>
          <div className="relative flex-1" onClick={onClose}>
            <WixImage image={current.image} alt={current.alt} sizes="100vw" className="object-contain" quality={85} />
          </div>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center bg-ink/70 text-2xl hover:bg-ink"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center bg-ink/70 text-2xl hover:bg-ink"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
