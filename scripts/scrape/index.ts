// `npm run scrape` — snapshot the live Wix site into data/mock (spec §6).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import {
  ALL_PRODUCTS_COLLECTION_ID,
  type ArtistItem,
  type BusinessInfo,
  type WixCollection,
  type WixProduct,
} from "../../lib/data/types";
import { uuidV5 } from "../../lib/ids";
import { fetchText, SITE } from "./http";
import { getImage, imageStats, toWixImageRef } from "./images";
import { scrapeArtists, scrapePage, type PageDraft } from "./pages";
import { scrapeProduct, type ExtractionMethod } from "./products";
import { discover } from "./sitemap";

const MOCK_DIR = path.join(process.cwd(), "data", "mock");
const DRAFTS_DIR = path.join(MOCK_DIR, "drafts");

// Route table (spec §3). Anything else is flagged in the report.
const ROUTES: RegExp[] = [
  /^\/$/,
  /^\/about-us$/,
  /^\/category\/[^/]+$/,
  /^\/product-page\/[^/]+$/,
  /^\/portfolio$/,
  /^\/portfolio-collections\/my-portfolio(\/[^/]+)?$/,
  /^\/book-online$/,
  /^\/contact-us$/,
];

function readJson<T>(file: string, fallback: T): T {
  const p = path.join(MOCK_DIR, file);
  return existsSync(p) ? (JSON.parse(readFileSync(p, "utf8")) as T) : fallback;
}

function writeJson(file: string, data: unknown) {
  const p = path.join(MOCK_DIR, file);
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

const productSlugsOn = ($: cheerio.CheerioAPI) => {
  const slugs: string[] = [];
  $('a[href*="/product-page/"]').each((_, el) => {
    const slug = ($(el).attr("href") ?? "").split("/product-page/")[1]?.split(/[?#]/)[0];
    if (slug && !slugs.includes(slug)) slugs.push(slug);
  });
  return slugs;
};

async function scrapeCategory(url: string) {
  const first = cheerio.load(await fetchText(url));
  const name = first("h1").first().text().trim();
  const slugs = productSlugsOn(first);
  // Follow Wix "load more" pagination until no new products appear (spec §6.2).
  for (let page = 2; page <= 20; page++) {
    const more = productSlugsOn(cheerio.load(await fetchText(`${url}?page=${page}`))).filter((s) => !slugs.includes(s));
    if (!more.length) break;
    slugs.push(...more);
  }
  return { slug: new URL(url).pathname.split("/").pop()!, name, slugs };
}

async function main() {
  const started = Date.now();
  const now = new Date().toISOString();
  const failed: string[] = [];
  const log = (msg: string) => console.log(`[scrape] ${msg}`);

  log("Discovering URLs from sitemap…");
  const found = await discover();
  const allUrls = [...found.products, ...found.categories, ...found.pages, ...found.portfolio, ...found.other].map(
    (e) => e.url,
  );
  const uncovered = allUrls.filter((u) => !ROUTES.some((r) => r.test(new URL(u).pathname.replace(/\/$/, "") || "/")));
  log(
    `${found.products.length} products, ${found.categories.length} categories, ${found.pages.length} pages, ${found.portfolio.length} portfolio URLs`,
  );

  // ---- Categories (membership + listing order) ----
  const categories: Awaited<ReturnType<typeof scrapeCategory>>[] = [];
  for (const e of found.categories) {
    try {
      categories.push(await scrapeCategory(e.url));
    } catch (err) {
      failed.push(`${e.url} (${(err as Error).message})`);
    }
  }
  const allListing = categories.find((c) => c.slug === "all-products")?.slugs ?? [];

  // ---- Products ----
  const existing = readJson<WixProduct[]>("products.json", []);
  const products: WixProduct[] = [];
  const methods: Record<string, ExtractionMethod> = {};
  const missing: Record<string, string[]> = {};
  const categoryIdByName = new Map<string, string>();

  for (const [i, e] of found.products.entries()) {
    log(`Product ${i + 1}/${found.products.length}: ${e.url}`);
    try {
      const html = await fetchText(e.url);
      const { product, method, categories: cats, missing: miss } = await scrapeProduct(e.url, html, now);
      for (const c of cats) if (c.name !== "All Products") categoryIdByName.set(c.name, c.id);
      methods[product.slug] = method;
      if (miss.length) missing[product.slug] = miss;

      // Idempotent: keep created dates of known products. New products are dated
      // by their position in the All Products listing (newest first).
      const prev = existing.find((p) => p.slug === product.slug);
      if (prev) {
        product._createdDate = prev._createdDate;
        if (JSON.stringify({ ...prev, lastUpdated: "" }) === JSON.stringify({ ...product, lastUpdated: "" })) {
          product.lastUpdated = prev.lastUpdated;
        }
      } else {
        const pos = allListing.indexOf(product.slug);
        product._createdDate = new Date(Date.parse(now) - (pos < 0 ? allListing.length : pos) * 60_000).toISOString();
      }
      products.push(product);
    } catch (err) {
      failed.push(`${e.url} (${(err as Error).message})`);
    }
  }

  // ---- Collections (V1 shape) ----
  const collections: WixCollection[] = categories.map((c) => ({
    _id:
      c.slug === "all-products"
        ? ALL_PRODUCTS_COLLECTION_ID
        : (categoryIdByName.get(c.name) ?? uuidV5(`collection:${c.slug}`)),
    name: c.name || c.slug,
    slug: c.slug,
    visible: true,
    numberOfProducts: 0,
    description: "",
    media: { mainMedia: null, items: [] },
  }));
  for (const p of products) {
    for (const c of categories) {
      const col = collections.find((x) => x.slug === c.slug)!;
      if (c.slugs.includes(p.slug) && !p.collectionIds.includes(col._id)) p.collectionIds.push(col._id);
    }
  }
  for (const col of collections) col.numberOfProducts = products.filter((p) => p.collectionIds.includes(col._id)).length;
  // All Products first, then alphabetical (matches the live category menu order closely enough).
  collections.sort((a, b) =>
    a._id === ALL_PRODUCTS_COLLECTION_ID ? -1 : b._id === ALL_PRODUCTS_COLLECTION_ID ? 1 : a.name.localeCompare(b.name),
  );

  // ---- Pages + artists ----
  const drafts: PageDraft[] = [];
  for (const e of found.pages) {
    try {
      log(`Page: ${e.url}`);
      drafts.push(await scrapePage(e.url));
    } catch (err) {
      failed.push(`${e.url} (${(err as Error).message})`);
    }
  }
  let artists = readJson<ArtistItem[]>("artists.json", []);
  try {
    log("Artists (Wix Portfolio)…");
    const res = await scrapeArtists(found.portfolio, artists, now);
    artists = res.artists;
    drafts.push(...res.drafts);
  } catch (err) {
    failed.push(`${SITE}/portfolio (${(err as Error).message})`);
  }

  // ---- Business info: socials from the contact page ----
  const business = readJson<BusinessInfo | null>("business.json", null);
  const contactHtml = await fetchText(`${SITE}/contact-us`).catch(() => "");
  const $c = cheerio.load(contactHtml);
  const socialHref = (host: string) =>
    $c(`a[href*="${host}"]`).first().attr("href")?.replace(/\/$/, "").split("/").pop()?.replace(/^@/, "") ?? "";
  if (business) {
    business.socials.facebook ||= socialHref("facebook.com");
    business.socials.instagram ||= socialHref("instagram.com");
    const tiktok = socialHref("tiktok.com");
    if (tiktok) (business.socials as Record<string, string>).tiktok ||= tiktok;
  }

  // Logo (header image) for the new design until originals are supplied.
  const $home = cheerio.load(await fetchText(SITE));
  const logoId = $home("header img").first().attr("src")?.match(/media\/([^/]+)/)?.[1];
  const logo = logoId ? await getImage(logoId) : null;

  // ---- Write ----
  writeJson("products.json", products);
  writeJson("collections.json", collections);
  writeJson("artists.json", artists);
  if (business) writeJson("business.json", business);
  writeJson("drafts/pages.json", { scrapedAt: now, logo: logo ? toWixImageRef(logo) : null, pages: drafts });

  const report = {
    scrapedAt: now,
    durationSeconds: Math.round((Date.now() - started) / 1000),
    counts: {
      products: products.length,
      productsInSitemap: found.products.length,
      productsInAllProductsListing: allListing.length,
      collections: collections.length,
      artists: artists.length,
      pages: drafts.length,
      images: imageStats.downloaded + imageStats.cached,
      imagesDownloaded: imageStats.downloaded,
    },
    extractionMethod: methods,
    productsWithMissingFields: missing,
    listingNotInSitemap: allListing.filter((s) => !products.some((p) => p.slug === s)),
    failedUrls: [...failed, ...imageStats.failed],
    urlsNotInRouteTable: uncovered,
    discoveredUrls: allUrls,
    notes: [
      "Product and category IDs are the real Wix IDs from embedded page data; 'All Products' uses the V1 constant ID.",
      "Product pages expose V3-style `categoryIds`, which suggests the site may be on Wix Stores catalog V3 (spec §10 step 2).",
      "_createdDate is inferred from the All Products listing order (Wix doesn't expose creation dates publicly).",
      "site-content.json is curated by hand from drafts/pages.json and is not overwritten.",
    ],
  };
  writeJson("scrape-report.json", report);

  log(
    `Done in ${report.durationSeconds}s: ${products.length} products, ${collections.length} collections, ${artists.length} artists, ${report.counts.images} images, ${report.failedUrls.length} failures.`,
  );
  if (report.failedUrls.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
