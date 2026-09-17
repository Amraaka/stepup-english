// Turns a short-lived user token from Graph API Explorer into a non-expiring Page token,
// finds the Page and its linked Instagram account, and saves all three to .env.
//
//   put META_APP_ID, META_APP_SECRET, META_USER_TOKEN in .env, then:
//   npm run meta-setup [-- --page="Page name or id"]
//
// Tokens are never printed.
import { loadEnv } from "./lib.ts";
import { graph, writeEnv } from "./meta.ts";

loadEnv();
const { META_APP_ID, META_APP_SECRET, META_USER_TOKEN } = process.env;
const pageArg = process.argv.find((a) => a.startsWith("--page="))?.slice(7);

const missing = Object.entries({ META_APP_ID, META_APP_SECRET, META_USER_TOKEN })
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(`missing in .env: ${missing.join(", ")} — see README → Posting`);
  process.exit(1);
}

try {
  // 1. short-lived user token → long-lived (≈60 days). Page tokens made from it don't expire.
  const long = await graph<{ access_token: string }>(
    "GET",
    "/oauth/access_token",
    { grant_type: "fb_exchange_token", client_id: META_APP_ID!, client_secret: META_APP_SECRET!, fb_exchange_token: META_USER_TOKEN! },
    META_USER_TOKEN!,
  );

  // 2. the Pages this user manages, with their Instagram accounts
  type Page = { id: string; name: string; access_token: string; instagram_business_account?: { id: string } };
  const { data: pages } = await graph<{ data: Page[] }>(
    "GET",
    "/me/accounts",
    { fields: "id,name,access_token,instagram_business_account" },
    long.access_token,
  );
  if (!pages.length) throw new Error("this user manages no Facebook Pages (check pages_show_list was granted)");

  const page = pageArg ? pages.find((p) => p.id === pageArg || p.name === pageArg) : pages.length === 1 ? pages[0] : undefined;
  if (!page) {
    console.log("Pick a Page and run again with --page=\"…\":");
    for (const p of pages) console.log(`  ${p.id}  ${p.name}${p.instagram_business_account ? "  (Instagram linked)" : ""}`);
    process.exit(1);
  }

  // 3. confirm what we can see
  const ig = page.instagram_business_account?.id;
  const igName = ig ? (await graph<{ username: string }>("GET", `/${ig}`, { fields: "username" }, page.access_token)).username : undefined;

  writeEnv({ META_PAGE_ID: page.id, META_PAGE_TOKEN: page.access_token, META_IG_USER_ID: ig ?? "" });

  console.log(`Facebook Page : ${page.name} (${page.id})`);
  console.log(ig ? `Instagram     : @${igName} (${ig})` : "Instagram     : not linked to this Page — link it in Business Suite, then run again");
  console.log("saved META_PAGE_ID, META_PAGE_TOKEN, META_IG_USER_ID to .env");
  console.log("You can now delete META_USER_TOKEN from .env; it expires in about an hour anyway.");
} catch (e) {
  console.error((e as Error).message);
  process.exit(1);
}
