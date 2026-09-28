// Phase 2: live cart via @wix/ecom currentCart, checkout via a Wix redirect session.
import { formatPrice } from "@/lib/format";
import type { Cart, CartSource } from "../types";
import { getWixBrowserClient, persistWixTokens, WIX_STORES_APP_ID } from "./client";

// Loosely typed: the SDK's Cart type is large; we only read what the app needs.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCart(wixCart: any): Cart {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lines = (wixCart?.lineItems ?? []).map((li: any) => {
    const amount = Number(li.price?.amount ?? 0);
    const full = Number(li.fullPrice?.amount ?? amount);
    const image = li.image ? { url: li.image, width: 0, height: 0 } : undefined;
    return {
      _id: li._id,
      productId: li.catalogReference?.catalogItemId,
      name: li.productName?.original ?? "",
      slug: (li.url ?? "").split("/product-page/")[1] ?? "",
      quantity: li.quantity,
      options: li.catalogReference?.options?.options ?? {},
      price: {
        currency: wixCart.currency,
        price: full,
        discountedPrice: amount,
        formatted: { price: formatPrice(full, wixCart.currency), discountedPrice: formatPrice(amount, wixCart.currency) },
      },
      image,
    };
  });
  const subtotal = lines.reduce((s: number, l: Cart["lines"][number]) => s + l.price.discountedPrice * l.quantity, 0);
  return {
    lines,
    currency: wixCart?.currency ?? "AUD",
    subtotal: { amount: subtotal, formatted: formatPrice(subtotal, wixCart?.currency ?? "AUD") },
    itemCount: lines.reduce((n: number, l: Cart["lines"][number]) => n + l.quantity, 0),
  };
}

const EMPTY: Cart = { lines: [], currency: "AUD", subtotal: { amount: 0, formatted: formatPrice(0) }, itemCount: 0 };

export const wixCart: CartSource = {
  async getCart() {
    try {
      return toCart(await getWixBrowserClient().currentCart.getCurrentCart());
    } catch {
      return EMPTY; // No cart yet for this visitor.
    }
  },

  async addToCart(productId, quantity, options = {}) {
    const res = await getWixBrowserClient().currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: { catalogItemId: productId, appId: WIX_STORES_APP_ID, options: { options } },
          quantity,
        },
      ],
    });
    persistWixTokens();
    return toCart(res.cart);
  },

  async updateCartLine(lineId, quantity) {
    const res = await getWixBrowserClient().currentCart.updateCurrentCartLineItemQuantity([{ _id: lineId, quantity }]);
    return toCart(res.cart);
  },

  async removeCartLine(lineId) {
    const res = await getWixBrowserClient().currentCart.removeLineItemsFromCurrentCart([lineId]);
    return toCart(res.cart);
  },

  async getCheckoutUrl() {
    const wix = getWixBrowserClient();
    const { checkoutId } = await wix.currentCart.createCheckoutFromCurrentCart({ channelType: "WEB" });
    if (!checkoutId) return null;
    const origin = window.location.origin;
    const { redirectSession } = await wix.redirects.createRedirectSession({
      ecomCheckout: { checkoutId },
      callbacks: { postFlowUrl: origin, thankYouPageUrl: `${origin}/`, cartPageUrl: `${origin}/cart` },
    });
    return redirectSession?.fullUrl ?? null;
  },
};
