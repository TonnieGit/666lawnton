import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
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
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      {/* FAQPage marks up exactly the visible questions (seo.md §B5). */}
      <JsonLd data={faqJsonLd(FAQ)} />
      <Breadcrumbs items={[{ name: "Tattoos", href: "/tattoos" }, { name: "FAQ", href: "/faq" }]} />

      <h1 className="mt-6 font-display text-5xl md:text-6xl">Frequently Asked Questions</h1>
      <p className="mt-5 text-lg leading-relaxed text-bone/85">
        Common questions about getting a tattoo at 666 Tattoo in Lawnton: pricing, deposits, age requirements,
        cover-ups, walk-ins and what to expect on the day. Can&apos;t see your question?{" "}
        <Link href="/contact-us" className="text-brass underline">
          Ask us directly
        </Link>
        .
      </p>

      <div className="mt-10 divide-y divide-bone/10 border-y border-bone/10">
        {FAQ.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
              <h2 className="font-display text-xl">{item.q}</h2>
              <span aria-hidden="true" className="mt-1 text-2xl leading-none text-brass transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-bone/85">{item.a}</p>
            {item.link && (
              <Link href={item.link.href} className="mt-3 inline-block text-sm text-brass underline">
                {item.link.label}
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
    </div>
  );
}
