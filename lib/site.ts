// Production canonical host is https://www.666shoplawnton.com (seo.md §B7).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX !== "false";
export const BUSINESS_ID = `${SITE_URL}/#business`;

// Live-site menu plus the new Tattoos page (seo.md §B3, §B7 internal linking).
export const NAV = [
  { href: "/", label: "Home" },
  { href: "/tattoos", label: "Tattoos" },
  { href: "/portfolio", label: "Our tattoo artists" },
  { href: "/category/all-products", label: "Our antiques shop" },
  { href: "/about-us", label: "About us" },
  { href: "/contact-us", label: "Contact us" },
] as const;

export const FOOTER_LINKS = [
  ...NAV,
  { href: "/faq", label: "FAQ" },
  { href: "/tattoo-aftercare", label: "Tattoo aftercare" },
  { href: "/gift-vouchers", label: "Gift vouchers" },
] as const;

export const PRODUCTS_PER_PAGE = 24;

export const artistPath = (slug: string) => `/portfolio/${slug}`;

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Keep titles ≤ 60 chars (seo.md §B4). */
export function fitTitle(name: string, suffix: string, max = 60) {
  const room = max - suffix.length;
  const short = name.length > room ? `${name.slice(0, room - 1).trimEnd()}…` : name;
  return `${short}${suffix}`;
}
