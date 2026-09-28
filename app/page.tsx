// M1 placeholder: proves the data layer works end to end with DATA_SOURCE=mock.
// Replaced by the real home page in M4 (spec §7 "Home").
import Image from "next/image";
import Link from "next/link";
import { dataSource, getProducts, getSiteContent } from "@/lib/data";
import { resolveMediaUrl } from "@/lib/media";

export default async function Home() {
  const [hero, { items, total }] = await Promise.all([
    getSiteContent("home-hero"),
    getProducts({ sort: "newest", limit: 8 }),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-widest text-neutral-500">Data source: {dataSource}</p>
      <h1 className="mt-2 text-4xl font-bold">{hero?.title}</h1>
      <p className="mt-4 max-w-2xl text-lg">{hero?.body}</p>

      <h2 className="mt-12 text-2xl font-semibold">Latest antiques ({total})</h2>
      <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => {
          const img = p.media.mainMedia?.image;
          return (
            <li key={p._id}>
              <Link href={`/product-page/${p.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  {img && (
                    <Image
                      src={resolveMediaUrl(img.url, img.width, img.height)}
                      alt={img.altText || p.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm">{p.name}</p>
                <p className="text-sm font-semibold">{p.priceData.formatted.discountedPrice}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
