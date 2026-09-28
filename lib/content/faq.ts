// TODO(client): draft answers for the demo (seo.md §B8). Confirm every answer
// with the studio before launch, especially deposits, pricing, walk-ins and parking.
// Visible text and FAQPage JSON-LD are both built from this list.

export interface FaqItem {
  q: string;
  a: string;
  /** Optional in-site link shown under the answer. */
  link?: { href: string; label: string };
}

export const FAQ: FaqItem[] = [
  {
    q: "How much does a tattoo cost?",
    a: "Every tattoo is priced individually. Cost depends on the size, level of detail, placement and how long it will take. Send us your idea with a rough size and placement and we'll give you a quote before you book.",
  },
  {
    q: "Do I need to pay a deposit?",
    a: "Yes, a deposit is needed to secure your booking and to cover drawing time for custom designs. It comes off the final price of your tattoo. Ask us for the deposit amount when you book.",
  },
  {
    q: "How old do I need to be to get a tattoo?",
    a: "You must be 18 or over. In Queensland it's against the law to tattoo anyone under 18, even with a parent's permission. Please bring photo ID to your appointment.",
  },
  {
    q: "Do you take walk-ins?",
    a: "Sometimes. It depends on which artists are free on the day and the size of the tattoo. Smaller pieces are the most likely to fit in. Call us before you come in to check availability.",
  },
  {
    q: "Can you cover up an old tattoo?",
    a: "Yes. Cover-ups are one of our specialities, and Jimmy has over 20 years of experience reworking and covering old tattoos. Send us a clear photo of the tattoo you want covered so we can talk you through the options.",
    link: { href: "/tattoos#cover-ups", label: "More about cover-up tattoos" },
  },
  {
    q: "Do you do touch-ups?",
    a: "Yes. If a tattoo we did needs a touch-up once it has fully healed, get in touch and we'll arrange a time. We can also freshen up older tattoos done elsewhere; send us a photo first.",
  },
  {
    q: "What should I bring to my appointment?",
    a: "Bring photo ID, any reference images you've discussed with your artist, water and a snack for longer sessions. Wear loose, comfortable clothing that gives easy access to the area being tattooed.",
  },
  {
    q: "How do I prepare for my tattoo?",
    a: "Get a good night's sleep, eat a proper meal beforehand and stay hydrated. Avoid alcohol for 24 hours before your appointment, and let us know if you're unwell or have a skin condition in the area.",
  },
  {
    q: "How do I look after my new tattoo?",
    a: "Keep it clean, moisturised and out of the sun, and don't pick or scratch it while it heals. We stock quality aftercare products in the shop, and our aftercare guide walks you through each stage.",
    link: { href: "/tattoo-aftercare", label: "Read our tattoo aftercare guide" },
  },
  {
    q: "Do you sell gift vouchers?",
    a: "Yes. Tattoo gift vouchers are available in the shop in any amount, and they can be used with any of our artists.",
    link: { href: "/gift-vouchers", label: "About tattoo gift vouchers" },
  },
  {
    q: "Where are you and where can I park?",
    a: "We're at 21/666 Gympie Road, Lawnton, a short drive from Strathpine, Petrie and North Lakes. Give us a call if you need directions or parking tips on the day.",
    link: { href: "/contact-us", label: "Contact details and map" },
  },
];
