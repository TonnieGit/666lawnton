import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { Fraunces, Inter } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "666 Tattoo & Antiques | Lawnton, North Brisbane",
    template: "%s | 666 Tattoo & Antiques",
  },
  description: "A home for our 666 Tattoos and Antiques Shop in Lawnton, North Brisbane.",
  openGraph: { siteName: "666 Tattoo & Antiques", locale: "en_AU", type: "website" },
  robots: noindex ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // All product and gallery images come from Wix's CDN.
  preconnect("https://static.wixstatic.com");
  return (
    <html lang="en-AU" className={`${fraunces.variable} ${inter.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
