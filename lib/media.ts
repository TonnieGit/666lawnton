import type { WixImageRef } from "./data/types";

const WIX_MEDIA_BASE = "https://static.wixstatic.com/media/";

export interface ResolvedImage {
  src: string;
  width: number;
  height: number;
}

/** `bfd742_abc~mv2.jpg` from any static.wixstatic.com URL (original or transformed). */
export function mediaIdFromUrl(url: string): string | null {
  const m = url.match(/static\.wixstatic\.com\/media\/([^/?#]+)/);
  return m ? m[1] : null;
}

/** Strip Wix transform paths: `.../media/{id}/v1/fill/.../file.jpg` → `.../media/{id}` */
export function toOriginalWixUrl(url: string): string {
  const id = mediaIdFromUrl(url);
  return id ? WIX_MEDIA_BASE + id : url;
}

/**
 * `wix:image://v1/{mediaId}/{filename}#originWidth=W&originHeight=H` → URL + dimensions.
 * Mirrors `media.getImageUrl()` from @wix/sdk (use that in the live implementation).
 */
export function wixImageToUrl(ref: WixImageRef | undefined | null): ResolvedImage | null {
  if (!ref) return null;
  if (ref.startsWith("http")) return { src: ref, width: 0, height: 0 };
  const m = ref.match(/^wix:image:\/\/v1\/([^/#]+)(?:\/[^#]*)?(?:#(.*))?$/);
  if (!m) return null;
  const params = new URLSearchParams(m[2] ?? "");
  return {
    src: WIX_MEDIA_BASE + m[1],
    width: Number(params.get("originWidth") ?? 0),
    height: Number(params.get("originHeight") ?? 0),
  };
}

/**
 * Final `src` for next/image. With MOCK_MEDIA=local, Wix CDN URLs are rewritten to the
 * scraped backups in /public/mock-media. Original dimensions ride along in the hash so
 * the image loader can request a correctly proportioned Wix `fill` transform.
 */
export function resolveMediaUrl(url: string, width?: number, height?: number): string {
  const id = mediaIdFromUrl(url);
  if (!id) return url;
  if (process.env.NEXT_PUBLIC_MOCK_MEDIA === "local" && process.env.NEXT_PUBLIC_DATA_SOURCE !== "wix") {
    return `/mock-media/${id}`;
  }
  const base = WIX_MEDIA_BASE + id;
  return width && height ? `${base}#originWidth=${width}&originHeight=${height}` : base;
}
