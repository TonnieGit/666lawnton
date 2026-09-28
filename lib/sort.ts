import type { SortKey } from "@/lib/data/types";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price (low to high)" },
  { value: "price_desc", label: "Price (high to low)" },
  { value: "name_asc", label: "Name A–Z" },
];

export function readSort(value: unknown): SortKey {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as SortKey) : "newest";
}
