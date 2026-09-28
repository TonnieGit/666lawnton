import type { BusinessInfo } from "@/lib/data/types";
import { MapEmbed as ClickToLoadMap } from "./MapEmbed";

export function mapsQuery(b: BusinessInfo) {
  return encodeURIComponent(`${b.name}, ${b.address.street}, ${b.address.suburb} ${b.address.state} ${b.address.postcode ?? ""}`);
}

export function MapEmbed({ business, className = "" }: { business: BusinessInfo; className?: string }) {
  return <ClickToLoadMap business={business} query={mapsQuery(business)} className={className} />;
}

export function HoursList({ business: b }: { business: BusinessInfo }) {
  // TODO(client): opening hours aren't published on the current site.
  if (!b.hours.length) return <p>Hours to be confirmed. Call ahead on {b.phone}.</p>;
  return (
    <ul>
      {b.hours.map((h) => (
        <li key={h.day} className="flex justify-between gap-6">
          <span>{h.day}</span>
          <span>{h.open && h.close ? `${h.open}–${h.close}` : "Closed"}</span>
        </li>
      ))}
    </ul>
  );
}

export function BusinessDetails({ business: b }: { business: BusinessInfo }) {
  return (
    <dl className="space-y-5">
      <div>
        <dt className="text-xs uppercase tracking-[0.2em] text-brass">Address</dt>
        <dd className="mt-1">
          {b.address.street}, {b.address.suburb} {b.address.state} {b.address.postcode}
          <br />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery(b)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted underline hover:text-bone"
          >
            Get directions to our Lawnton studio
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.2em] text-brass">Phone</dt>
        <dd className="mt-1">
          <a href={`tel:${b.phoneE164}`} className="hover:underline">
            {b.phone}
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.2em] text-brass">Email</dt>
        <dd className="mt-1 break-all">
          <a href={`mailto:${b.email}`} className="hover:underline">
            {b.email}
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.2em] text-brass">Hours</dt>
        <dd className="mt-1 text-sm text-bone/85">
          <HoursList business={b} />
        </dd>
      </div>
      {b.licenceNumber && (
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-brass">Tattoo licence</dt>
          <dd className="mt-1 text-sm">{b.licenceNumber}</dd>
        </div>
      )}
    </dl>
  );
}
