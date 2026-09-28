import type { WixCollection } from "../types";
import { getWixServerClient } from "./client";

export async function getCollections(): Promise<WixCollection[]> {
  const res = await getWixServerClient().collections.queryCollections().limit(100).find();
  return res.items.filter((c) => c.visible !== false) as unknown as WixCollection[];
}

export async function getCollectionBySlug(slug: string): Promise<WixCollection | null> {
  try {
    const res = await getWixServerClient().collections.getCollectionBySlug(slug);
    return (res.collection as unknown as WixCollection) ?? null;
  } catch {
    return null; // SDK throws 404 for unknown slugs; mock returns null.
  }
}
