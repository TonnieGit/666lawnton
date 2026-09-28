import type { MetadataRoute } from "next";
import { NOINDEX, SITE_URL } from "@/lib/site";

// Previews: block everything. Production: allow all except cart + API (seo.md §B7).
export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
