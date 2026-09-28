// Downloads original Wix images to public/mock-media/{mediaId} (spec §6.4) and
// reads their real dimensions from the file.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { fetchBuffer } from "./http";

const MEDIA_DIR = path.join(process.cwd(), "public", "mock-media");
const WIX_MEDIA = "https://static.wixstatic.com/media/";

export interface ImageInfo {
  mediaId: string;
  url: string;
  width: number;
  height: number;
}

const cache = new Map<string, ImageInfo | null>();
export const imageStats = { downloaded: 0, cached: 0, failed: [] as string[] };

export function mediaIdOf(url: string): string | null {
  const m = url.match(/(?:static\.wixstatic\.com\/media\/|^)([a-z0-9]+_[a-f0-9]+~mv2\.[a-z]+|[a-f0-9-]{36}|[a-z0-9]+_[a-f0-9]{32})/i);
  return m ? m[1] : null;
}

export async function getImage(mediaId: string): Promise<ImageInfo | null> {
  if (cache.has(mediaId)) return cache.get(mediaId)!;
  mkdirSync(MEDIA_DIR, { recursive: true });
  const file = path.join(MEDIA_DIR, mediaId);
  const url = WIX_MEDIA + mediaId;

  let result: ImageInfo | null = null;
  try {
    let buf: Buffer;
    if (existsSync(file)) {
      buf = readFileSync(file);
      imageStats.cached++;
    } else {
      buf = await fetchBuffer(url);
      writeFileSync(file, buf);
      imageStats.downloaded++;
    }
    const size = imageSize(buf);
    result = { mediaId, url, width: size.width ?? 0, height: size.height ?? 0 };
  } catch (err) {
    imageStats.failed.push(`${url} (${(err as Error).message})`);
  }
  cache.set(mediaId, result);
  return result;
}

/** CMS-style reference used by @wix/data image fields. */
export function toWixImageRef(img: ImageInfo): string {
  return `wix:image://v1/${img.mediaId}/${img.mediaId}#originWidth=${img.width}&originHeight=${img.height}`;
}
