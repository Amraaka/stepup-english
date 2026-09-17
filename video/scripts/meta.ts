// Meta Graph API helpers shared by meta-setup and post.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnv, root } from "./lib.ts";

export const GRAPH_VERSION = "v25.0";
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

type Params = Record<string, string | number | boolean>;

/** Graph API call. Params go in the query string (GET) or a form body (POST). */
export async function graph<T = Record<string, unknown>>(method: "GET" | "POST", endpoint: string, params: Params, token: string): Promise<T> {
  const url = new URL(GRAPH + endpoint);
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...params, access_token: token })) {
    (method === "GET" ? url.searchParams : form).set(k, String(v));
  }
  const res = await fetch(url, method === "GET" ? undefined : { method, body: form });
  const json = (await res.json().catch(() => ({}))) as T & { error?: { message?: string; code?: number } };
  if (!res.ok || json.error) {
    throw new Error(`${method} ${endpoint}: ${json.error?.message ?? `HTTP ${res.status}`}`);
  }
  return json;
}

/** Sends a whole local file to a rupload.facebook.com URL. */
export async function rupload(url: string, token: string, file: string) {
  const data = readFileSync(file);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${token}`,
      offset: "0",
      file_size: String(data.length),
      "Content-Type": "application/octet-stream",
    },
    body: data,
  });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean; error?: { message?: string } };
  if (!res.ok || json.error || json.success === false) {
    throw new Error(`upload failed: ${json.error?.message ?? `HTTP ${res.status}`}`);
  }
}

export type MetaConfig = { pageId: string; igUserId?: string; pageToken: string };

export function metaConfig(): MetaConfig {
  loadEnv();
  const { META_PAGE_ID, META_IG_USER_ID, META_PAGE_TOKEN } = process.env;
  if (!META_PAGE_ID || !META_PAGE_TOKEN) {
    throw new Error("META_PAGE_ID / META_PAGE_TOKEN are missing — run npm run meta-setup first (see README → Posting)");
  }
  return { pageId: META_PAGE_ID, igUserId: META_IG_USER_ID || undefined, pageToken: META_PAGE_TOKEN };
}

/** Sets KEY=value lines in video/.env, replacing existing ones. */
export function writeEnv(values: Record<string, string>) {
  const file = path.join(root, ".env");
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    // no .env yet
  }
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`;
    const re = new RegExp(`^${key}=.*$`, "m");
    text = re.test(text) ? text.replace(re, line) : `${text.replace(/\n?$/, "\n")}${line}\n`;
  }
  writeFileSync(file, text, { mode: 0o600 });
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
