import type { WixProduct } from "@/lib/data/types";

export function Price({ product, className = "" }: { product: WixProduct; className?: string }) {
  const { price, discountedPrice, formatted } = product.priceData;
  const onSale = discountedPrice < price;
  return (
    <p className={className}>
      {onSale ? (
        <>
          <span className="sr-only">Sale price </span>
          <span className="text-blood-bright">{formatted.discountedPrice}</span>{" "}
          <span className="sr-only">, was </span>
          <s className="font-normal text-muted">{formatted.price}</s>
        </>
      ) : (
        formatted.price
      )}
    </p>
  );
}
