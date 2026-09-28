import type { BusinessInfo } from "@/lib/data/types";
import { MapEmbed as ClickToLoadMap } from "./MapEmbed";

export function mapsQuery(b: BusinessInfo) {
  return encodeURIComponent(`${b.name}, ${b.address.street}, ${b.address.suburb} ${b.address.state} ${b.address.postcode ?? ""}`);
}

export function MapEmbed({ business, className = "" }: { business: BusinessInfo; className?: string }) {
  return <ClickToLoadMap business={business} query={mapsQuery(business)} className={className} />;
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
            Get directions
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.2em] text-brass">Phone</dt>
        <dd className="mt-1">
          <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:underline">
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
      {b.hours.length > 0 && (
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-brass">Hours</dt>
          <dd className="mt-1">
            <ul className="text-sm">
              {b.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-6">
                  <span>{h.day}</span>
                  <span className="text-muted">{h.open && h.close ? `${h.open}–${h.close}` : "Closed"}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      )}
    </dl>
  );
}
