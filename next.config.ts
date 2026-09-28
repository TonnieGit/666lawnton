import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DATA_SOURCE / MOCK_MEDIA are the single source of truth (spec §4); they're
  // mirrored to NEXT_PUBLIC_* so client code (cart, images) sees the same values.
  env: {
    NEXT_PUBLIC_DATA_SOURCE: process.env.DATA_SOURCE ?? "mock",
    NEXT_PUBLIC_MOCK_MEDIA: process.env.MOCK_MEDIA ?? "remote",
  },
  // No trailing slashes, matching the live Wix URLs (seo.md §A4, §B3).
  trailingSlash: false,
  // Old Wix URLs (seo.md §B3 redirect map, spec §11 step 4).
  async redirects() {
    return [
      { source: "/portfolio-collections/my-portfolio/:artist", destination: "/portfolio/:artist", statusCode: 301 },
      { source: "/portfolio-collections/my-portfolio", destination: "/portfolio", statusCode: 301 },
      { source: "/portfolio-collections", destination: "/portfolio", statusCode: 301 },
      // "Nothing to book right now" on the live site; enquiries go via contact.
      { source: "/book-online", destination: "/contact-us", statusCode: 301 },
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/wix-image-loader.ts",
    qualities: [75, 80, 85],
  },
};

export default nextConfig;
