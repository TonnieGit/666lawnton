const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

export function formatPrice(amount: number, currency = "AUD"): string {
  if (currency === "AUD") return aud.format(amount);
  return new Intl.NumberFormat("en-AU", { style: "currency", currency }).format(amount);
}

/** "$1,119.00" → 1119 */
export function parsePrice(text: string): number {
  const n = Number(text.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
