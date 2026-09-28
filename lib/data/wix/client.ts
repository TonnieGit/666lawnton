// Phase 2: live Wix Headless client. Not used while DATA_SOURCE=mock.
import { createClient, OAuthStrategy, type Tokens } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { items } from "@wix/data";
import { redirects } from "@wix/redirects";

const modules = { products, collections, currentCart, items, redirects };

function clientId(): string {
  const id = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
  if (!id) throw new Error("NEXT_PUBLIC_WIX_CLIENT_ID is not set (required when DATA_SOURCE=wix)");
  return id;
}

let serverClient: ReturnType<typeof createServerClient> | null = null;

function createServerClient() {
  return createClient({ modules, auth: OAuthStrategy({ clientId: clientId() }) });
}

/** Anonymous visitor client for catalog + CMS reads on the server. */
export function getWixServerClient() {
  serverClient ??= createServerClient();
  return serverClient;
}

const TOKENS_KEY = "666-wix-tokens";
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

function createBrowserClient() {
  let tokens: Tokens | undefined;
  try {
    const raw = window.localStorage.getItem(TOKENS_KEY);
    tokens = raw ? (JSON.parse(raw) as Tokens) : undefined;
  } catch {
    tokens = undefined;
  }
  const client = createClient({ modules, auth: OAuthStrategy({ clientId: clientId(), tokens }) });
  return client;
}

/** Browser client: keeps the visitor's tokens so their Wix cart persists. */
export function getWixBrowserClient() {
  browserClient ??= createBrowserClient();
  return browserClient;
}

export function persistWixTokens() {
  if (!browserClient) return;
  try {
    window.localStorage.setItem(TOKENS_KEY, JSON.stringify(browserClient.auth.getTokens()));
  } catch {
    // ignore
  }
}

/** Wix Stores app ID, used as catalogReference.appId for cart line items. */
export const WIX_STORES_APP_ID = "215238eb-22a5-4c36-9e7b-e7c08025e04e";
