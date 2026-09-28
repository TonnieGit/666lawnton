import Link from "next/link";
import { getBusinessInfo } from "@/lib/data";
import { NAV } from "@/lib/site";

export async function Footer() {
  const b = await getBusinessInfo();
  const socials = [
    b.socials.instagram && { label: "Instagram", href: `https://www.instagram.com/${b.socials.instagram}/` },
    b.socials.facebook && { label: "Facebook", href: `https://www.facebook.com/${b.socials.facebook}/` },
    b.socials.tiktok && { label: "TikTok", href: `https://www.tiktok.com/@${b.socials.tiktok}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="mt-24 border-t border-bone/10 bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-bone/10 pb-10 md:flex-row md:items-center">
          <p className="max-w-md font-display text-3xl leading-tight">Tattoo, antiques &amp; coffee under one roof.</p>
          <Link
            href="/contact-us"
            className="bg-blood px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-blood/90"
          >
            Chat to us now
          </Link>
        </div>

        <div className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-display text-lg">{b.name}</h2>
            <address className="mt-3 text-sm not-italic leading-relaxed text-muted">
              {b.address.street}, {b.address.suburb}
              <br />
              {b.address.city}, {b.address.state}, {b.address.country}
            </address>
          </div>
          <div>
            <h2 className="font-display text-lg">Contact</h2>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              <li>
                <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:text-bone">
                  {b.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${b.email}`} className="break-all hover:text-bone">
                  {b.email}
                </a>
              </li>
            </ul>
          </div>
          <nav aria-label="Footer">
            <h2 className="font-display text-lg">Explore</h2>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-bone">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="font-display text-lg">Follow</h2>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-muted">
          © {new Date().getFullYear()} {b.name}, Lawnton, North Brisbane.
        </p>
      </div>
    </footer>
  );
}
