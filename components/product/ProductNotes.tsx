import Link from "next/link";

// TODO(client): consistent condition / pickup wording for every antique
// (seo.md §A3 "Template adds consistent condition/era/pickup info"). Confirm
// postage options once checkout is connected in Phase 2.
export function ProductNotes({ sold }: { sold: boolean }) {
  return (
    <div className="mt-8 border border-bone/10 bg-ink-2 p-5 text-sm leading-relaxed">
      <h2 className="font-display text-lg">Good to know</h2>
      <ul className="mt-3 space-y-2 text-bone/85">
        <li>
          <span className="font-semibold text-bone">Condition:</span> pre-owned antique or vintage item. Expect some signs
          of age; please check the photos carefully.
        </li>
        <li>
          <span className="font-semibold text-bone">One of a kind:</span> most pieces are unique, so once it&apos;s sold,
          it&apos;s gone.
        </li>
        <li>
          <span className="font-semibold text-bone">{sold ? "Similar pieces:" : "See it in person:"}</span>{" "}
          {sold ? "new stock comes in regularly, so " : "visit us at 21/666 Gympie Road, Lawnton, or "}
          <Link href="/contact-us" className="text-brass underline">
            {sold ? "ask us to keep an eye out" : "get in touch with questions"}
          </Link>
          .
        </li>
      </ul>
    </div>
  );
}
