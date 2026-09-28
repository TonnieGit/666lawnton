import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { Eyebrow, PageHero, Section } from "@/components/Section";
import { WixImage } from "@/components/WixImage";
import { getBusinessInfo } from "@/lib/data";
import { pageMetadata, wixOgImage } from "@/lib/seo";

// TODO(client): confirm how vouchers are sold, amounts, expiry and whether they
// cover antiques as well as tattoos (seo.md §B8.5). Online vouchers are a later phase.

const IMAGE =
  "wix:image://v1/bfd742_cade63cffca0435589800f1f75ef4c66~mv2.png/bfd742_cade63cffca0435589800f1f75ef4c66~mv2.png#originWidth=804&originHeight=861";
const ALT = "666 Tattoo gift certificates with tattoo aftercare products";

export const metadata = pageMetadata({
  title: "Tattoo Gift Vouchers | 666 Tattoo Lawnton",
  description:
    "Give the gift of ink. Tattoo gift vouchers available in any amount from 666 Tattoo in Lawnton, North Brisbane. Buy in store or call us to arrange one.",
  path: "/gift-vouchers",
  image: {
    url: wixOgImage("https://static.wixstatic.com/media/bfd742_cade63cffca0435589800f1f75ef4c66~mv2.png"),
    width: 1200,
    height: 630,
    alt: ALT,
  },
});

export default async function GiftVouchersPage() {
  const b = await getBusinessInfo();
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Tattoos", href: "/tattoos" },
          { name: "Gift vouchers", href: "/gift-vouchers" },
        ]}
        eyebrow="Give the gift of ink"
        title="Tattoo Gift Vouchers"
        aside={
          <div className="overflow-hidden rounded-2xl">
            <WixImage image={IMAGE} alt={ALT} intrinsic priority sizes="(min-width: 768px) 460px, 100vw" className="h-auto w-full" />
          </div>
        }
      >
        <p>
          Know someone who&apos;s been talking about their next tattoo for months? A 666 Tattoo gift voucher lets them choose
          the design, the artist and the timing. Vouchers are available in any amount and can be used with any of our
          artists at the Lawnton studio.
        </p>
        <div className="pt-4">
          <ButtonLink href="/contact-us">Ask about gift vouchers</ButtonLink>
        </div>
      </PageHero>

      <Section tone="light">
        <div className="grid gap-4 md:grid-cols-2">
          <section aria-labelledby="how-to-buy" className="reveal rounded-2xl bg-ink-2 p-6 md:p-8">
            <Eyebrow>In store or by phone</Eyebrow>
            <h2 id="how-to-buy" className="mt-2 font-display text-3xl">
              How to buy a gift voucher
            </h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 leading-relaxed text-bone/85 marker:text-brass">
              <li>
                Visit us in store at {b.address.street}, {b.address.suburb}, and we&apos;ll make one up for you on the spot.
              </li>
              <li>
                Or call us on{" "}
                <a href={`tel:${b.phoneE164}`} className="text-brass underline">
                  {b.phone}
                </a>{" "}
                to arrange a voucher.
              </li>
              <li>Choose any amount. It can go towards a deposit, a small piece or part of a bigger project.</li>
            </ol>
          </section>

          <section aria-labelledby="good-to-know" className="reveal rounded-2xl bg-ink-2 p-6 md:p-8">
            <Eyebrow>Before you buy</Eyebrow>
            <h2 id="good-to-know" className="mt-2 font-display text-3xl">
              Good to know
            </h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-bone/85 marker:text-brass">
              <li>The person receiving the voucher needs to be 18 or over to be tattooed.</li>
              <li>
                Pair it with{" "}
                <Link href="/tattoo-aftercare" className="text-brass underline">
                  aftercare products
                </Link>{" "}
                from the shop for a complete gift.
              </li>
              <li>
                Not sure who to book with?{" "}
                <Link href="/portfolio" className="text-brass underline">
                  Browse our tattoo artists
                </Link>
                .
              </li>
            </ul>
          </section>
        </div>
      </Section>
    </>
  );
}
