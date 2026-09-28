import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
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
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <Breadcrumbs items={[{ name: "Tattoos", href: "/tattoos" }, { name: "Gift vouchers", href: "/gift-vouchers" }]} />

      <div className="mt-6 grid items-start gap-12 md:grid-cols-2">
        <div>
          <h1 className="font-display text-5xl md:text-6xl">Tattoo Gift Vouchers</h1>
          <p className="mt-6 text-lg leading-relaxed text-bone/85">
            Know someone who&apos;s been talking about their next tattoo for months? A 666 Tattoo gift voucher lets them
            choose the design, the artist and the timing. Vouchers are available in any amount and can be used with any of
            our artists at the Lawnton studio.
          </p>

          <h2 className="mt-10 font-display text-3xl">How to buy a gift voucher</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-6 leading-relaxed text-bone/85 marker:text-brass">
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

          <h2 className="mt-10 font-display text-3xl">Good to know</h2>
          <ul className="mt-5 list-disc space-y-3 pl-6 leading-relaxed text-bone/85 marker:text-brass">
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

          <div className="mt-10">
            <ButtonLink href="/contact-us">Ask about gift vouchers</ButtonLink>
          </div>
        </div>
        <div className="relative w-full">
          <WixImage image={IMAGE} alt={ALT} intrinsic priority sizes="(min-width: 768px) 540px, 100vw" className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}
