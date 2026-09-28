import type { Metadata } from "next";

interface PageSeo {
  /** Full title (≤ 60 chars, seo.md §B4). Rendered as-is, no template. */
  title: string;
  /** 140–160 chars. */
  description: string;
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string } | null;
  type?: "website" | "article";
}

/**
 * Metadata for one page: absolute title, self-referencing canonical and a full
 * Open Graph block (child segments replace `openGraph` wholesale, so it's
 * always complete). Without a page image, falls back to the branded /og card.
 */
export function pageMetadata({ title, description, path, image, type = "website" }: PageSeo): Metadata {
  const og = image
    ? { url: image.url, width: image.width, height: image.height, alt: image.alt ?? title }
    : { url: `/og?title=${encodeURIComponent(title.split(" | ")[0])}`, width: 1200, height: 630, alt: title };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "666 Tattoo & Antiques",
      locale: "en_AU",
      type,
      images: [og],
    },
    twitter: { card: "summary_large_image", title, description, images: [og.url] },
  };
}

/** Wix CDN crop to the 1200×630 Open Graph size. */
export function wixOgImage(url: string) {
  return `${url}/v1/fill/w_1200,h_630,al_c,q_85/og.jpg`;
}
