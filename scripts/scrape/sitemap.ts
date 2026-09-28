// URL discovery (spec §6.2): sitemap index → sub-sitemaps.
import * as cheerio from "cheerio";
import { fetchText, SITE } from "./http";

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  images: { url: string; title?: string }[];
}

export interface Discovered {
  products: SitemapEntry[];
  categories: SitemapEntry[];
  pages: SitemapEntry[];
  portfolio: SitemapEntry[];
  other: SitemapEntry[];
}

async function readSitemap(url: string): Promise<{ sitemaps: string[]; entries: SitemapEntry[] }> {
  const $ = cheerio.load(await fetchText(url), { xml: true });
  const sitemaps = $("sitemap > loc").map((_, el) => $(el).text().trim()).get();
  const entries = $("url")
    .map((_, el) => ({
      url: $(el).children("loc").text().trim(),
      lastmod: $(el).children("lastmod").text().trim() || undefined,
      images: $(el)
        .find("image\\:image")
        .map((__, img) => ({
          url: $(img).find("image\\:loc").text().trim(),
          title: $(img).find("image\\:title").text().trim() || undefined,
        }))
        .get(),
    }))
    .get();
  return { sitemaps, entries };
}

export async function discover(): Promise<Discovered> {
  const out: Discovered = { products: [], categories: [], pages: [], portfolio: [], other: [] };
  const index = await readSitemap(`${SITE}/sitemap.xml`);
  const entries = [...index.entries];
  for (const sm of index.sitemaps) entries.push(...(await readSitemap(sm)).entries);

  for (const e of entries) {
    const p = new URL(e.url).pathname;
    if (p.startsWith("/product-page/")) out.products.push(e);
    else if (p.startsWith("/category/")) out.categories.push(e);
    else if (p.startsWith("/portfolio-collections/")) out.portfolio.push(e);
    else if (!p.slice(1).includes("/")) out.pages.push(e);
    else out.other.push(e);
  }
  return out;
}
