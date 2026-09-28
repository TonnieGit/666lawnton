import { createHash } from "node:crypto";

// Fixed namespace so IDs stay stable across re-scrapes (spec §5.1).
const NAMESPACE = "6f3c1b2a-6666-5a6e-9c1d-6c61776e746f";

/** RFC 4122 UUID v5 (SHA-1, name-based). */
export function uuidV5(name: string, namespace = NAMESPACE): string {
  const ns = Buffer.from(namespace.replace(/-/g, ""), "hex");
  const hash = createHash("sha1").update(Buffer.concat([ns, Buffer.from(name, "utf8")])).digest();
  const b = hash.subarray(0, 16);
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = b.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
