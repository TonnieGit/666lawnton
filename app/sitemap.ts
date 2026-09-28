import type { MetadataRoute } from "next";
import { getArtists, getCollections, getProducts } from "@/lib/data";
import { absoluteUrl, artistPath, NOINDEX } from "@/lib/site";

// Enabled at launch only (spec §8, seo.md §B7): empty while previews are noindex.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (NOINDEX) return [];

  const [{ items: products }, artists, collections] = await Promise.all([
    getProducts({ limit: 1000 }),
    getArtists(),
    getCollections(),
  ]);
  const latest = products.reduce((d, p) => (p.lastUpdated > d ? p.lastUpdated : d), "");

  const pages = ["/", "/tattoos", "/portfolio", "/about-us", "/contact-us", "/faq", "/tattoo-aftercare", "/gift-vouchers"];

  return [
    ...pages.map((path) => ({ url: absoluteUrl(path), lastModified: latest || undefined })),
    ...collections.map((c) => ({ url: absoluteUrl(`/category/${c.slug}`), lastModified: latest || undefined })),
    ...products.map((p) => ({ url: absoluteUrl(`/product-page/${p.slug}`), lastModified: p.lastUpdated })),
    ...artists.map((a) => ({ url: absoluteUrl(artistPath(a.slug)), lastModified: a._updatedDate })),
  ];
}
