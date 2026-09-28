import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
import { pageMetadata } from "@/lib/seo";

// TODO(client): general aftercare guidance drafted for the demo (seo.md §B8.3).
// Replace with the artists' own advice (wrap time, products, etc.) before launch.

export const metadata = pageMetadata({
  title: "Tattoo Aftercare Guide | 666 Tattoo Lawnton",
  description:
    "How to look after your new tattoo, day by day, from the artists at 666 Tattoo in Lawnton, North Brisbane. Cleaning, moisturising, sun care and healing tips.",
  path: "/tattoo-aftercare",
  type: "article",
});

const STAGES = [
  {
    when: "The first few hours",
    steps: [
      "Leave the wrap or film on for as long as your artist tells you. It protects the fresh tattoo from bacteria and friction.",
      "Wash your hands before you touch your tattoo, every time.",
      "When you remove the wrap, gently wash the tattoo with lukewarm water and a mild, fragrance-free soap to remove plasma and excess ink.",
      "Pat it dry with a clean paper towel. Don't rub, and don't use a shared bath towel.",
    ],
  },
  {
    when: "Days 1 to 3",
    steps: [
      "Wash gently two or three times a day and pat dry.",
      "Apply a very thin layer of tattoo aftercare balm. Less is more: the tattoo should look moist, not shiny or greasy.",
      "Some redness, swelling and weeping is normal in the first couple of days.",
      "Wear loose, clean clothing over the area and sleep on clean sheets.",
    ],
  },
  {
    when: "Days 4 to 14",
    steps: [
      "Your tattoo will start to flake and peel, and it may feel itchy. Don't pick, scratch or peel it; let the flakes fall off on their own.",
      "Keep moisturising lightly whenever the skin feels tight or dry.",
      "Avoid swimming pools, the ocean, spas and baths. Short showers are fine.",
      "Keep it out of direct sun, and don't use fake tan or sunscreen on it until it's healed.",
    ],
  },
  {
    when: "Weeks 2 to 4 and beyond",
    steps: [
      "The surface will look healed, but the skin underneath is still settling. Keep moisturising and keep it out of the sun.",
      "Once fully healed, use a high-SPF sunscreen every time it's exposed. Sun is the biggest cause of fading.",
      "If any area needs a touch-up after healing, get in touch and we'll sort it out.",
    ],
  },
];

export default function AftercarePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <Breadcrumbs items={[{ name: "Tattoos", href: "/tattoos" }, { name: "Tattoo aftercare", href: "/tattoo-aftercare" }]} />

      <h1 className="mt-6 font-display text-5xl md:text-6xl">Tattoo Aftercare Guide</h1>
      <p className="mt-5 text-lg leading-relaxed text-bone/85">
        Good tattoo aftercare makes a real difference to how your tattoo heals and how it looks for years to come. Here&apos;s
        how the team at 666 Tattoo in Lawnton recommends looking after your new tattoo, stage by stage. Always follow any
        specific instructions your artist gives you on the day.
      </p>

      <ol className="mt-12 space-y-12">
        {STAGES.map((s, i) => (
          <li key={s.when}>
            <h2 className="flex items-baseline gap-4 font-display text-3xl">
              <span className="text-brass">{String(i + 1).padStart(2, "0")}</span>
              {s.when}
            </h2>
            <ul className="mt-5 list-disc space-y-3 pl-6 leading-relaxed text-bone/85 marker:text-blood-bright">
              {s.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section aria-labelledby="warning" className="mt-14 border-l-4 border-blood bg-ink-2 p-6">
        <h2 id="warning" className="font-display text-2xl">
          When to get help
        </h2>
        <p className="mt-3 leading-relaxed text-bone/85">
          Redness and tenderness that get worse after the first few days, spreading heat or swelling, pus, a bad smell or a
          fever can be signs of infection. See a doctor straight away, then let us know.
        </p>
      </section>

      <section aria-labelledby="products" className="mt-14">
        <h2 id="products" className="font-display text-2xl">
          Aftercare products in store
        </h2>
        <p className="mt-3 leading-relaxed text-bone/85">
          We stock quality tattoo aftercare products at our Lawnton shop, so you can pick up everything you need on the day
          of your appointment. Got questions?{" "}
          <Link href="/faq" className="text-brass underline">
            Read our tattoo FAQs
          </Link>{" "}
          or{" "}
          <Link href="/contact-us" className="text-brass underline">
            get in touch
          </Link>
          .
        </p>
        <div className="mt-8">
          <ButtonLink href="/tattoos">Explore our tattoo styles</ButtonLink>
        </div>
      </section>
    </div>
  );
}
