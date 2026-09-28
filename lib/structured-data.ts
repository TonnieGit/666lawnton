// JSON-LD builders (seo.md §B5). Properties with unconfirmed values are
// omitted rather than emitted empty.
import type { ArtistItem, BusinessInfo, WixProduct } from "@/lib/data/types";
import { wixImageToUrl } from "@/lib/media";
import { toPlainText } from "@/lib/sanitize";
import { absoluteUrl, artistPath, BUSINESS_ID, SITE_URL } from "@/lib/site";

const DAY: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function localBusinessJsonLd(b: BusinessInfo) {
  const sameAs = [
    b.socials.facebook && `https://www.facebook.com/${b.socials.facebook}/`,
    b.socials.instagram && `https://www.instagram.com/${b.socials.instagram}/`,
    b.socials.tiktok && `https://www.tiktok.com/@${b.socials.tiktok}`,
  ].filter(Boolean);
  const hours = b.hours
    .filter((h) => h.open && h.close && DAY[h.day.toLowerCase()])
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY[h.day.toLowerCase()],
      opens: h.open,
      closes: h.close,
    }));

  return {
    "@context": "https://schema.org",
    "@type": ["TattooParlor", "Store"],
    "@id": BUSINESS_ID,
    name: b.name,
    url: SITE_URL,
    logo: b.logo,
    image: b.images.length ? b.images : [b.logo],
    telephone: b.phoneE164,
    email: b.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address.street,
      addressLocality: b.address.suburb,
      addressRegion: b.address.state,
      postalCode: b.address.postcode,
      addressCountry: "AU",
    },
    ...(b.geo ? { geo: { "@type": "GeoCoordinates", ...b.geo } } : {}),
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    areaServed: b.areaServed,
    ...(sameAs.length ? { sameAs } : {}),
    priceRange: b.priceRange,
  };
}

export function websiteJsonLd(b: BusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: b.name,
    url: SITE_URL,
    publisher: { "@id": BUSINESS_ID },
  };
}

export function productJsonLd(p: WixProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: toPlainText(p.description, 5000) || undefined,
    ...(p.sku ? { sku: p.sku } : {}),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    image: p.media.items.filter((m) => m.image).map((m) => m.image!.url),
    url: absoluteUrl(`/product-page/${p.slug}`),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product-page/${p.slug}`),
      priceCurrency: p.priceData.currency,
      price: p.priceData.discountedPrice.toFixed(2),
      availability: p.stock.inStock ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      // Antiques: never mark as new.
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@id": BUSINESS_ID },
    },
  };
}

export function personJsonLd(a: ArtistItem) {
  const img = wixImageToUrl(a.profileImage);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.title,
    jobTitle: "Tattoo Artist",
    url: absoluteUrl(artistPath(a.slug)),
    worksFor: { "@id": BUSINESS_ID },
    ...(img ? { image: img.src } : {}),
    ...(a.specialties.length ? { knowsAbout: a.specialties } : {}),
    ...(a.instagram ? { sameAs: [`https://www.instagram.com/${a.instagram}/`] } : {}),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export interface Crumb {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}
