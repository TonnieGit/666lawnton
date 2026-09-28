import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BusinessDetails, MapEmbed } from "@/components/LocationBlock";
import { getBusinessInfo, getSiteContent } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact & Directions | 666 Tattoo & Antiques Lawnton",
  description:
    "Visit us at 21/666 Gympie Road, Lawnton QLD 4501, call 0448 677 666 or send a message. Opening hours, map and directions.",
  path: "/contact-us",
});

export default async function ContactPage() {
  const [business, intro] = await Promise.all([getBusinessInfo(), getSiteContent("contact-intro")]);
  const socials = [
    business.socials.instagram && { label: "Instagram", href: `https://www.instagram.com/${business.socials.instagram}/` },
    business.socials.facebook && { label: "Facebook", href: `https://www.facebook.com/${business.socials.facebook}/` },
    business.socials.tiktok && { label: "TikTok", href: `https://www.tiktok.com/@${business.socials.tiktok}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      {/* LocalBusiness JSON-LD is site-wide (app/layout.tsx). */}
      <Breadcrumbs items={[{ name: "Contact us", href: "/contact-us" }]} />
      <h1 className="mt-6 font-display text-5xl md:text-6xl">{intro?.title ?? "Get in Touch"}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone/85">
        Come and see us at our tattoo studio and antiques shop on Gympie Road, Lawnton. We&apos;re a short drive from{" "}
        {business.catchment.slice(0, 5).join(", ")} and {business.catchment[5]}. Call, email or send us a message below.
      </p>

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
