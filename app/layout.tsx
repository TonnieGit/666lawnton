import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { JsonLd } from "@/components/JsonLd";
import { BookingPill } from "@/components/layout/BookingPill";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getBusinessInfo } from "@/lib/data";
import { NOINDEX, SITE_URL } from "@/lib/site";
import { localBusinessJsonLd } from "@/lib/structured-data";
import "./globals.css";

// One web font (headings), swap, latin subset (seo.md §B7). Body text uses the
// system UI font: no download, so body copy paints immediately on slow mobile
// connections instead of re-rendering (and delaying LCP) when a font arrives.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });

const isProduction = process.env.VERCEL_ENV === "production" && !NOINDEX;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tattoo Studio & Antiques Shop in Lawnton | 666",
    template: "%s | 666 Tattoo & Antiques",
  },
  description:
    "Northside Brisbane tattoo studio with 30+ years' combined experience, plus a shop of hand-picked antiques. 21/666 Gympie Rd, Lawnton. Enquire today.",
  robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
  // Google Search Console, set per environment.
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // All product and gallery images come from Wix's CDN.
  preconnect("https://static.wixstatic.com");
  const business = await getBusinessInfo();

  return (
    <html lang="en-AU" className={`${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={localBusinessJsonLd(business)} />
        <CartProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <BookingPill />
          <CartDrawer />
        </CartProvider>
        {isProduction && <Analytics />}
      </body>
    </html>
  );
}
