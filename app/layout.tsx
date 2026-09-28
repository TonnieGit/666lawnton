import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "666 Tattoo & Antiques | Lawnton, North Brisbane",
    template: "%s | 666 Tattoo & Antiques",
  },
  description:
    "A unique blend of decades of tattoo expertise, a passion for antiques and a love of great coffee - all in one place. 21/666 Gympie Road, Lawnton.",
  robots: noindex ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
