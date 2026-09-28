import artistsJson from "@/data/mock/artists.json";
import siteContentJson from "@/data/mock/site-content.json";
import type { ArtistItem, SiteContentItem } from "../types";

const artists = artistsJson as unknown as ArtistItem[];
const siteContent = siteContentJson as unknown as SiteContentItem[];

export async function getArtists(): Promise<ArtistItem[]> {
  return [...artists].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getSiteContent(key: string): Promise<SiteContentItem | null> {
  return siteContent.find((item) => item._id === key) ?? null;
}
