export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

// Matches the live site's menu (labels and order).
export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About us" },
  { href: "/category/all-products", label: "Our antiques shop" },
  { href: "/portfolio", label: "Our tattoo artists" },
  { href: "/contact-us", label: "Contact us" },
] as const;

export const PRODUCTS_PER_PAGE = 24;

export const artistPath = (slug: string) => `/portfolio-collections/my-portfolio/${slug}`;

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
