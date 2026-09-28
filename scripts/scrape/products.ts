// Product page → WixProduct (spec §6.3).
// Preference: embedded Wix warmup data → JSON-LD → DOM.
import * as cheerio from "cheerio";
import { formatPrice, parsePrice } from "../../lib/format";
import { uuidV5 } from "../../lib/ids";
import {
  ALL_PRODUCTS_COLLECTION_ID,
  type WixMediaItem,
  type WixPriceData,
  type WixProduct,
  type WixProductOption,
} from "../../lib/data/types";
import { ricosToHtml } from "./ricos";
import { getImage, mediaIdOf } from "./images";
import { SITE } from "./http";

export type ExtractionMethod = "embedded" | "json-ld" | "dom";

export interface ScrapedProduct {
  product: WixProduct;
  method: ExtractionMethod;
  /** Wix category IDs + names as embedded on the page (V3-style categories). */
  categories: { id: string; name: string }[];
  missing: string[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function findEmbeddedProduct(html: string, $: cheerio.CheerioAPI): any | null {
  const raw = $("#wix-warmup-data").text();
  if (!raw) return null;
  let found: any = null;
  const walk = (o: any, depth: number) => {
    if (found || !o || typeof o !== "object" || depth > 40) return;
    if (!Array.isArray(o) && "urlPart" in o && "media" in o && "isInStock" in o) {
      found = o;
      return;
    }
    for (const k of Object.keys(o)) walk(o[k], depth + 1);
  };
  try {
    walk(JSON.parse(raw), 0);
  } catch {
    return null;
  }
  return found;
}

function findJsonLdProduct($: cheerio.CheerioAPI): any | null {
  for (const el of $('script[type="application/ld+json"]').toArray()) {
    try {
      const data = JSON.parse($(el).text());
      const list = Array.isArray(data) ? data : data["@graph"] ?? [data];
      const p = list.find((x: any) => x?.["@type"] === "Product");
      if (p) return p;
    } catch {
      // ignore malformed blocks
    }
  }
  return null;
}

function priceData(price: number, discounted: number): WixPriceData {
  return {
    currency: "AUD",
    price,
    discountedPrice: discounted,
    formatted: { price: formatPrice(price), discountedPrice: formatPrice(discounted) },
  };
}

async function mediaItem(mediaId: string, title = "", alt?: string | null): Promise<WixMediaItem | null> {
  const img = await getImage(mediaId);
  if (!img) return null;
  return {
    _id: mediaId,
    mediaType: "image",
    title,
    image: { url: img.url, width: img.width, height: img.height, ...(alt ? { altText: alt } : {}) },
    thumbnail: { url: `${img.url}/v1/fit/w_50,h_50,q_90/file.jpg`, width: 50, height: 50 },
  };
}

function mapOptions(options: any[] = []): WixProductOption[] {
  return options.map((o) => ({
    optionType: o.optionType === "color" ? "color" : "drop_down",
    name: o.title ?? o.name ?? "",
    choices: (o.selections ?? o.choices ?? []).map((c: any) => ({
      value: c.value ?? c.description ?? "",
      description: c.description ?? c.value ?? "",
      inStock: c.inStock !== false,
      visible: c.isVisible !== false,
    })),
  }));
}

export async function scrapeProduct(url: string, html: string, now: string): Promise<ScrapedProduct> {
  const $ = cheerio.load(html);
  const slug = new URL(url).pathname.split("/").pop()!;
  const embedded = findEmbeddedProduct(html, $);
  const ld = findJsonLdProduct($);
  const missing: string[] = [];

  let method: ExtractionMethod;
  let name = "";
  let descriptionHtml = "";
  let price = 0;
  let discounted = 0;
  let inStock = true;
  let sku = "";
  let mediaIds: { id: string; title?: string; alt?: string | null }[] = [];

  if (embedded) {
    method = "embedded";
    name = embedded.name;
    descriptionHtml = ricosToHtml(embedded.description ?? "");
    price = Number(embedded.price ?? 0);
    discounted = Number(embedded.discountedPrice ?? price);
    inStock = embedded.isInStock !== false;
    sku = embedded.sku ?? "";
    mediaIds = (embedded.media ?? [])
      .filter((m: any) => m.mediaType === "PHOTO")
      .map((m: any) => ({ id: m.id, title: m.title ?? "", alt: m.altText }));
  } else if (ld) {
    method = "json-ld";
    name = ld.name;
    descriptionHtml = ld.description ? `<p>${ld.description}</p>` : "";
    const offer = Array.isArray(ld.offers) ? ld.offers[0] : ld.offers;
    price = discounted = Number(offer?.price ?? 0);
    inStock = !/OutOfStock|SoldOut/i.test(offer?.availability ?? "");
    sku = ld.sku ?? "";
    const imgs = Array.isArray(ld.image) ? ld.image : [ld.image].filter(Boolean);
    mediaIds = imgs
      .map((i: any) => mediaIdOf(typeof i === "string" ? i : i.contentUrl))
      .filter(Boolean)
      .map((id: string) => ({ id }));
  } else {
    method = "dom";
    name = $('[data-hook="product-title"]').first().text().trim() || $("h1").first().text().trim();
    descriptionHtml = $('[data-hook="description"]').first().html() ?? "";
    price = discounted = parsePrice($('[data-hook="formatted-primary-price"]').first().text());
    inStock = $('[data-hook="product-page-out-of-stock"]').length === 0;
    const ids = new Set<string>();
    $('[data-hook="product-gallery-root"] img, [data-hook="main-media-image-wrapper"] img').each((_, el) => {
      const id = mediaIdOf($(el).attr("src") ?? "");
      if (id) ids.add(id);
    });
    mediaIds = [...ids].map((id) => ({ id }));
  }

  // JSON-LD availability is the authoritative "sold out" signal if present.
  const ldOffer = ld && (Array.isArray(ld.offers) ? ld.offers[0] : ld.offers);
  if (ldOffer?.availability) inStock = !/OutOfStock|SoldOut/i.test(ldOffer.availability);

  const items = (await Promise.all(mediaIds.map((m) => mediaItem(m.id, m.title, m.alt)))).filter(
    (m): m is WixMediaItem => m !== null,
  );

  if (!name) missing.push("name");
  if (!price) missing.push("price");
  if (!items.length) missing.push("images");
  if (!descriptionHtml) missing.push("description");

  const quantity = embedded?.inventory?.quantity;
  const trackInventory = Boolean(embedded?.isTrackingInventory);
  const discountValue = Number(embedded?.discount?.value ?? 0);
  const categories: { id: string; name: string }[] = embedded?.categories ?? [];
  const seoDescription: string | undefined = embedded?.seoDescription ?? undefined;

  const product: WixProduct = {
    _id: embedded?.id ?? uuidV5(slug),
    name,
    slug,
    visible: embedded ? embedded.isVisible !== false : true,
    productType: embedded?.productType === "digital" ? "digital" : "physical",
    description: descriptionHtml,
    sku,
    weight: Number(embedded?.weight ?? 0),
    stock: {
      trackInventory,
      ...(trackInventory && typeof quantity === "number" ? { quantity } : {}),
      inStock,
      inventoryStatus: inStock ? "IN_STOCK" : "OUT_OF_STOCK",
    },
    price: priceData(price, discounted),
    priceData: priceData(price, discounted),
    priceRange: { minValue: discounted, maxValue: discounted },
    discount:
      discountValue > 0
        ? { type: embedded.discount.mode === "AMOUNT" ? "AMOUNT" : "PERCENT", value: discountValue }
        : { type: "NONE", value: 0 },
    media: { mainMedia: items[0] ?? null, items },
    productOptions: mapOptions(embedded?.options),
    manageVariants: Boolean(embedded?.isManageProductItems),
    customTextFields: (embedded?.customTextFields ?? []).map((f: any) => ({
      title: f.title,
      maxLength: f.inputLimit ?? 500,
      mandatory: Boolean(f.isMandatory),
    })),
    additionalInfoSections: (embedded?.additionalInfo ?? []).map((s: any) => ({
      title: s.title,
      description: ricosToHtml(s.description ?? ""),
    })),
    ribbon: embedded?.ribbon ?? "",
    brand: embedded?.brand ?? "",
    collectionIds: [ALL_PRODUCTS_COLLECTION_ID],
    productPageUrl: { base: `${SITE}/`, path: `/product-page/${slug}` },
    numericId: "",
    ...(seoDescription
      ? { seoData: { tags: [{ type: "meta", props: { name: "description", content: seoDescription.trim() } }] } }
      : {}),
    lastUpdated: now,
    _createdDate: now,
  };

  return { product, method, categories, missing };
}
