import collectionsJson from "@/data/mock/collections.json";
import type { WixCollection } from "../types";

const allCollections = collectionsJson as unknown as WixCollection[];

export async function getCollections(): Promise<WixCollection[]> {
  return allCollections.filter((c) => c.visible);
}

export async function getCollectionBySlug(slug: string): Promise<WixCollection | null> {
  return allCollections.find((c) => c.visible && c.slug === slug) ?? null;
}
