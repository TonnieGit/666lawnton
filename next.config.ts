import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DATA_SOURCE / MOCK_MEDIA are the single source of truth (spec §4); they're
  // mirrored to NEXT_PUBLIC_* so client code (cart, images) sees the same values.
  env: {
    NEXT_PUBLIC_DATA_SOURCE: process.env.DATA_SOURCE ?? "mock",
    NEXT_PUBLIC_MOCK_MEDIA: process.env.MOCK_MEDIA ?? "remote",
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/wix-image-loader.ts",
    qualities: [75, 85],
  },
};

export default nextConfig;
