// Phase 2: CMS collections `Artists` and `SiteContent` (spec §5.3, §10 step 4).
import type { ArtistItem, SiteContentItem } from "../types";
import { getWixServerClient } from "./client";

export async function getArtists(): Promise<ArtistItem[]> {
  const res = await getWixServerClient().items.query("Artists").ascending("sortOrder").limit(100).find();
  return res.items as unknown as ArtistItem[];
}

export async function getSiteContent(key: string): Promise<SiteContentItem | null> {
  const res = await getWixServerClient().items.query("SiteContent").eq("_id", key).limit(1).find();
  return (res.items[0] as unknown as SiteContentItem) ?? null;
}
