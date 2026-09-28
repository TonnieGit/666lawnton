import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { BusinessDetails, MapEmbed } from "@/components/LocationBlock";
import { Eyebrow, PageHero, Section } from "@/components/Section";
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
    <>
      {/* LocalBusiness JSON-LD is site-wide (app/layout.tsx). */}
      <PageHero crumbs={[{ name: "Contact us", href: "/contact-us" }]} eyebrow="Contact" title={intro?.title ?? "Get in Touch"}>
        <p>
          Come and see us at our tattoo studio and antiques shop on Gympie Road, Lawnton. We&apos;re a short drive from{" "}
          {business.catchment.slice(0, 5).join(", ")} and {business.catchment[5]}. Call, email or send us a message below.
        </p>
      </PageHero>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-bone/10 bg-ink-2 p-6 md:p-8">
          <BusinessDetails business={business} />
          {socials.length > 0 && (
            <div className="mt-8 border-t border-bone/10 pt-6">
              <h2 className="text-xs uppercase tracking-[0.2em] text-brass">Connect with us</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-xl border border-bone/30 px-4 py-2 text-sm hover:bg-bone hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="rounded-3xl border border-bone/10 bg-ink-2 p-6 md:p-8">
          <h2 className="font-display text-3xl">Send us a message</h2>
          <div className="mt-6">
            <Suspense>
              <ContactForm successMessage={intro?.body ?? "Thanks for getting in touch."} />
            </Suspense>
          </div>
        </div>
      </div>

      <Section aria-labelledby="map">
        <div className="reveal">
          <Eyebrow>Find us</Eyebrow>
          <h2 id="map" className="mt-2 font-display text-4xl">
            Visit the studio
          </h2>
          <div className="mt-8 aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[21/9]">
            <MapEmbed business={business} className="rounded-2xl" />
          </div>
        </div>
      </Section>
    </>
  );
}
