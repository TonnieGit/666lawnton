import Link from "next/link";
import { ArtistTile } from "@/components/ArtistCard";
import { ButtonLink } from "@/components/ButtonLink";
import { Eyebrow, PageHero, Section } from "@/components/Section";
import { WixImage } from "@/components/WixImage";
import { getArtists, getBusinessInfo } from "@/lib/data";
import { pageMetadata, wixOgImage } from "@/lib/seo";
import { artistPath } from "@/lib/site";

// TODO(client): demo copy drafted from the live site (seo.md §B8.2). Confirm the
// full list of styles each artist offers, the booking process and deposit wording.

const HERO = "wix:image://v1/bfd742_401af3b46787482982b30cc42913175b~mv2.jpg/bfd742_401af3b46787482982b30cc42913175b~mv2.jpg#originWidth=763&originHeight=636";
const COVER_UP =
  "wix:image://v1/bfd742_51a5133483734990bf5477f6046e073b~mv2.jpg/bfd742_51a5133483734990bf5477f6046e073b~mv2.jpg#originWidth=1080&originHeight=1080";

export const metadata = pageMetadata({
  title: "Custom & Cover-Up Tattoos, North Brisbane | 666 Tattoo",
  description:
    "Traditional, Japanese, realism and cover-up tattoos by experienced artists in Lawnton, close to Strathpine, Petrie and North Lakes. Enquire now.",
  path: "/tattoos",
  image: {
    url: wixOgImage("https://static.wixstatic.com/media/bfd742_401af3b46787482982b30cc42913175b~mv2.jpg"),
    width: 1200,
    height: 630,
    alt: "Colour hummingbird tattoo by 666 Tattoo Lawnton",
  },
});

const STYLES = [
  {
    name: "Traditional",
    body: "Bold lines, a strong palette and timeless designs that read clearly from across the room and hold up for decades.",
    artists: ["jimmy"],
  },
  {
    name: "Japanese",
    body: "Koi, dragons, peonies and waves, designed to flow with the body. Great for larger pieces, sleeves and back work.",
    artists: ["jimmy"],
  },
  {
    name: "Realism & portraits",
    body: "Detailed black and grey or colour realism, including portraits of people and pets, built from good reference photos.",
    artists: ["jimmy", "jeff"],
  },
  {
    name: "Blackwork, stipple & fine line",
    body: "From heavy solid blackwork to soft dotwork shading and delicate single-needle line work.",
    artists: ["jeff", "lindsay"],
  },
  {
    name: "Neo traditional & florals",
    body: "Traditional foundations with more colour, depth and detail. Botanical and floral pieces are a favourite.",
    artists: ["lindsay"],
  },
];

const BOOKING = [
  ["Send an enquiry", "Tell us your idea, the size, placement and any reference images. Say which artist you'd like, or let us match you."],
  ["Consult and quote", "Your artist will talk through the design and give you a quote. Pop into the studio if you'd like to chat in person."],
  ["Pay a deposit", "A deposit secures your appointment and covers drawing time. It comes off the final price."],
  ["Get tattooed", "Bring photo ID (you must be 18+), eat beforehand and wear comfortable clothes. Then follow our aftercare guide."],
];

const MORE = [
  ["/faq", "Tattoo FAQs: pricing, deposits, age rules and walk-ins"],
  ["/tattoo-aftercare", "How to look after your new tattoo"],
  ["/gift-vouchers", "Tattoo gift vouchers"],
];

export default async function TattoosPage() {
  const [artists, business] = await Promise.all([getArtists(), getBusinessInfo()]);
  const byslug = new Map(artists.map((a) => [a.slug, a]));
  const nearby = business.catchment.slice(0, 6);

  return (
    <>
      <PageHero
        crumbs={[{ name: "Tattoos", href: "/tattoos" }]}
        eyebrow="666 Tattoo · Lawnton"
        title="Custom Tattoos in North Brisbane"
        aside={
          <div className="relative aspect-[763/636] w-full overflow-hidden rounded-2xl">
            <WixImage
              image={HERO}
              alt="Colour hummingbird tattoo by 666 Tattoo Lawnton"
              sizes="(min-width: 768px) 460px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        }
      >
        <p>
          666 Tattoo is a custom tattoo studio in Lawnton on Brisbane&apos;s northside. Our artists bring more than 30 years
          of combined experience in the Queensland tattoo industry, and every design is drawn for you, from small first
          tattoos to full sleeves and back pieces.
        </p>
        <p>
          We&apos;re on Gympie Road, a short drive from {nearby.slice(0, -1).join(", ")} and {nearby.at(-1)}. Come in to
          talk through your idea, see the artists&apos; work in person and find the right artist for your style.
        </p>
        <div className="flex flex-wrap gap-3 pt-4">
          <ButtonLink href="/contact-us">Enquire about a tattoo</ButtonLink>
          <ButtonLink href="/portfolio" variant="outline">
            Browse artist portfolios
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="light" aria-labelledby="styles">
        <div className="reveal max-w-3xl">
          <Eyebrow>Styles</Eyebrow>
          <h2 id="styles" className="mt-2 font-display text-4xl md:text-5xl">
            Japanese, Traditional &amp; More Tattoo Styles
          </h2>
          <p className="mt-4 leading-relaxed text-bone/85">
            Each artist has their own strengths, so tell us the style you&apos;re after and we&apos;ll match you with the
            right person.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STYLES.map((s) => (
            <li key={s.name} className="reveal flex flex-col rounded-2xl bg-ink-2 p-6 md:p-7">
              <h3 className="font-display text-2xl">{s.name}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-bone/80">{s.body}</p>
              <p className="mt-5 text-sm text-muted">
                Ask for{" "}
                {s.artists
                  .map((slug) => byslug.get(slug))
                  .filter(Boolean)
                  .map((a, i, arr) => (
                    <span key={a!.slug}>
                      <Link href={artistPath(a!.slug)} className="font-semibold text-brass hover:underline">
                        {a!.title}
                      </Link>
                      {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " or " : ""}
                    </span>
                  ))}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="cover-ups" aria-labelledby="cover-ups-title" className="scroll-mt-24">
        <div className="reveal grid gap-2 rounded-3xl border border-bone/10 bg-ink-2 p-2 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-3">
            <WixImage
              image={COVER_UP}
              alt="Before and after: an old name tattoo covered with a colour skull and roses, by Jimmy at 666 Tattoo Lawnton"
              sizes="(min-width: 768px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col p-5 md:p-8">
            <Eyebrow>Before and after</Eyebrow>
            <h2 id="cover-ups-title" className="mt-2 font-display text-4xl md:text-5xl">
              Cover-Up Tattoos
            </h2>
            <div className="mt-5 flex-1 space-y-4 leading-relaxed text-bone/85">
              <p>
                Not every tattoo ages the way you hoped. Lines blur, colours fade, and sometimes the design just isn&apos;t
                you any more. A good cover-up turns an old tattoo into something you&apos;re proud to show off.
              </p>
              <p>
                Cover-ups are one of our specialities. Jimmy has spent more than 20 years reworking and covering tattoos,
                and he&apos;ll plan a design that uses the shapes and dark areas of your existing ink rather than fighting
                them. Some tattoos can be reworked and refreshed instead of fully covered, and he&apos;ll talk you through
                both options.
              </p>
              <p>Send us a clear, well-lit photo of the tattoo you want covered, with its rough size, to get started.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact-us?artist=jimmy">Ask about a cover-up</ButtonLink>
              <ButtonLink href={artistPath("jimmy")} variant="outline">
                See Jimmy&apos;s work
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="grid gap-14 md:grid-cols-2">
          <section aria-labelledby="booking" className="reveal">
            <Eyebrow>Four steps</Eyebrow>
            <h2 id="booking" className="mt-2 font-display text-4xl">
              How Booking Works
            </h2>
            <ol className="mt-8 space-y-3">
              {BOOKING.map(([t, d], i) => (
                <li key={t} className="flex gap-4 rounded-2xl bg-ink-2 p-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blood font-display text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{t}</h3>
                    <p className="mt-1 text-bone/80">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="pricing" className="reveal">
            <Eyebrow>Quotes</Eyebrow>
            <h2 id="pricing" className="mt-2 font-display text-4xl">
              Tattoo Pricing &amp; Deposits
            </h2>
            <div className="mt-8 space-y-4 leading-relaxed text-bone/85">
              <p>
                Every tattoo is quoted individually. Price depends on the size, the amount of detail, the placement on
                your body and how many sessions it will take. Larger pieces like sleeves are usually done over several
                sessions.
              </p>
              <p>We&apos;ll always give you a quote before you commit, and a deposit is needed to lock in your booking.</p>
              {business.licenceNumber && <p>Licensed tattoo studio, licence {business.licenceNumber}.</p>}
            </div>
            <ul className="mt-8 divide-y divide-bone/10 border-y border-bone/10 text-sm font-semibold">
              {MORE.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center justify-between gap-4 py-4 hover:text-brass">
                    {label}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Section>

      <Section aria-labelledby="team">
        <div className="reveal">
          <Eyebrow>The studio</Eyebrow>
          <h2 id="team" className="mt-2 font-display text-4xl">
            Our Lawnton Tattoo Artists
          </h2>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {artists.map((a) => (
            <li key={a._id} className="reveal">
              <ArtistTile artist={a} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
