// Content pages (spec §6.5). Semi-manual: raw text + images go to
// data/mock/drafts/pages.json for a person to tidy into site-content.json.
// Artists come from the Wix Portfolio app pages and are merged into
// artists.json, preserving any hand-edited fields.
import * as cheerio from "cheerio";
import type { ArtistItem, WixGalleryItem } from "../../lib/data/types";
import { uuidV5 } from "../../lib/ids";
import { cleanAlt, getImage, mediaIdOf, toWixImageRef } from "./images";
import { fetchText, SITE } from "./http";
import type { SitemapEntry } from "./sitemap";

export interface PageDraft {
  url: string;
  title: string;
  metaDescription: string;
  blocks: { tag: string; text: string }[];
  images: { mediaId: string; wixImage: string; alt: string; width: number; height: number }[];
}

const CHROME_TEXT = new Set([
  "top of page",
  "bottom of page",
  "Home",
  "About us",
  "Our antiques shop",
  "Our tattoo artists",
  "Contact us",
  "Chat to us now",
  "Create Your First Project",
  'Start adding your projects to your portfolio. Click on "Manage Projects" to get started',
  "Previous Project",
  "Next Project",
  "Project type",
]);

function mainContent($: cheerio.CheerioAPI) {
  $("script,style,noscript,svg,header,footer").remove();
  return $("main").length ? $("main") : $("body");
}

export async function scrapePage(url: string, html?: string): Promise<PageDraft> {
  const $ = cheerio.load(html ?? (await fetchText(url)));
  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const root = mainContent($);

  const blocks: PageDraft["blocks"] = [];
  const seen = new Set<string>();
  root.find("h1,h2,h3,h4,h5,h6,p,span,li,a,label").each((_, el) => {
    const text = $(el).clone().children().remove().end().text().replace(/​/g, "").trim();
    if (!text || CHROME_TEXT.has(text) || seen.has(text)) return;
    seen.add(text);
    blocks.push({ tag: el.tagName, text });
  });

  const images: PageDraft["images"] = [];
  const ids = new Set<string>();
  root.find("img").each((_, el) => {
    const id = mediaIdOf($(el).attr("src") ?? "");
    if (id && !ids.has(id)) {
      ids.add(id);
      images.push({ mediaId: id, wixImage: "", alt: cleanAlt($(el).attr("alt")), width: 0, height: 0 });
    }
  });
  for (const img of images) {
    const info = await getImage(img.mediaId);
    if (info) Object.assign(img, { wixImage: toWixImageRef(info), width: info.width, height: info.height });
  }
  return { url, title, metaDescription, blocks, images: images.filter((i) => i.width) };
}

/** "specialises in Blackwork, Fine Line, Stipple and Portraits tattoos" → [...] */
function parseSpecialties(bio: string): string[] {
  const m = bio.match(/speciali[sz](?:es|e|ing) in ([^.]+?)(?: tattoos?| tattooing)?(?:\.|$)/i);
  if (!m) return [];
  return m[1]
    .replace(/^a (?:wide )?variety of styles,?\s*(?:including\s*)?/i, "")
    .split(/,| and | & /i)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\b\w/g, (c) => c.toUpperCase()));
}

export interface ArtistScrape {
  artists: ArtistItem[];
  drafts: PageDraft[];
}

export async function scrapeArtists(
  portfolioEntries: SitemapEntry[],
  existing: ArtistItem[],
  now: string,
): Promise<ArtistScrape> {
  // Cover images + order from the /portfolio grid.
  const $grid = cheerio.load(await fetchText(`${SITE}/portfolio`));
  const covers = new Map<string, { mediaId: string; order: number }>();
  $grid("[id^=item-wrapper-]").each((_, el) => {
    const m = ($grid(el).attr("id") ?? "").match(/^item-wrapper-(.+)_(\d+)$/);
    const id = mediaIdOf($grid(el).find("img").attr("src") ?? "");
    if (m && id) covers.set(m[1], { mediaId: id, order: Number(m[2]) + 1 });
  });

  const artists: ArtistItem[] = [];
  const drafts: PageDraft[] = [];
  const projects = portfolioEntries.filter((e) => new URL(e.url).pathname.split("/").length === 4);

  for (const entry of projects) {
    const slug = new URL(entry.url).pathname.split("/").pop()!;
    const draft = await scrapePage(entry.url);
    drafts.push(draft);

    const name = draft.blocks.find((b) => b.tag === "h1")?.text ?? slug;
    const bio =
      draft.blocks
        .filter((b) => b.tag === "p" && b.text !== name && !/Manage Projects|First Project/i.test(b.text))
        .sort((a, b) => b.text.length - a.text.length)[0]?.text ?? "";

    // Sitemap lists the project cover first, then the gallery. The cover duplicates
    // the /portfolio grid image and Wix refuses direct downloads of it (403), so skip it.
    const gallery: WixGalleryItem[] = [];
    for (const img of entry.images.length > 1 ? entry.images.slice(1) : []) {
      const id = mediaIdOf(img.url);
      if (!id) continue;
      const info = await getImage(id);
      if (info) gallery.push({ type: "image", src: toWixImageRef(info), title: cleanAlt(img.title), description: "", style: "" });
    }
    const cover = covers.get(slug);
    const coverInfo = cover ? await getImage(cover.mediaId) : null;
    const profileImage = coverInfo ? toWixImageRef(coverInfo) : (gallery[0]?.src ?? "");

    const prev = existing.find((a) => a.slug === slug);
    // Keep styles/descriptions the client has filled in for images still in the gallery.
    for (const g of gallery) {
      const old = prev?.gallery.find((p) => p.src === g.src);
      if (old) Object.assign(g, { style: old.style ?? "", description: old.description || g.description, title: old.title || g.title });
    }
    artists.push({
      _id: prev?._id ?? uuidV5(`artist:${slug}`),
      _createdDate: prev?._createdDate ?? now,
      _updatedDate: now,
      title: prev?.title ?? name,
      slug,
      // Hand-edited fields win over re-scraped ones.
      bio: prev?.bio || bio,
      specialties: prev?.specialties?.length ? prev.specialties : parseSpecialties(bio),
      profileImage,
      gallery,
      instagram: prev?.instagram ?? "",
      bookingUrl: prev?.bookingUrl ?? "",
      sortOrder: prev?.sortOrder ?? cover?.order ?? 99,
    });
  }

  artists.sort((a, b) => a.sortOrder - b.sortOrder);
  return { artists, drafts };
}
