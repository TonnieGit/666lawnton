import type { BusinessInfo, WixProduct } from "@/lib/data/types";
import { toPlainText } from "@/lib/sanitize";
import { absoluteUrl } from "@/lib/site";

export function productJsonLd(p: WixProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: toPlainText(p.description, 5000),
    sku: p.sku || undefined,
    brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
    image: p.media.items.filter((m) => m.image).map((m) => m.image!.url),
    url: absoluteUrl(`/product-page/${p.slug}`),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product-page/${p.slug}`),
      priceCurrency: p.priceData.currency,
      price: p.priceData.discountedPrice.toFixed(2),
      availability: p.stock.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/UsedCondition",
    },
  };
}

export function localBusinessJsonLd(b: BusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": ["TattooParlor", "Store"],
    name: b.name,
    url: absoluteUrl("/"),
    telephone: b.phone.replace(/^0/, "+61 "),
    email: b.email,
    image: "https://static.wixstatic.com/media/bfd742_98a9fb601a3341fa8f04ed8615c53a1b~mv2.jpeg",
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address.street,
      addressLocality: b.address.suburb,
      addressRegion: b.address.state,
      postalCode: b.address.postcode,
      addressCountry: "AU",
    },
    sameAs: [
      b.socials.facebook && `https://www.facebook.com/${b.socials.facebook}/`,
      b.socials.instagram && `https://www.instagram.com/${b.socials.instagram}/`,
      b.socials.tiktok && `https://www.tiktok.com/@${b.socials.tiktok}`,
    ].filter(Boolean),
  };
}
