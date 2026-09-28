// Polite fetcher (spec §6.1): allow-listed hosts only, sequential, ≤ 1 request/second.

export const SITE = "https://www.666shoplawnton.com";
const ALLOWED_HOSTS = new Set(["www.666shoplawnton.com", "666shoplawnton.com", "static.wixstatic.com"]);
const USER_AGENT =
  "666-demo-scraper/1.0 (+one-off content snapshot for a site redesign demo; 1 req/s)";
const MIN_INTERVAL_MS = 1000;

let lastRequest = 0;
let queue: Promise<unknown> = Promise.resolve();

async function throttle() {
  const wait = lastRequest + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequest = Date.now();
}

async function doFetch(url: string): Promise<Response> {
  const host = new URL(url).hostname;
  if (!ALLOWED_HOSTS.has(host)) throw new Error(`Refusing to fetch non-allow-listed host: ${host}`);

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    await throttle();
    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow" });
      if (res.ok) return res;
      lastError = new Error(`HTTP ${res.status} for ${url}`);
      if (res.status < 500 && res.status !== 429) break; // Don't retry 4xx.
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

/** Queue requests so they never run concurrently. */
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn);
  queue = next.catch(() => undefined);
  return next;
}

export function fetchText(url: string): Promise<string> {
  return enqueue(async () => (await doFetch(url)).text());
}

export function fetchBuffer(url: string): Promise<Buffer> {
  return enqueue(async () => Buffer.from(await (await doFetch(url)).arrayBuffer()));
}
