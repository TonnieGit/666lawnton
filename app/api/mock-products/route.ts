// Product lookup for the localStorage demo cart. Mock mode only: in Wix mode
// the cart comes from @wix/ecom and this route 404s.
import { getProductsByIds } from "@/lib/data/mock/products";

export async function GET(request: Request) {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "wix") {
    return new Response("Not found", { status: 404 });
  }
  const ids = (new URL(request.url).searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 100);
  return Response.json(await getProductsByIds(ids));
}
