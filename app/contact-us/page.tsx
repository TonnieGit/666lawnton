import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { BusinessDetails, MapEmbed } from "@/components/LocationBlock";
import { getBusinessInfo, getSiteContent } from "@/lib/data";
import { localBusinessJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Contact, call or email our 666 Tattoo and Antiques Shop in Lawnton, North Brisbane, Australia.",
  alternates: { canonical: "/contact-us" },
};

export default async function ContactPage() {
  const [business, intro] = await Promise.all([getBusinessInfo(), getSiteContent("contact-intro")]);
  const socials = [
    business.socials.instagram && { label: "Instagram", href: `https://www.instagram.com/${business.socials.instagram}/` },
    business.socials.facebook && { label: "Facebook", href: `https://www.facebook.com/${business.socials.facebook}/` },
    business.socials.tiktok && { label: "TikTok", href: `https://www.tiktok.com/@${business.socials.tiktok}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <JsonLd data={localBusinessJsonLd(business)} />
      <p className="text-xs uppercase tracking-[0.3em] text-brass">Here&apos;s how you can</p>
      <h1 className="mt-2 font-display text-5xl md:text-6xl">{intro?.title ?? "Get in touch with us"}</h1>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <BusinessDetails business={business} />
          {socials.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs uppercase tracking-[0.2em] text-brass">Connect with us</h2>
              <ul className="mt-3 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block border border-bone/30 px-4 py-2 text-sm hover:bg-bone hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <h2 className="font-display text-2xl">Send us a message</h2>
          <div className="mt-6">
            <Suspense>
              <ContactForm successMessage={intro?.body ?? "Thanks for getting in touch."} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mt-16 aspect-[16/9] w-full md:aspect-[21/9]">
        <MapEmbed business={business} />
      </div>
    </div>
  );
}
