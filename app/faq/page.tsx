import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, Section } from "@/components/Section";
import { FAQ } from "@/lib/content/faq";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Tattoo FAQs: Pricing, Booking & Cover-Ups | 666 Tattoo",
  description:
    "Answers on tattoo pricing, deposits, age rules, cover-ups and walk-ins at 666 Tattoo, Lawnton. Everything you need to know before booking your next tattoo.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      {/* FAQPage marks up exactly the visible questions (seo.md §B5). */}
      <JsonLd data={faqJsonLd(FAQ)} />
      <PageHero
        crumbs={[
          { name: "Tattoos", href: "/tattoos" },
          { name: "FAQ", href: "/faq" },
        ]}
        eyebrow="Before you book"
        title="Frequently Asked Questions"
        width="narrow"
      >
        <p>
          Common questions about getting a tattoo at 666 Tattoo in Lawnton: pricing, deposits, age requirements,
          cover-ups, walk-ins and what to expect on the day. Can&apos;t see your question?{" "}
          <Link href="/contact-us" className="text-brass underline">
            Ask us directly
          </Link>
          .
        </p>
      </PageHero>

      <Section tone="light" width="narrow">
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details key={item.q} className="reveal group rounded-2xl bg-ink-2 px-6 py-5 open:pb-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <h2 className="font-display text-xl">{item.q}</h2>
                <span
                  aria-hidden="true"
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-bone/20 text-xl leading-none text-brass transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-bone/85">{item.a}</p>
              {item.link && (
                <Link href={item.link.href} className="mt-3 inline-block text-sm font-semibold text-brass hover:underline">
                  {item.link.label} →
                </Link>
              )}
            </details>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/contact-us">Enquire about a tattoo</ButtonLink>
          <ButtonLink href="/portfolio" variant="outline">
            Meet our tattoo artists
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
