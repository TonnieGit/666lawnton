"use client";

// Global next/image loader (next.config.ts → images.loaderFile).
// Wix CDN images are resized by Wix itself via its /v1/ transform URLs, so no
// Vercel image optimisation is used for them.

interface LoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function wixImageLoader({ src, width, quality }: LoaderProps): string {
  const q = quality ?? 85;
  const m = src.match(/^(https:\/\/static\.wixstatic\.com\/media\/[^/?#]+)(?:#(.*))?$/);
  if (!m) {
    // Local file (e.g. /mock-media/..., /logo.png): served as-is.
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
  }
  const [, base, hash] = m;
  const params = new URLSearchParams(hash ?? "");
  const ow = Number(params.get("originWidth"));
  const oh = Number(params.get("originHeight"));
  if (ow && oh) {
    // Never upscale past the original.
    const w = Math.min(width, ow);
    const h = Math.round((w * oh) / ow);
    return `${base}/v1/fill/w_${w},h_${h},al_c,q_${q}/file.jpg`;
  }
  // Unknown proportions: fit inside a tall box so the width is honoured.
  return `${base}/v1/fit/w_${width},h_${width * 4},q_${q}/file.jpg`;
}
