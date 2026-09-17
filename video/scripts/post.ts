// Publishes rendered videos as Reels to Instagram and the Facebook Page.
//
//   npm run post -- <slug...>          dry run: shows what would be posted
//   npm run post -- --next=4           dry run for the next 4 in posts/queue.txt
//   npm run post -- --next=4 --yes     actually publish
//   add --ig or --fb to post to only one of them
//
// Every success is written to posts/log.json right away, so nothing is posted twice
// and an interrupted run can simply be repeated.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { GRAPH_VERSION, graph, metaConfig, rupload, sleep } from "./meta.ts";
import { root } from "./lib.ts";

type Platform = "ig" | "fb";
type Entry = { id: string; at: string; url?: string };
type Log = Record<string, Partial<Record<Platform, Entry>>>;

const logFile = path.join(root, "posts", "log.json");
const queueFile = path.join(root, "posts", "queue.txt");
const video = (slug: string) => path.join(root, "out", `${slug}.mp4`);
const caption = (slug: string) => path.join(root, "captions", `${slug}.txt`);

// Meta's limits per 24-hour moving window, minus a little headroom
const DAILY_LIMIT: Record<Platform, number> = { ig: 95, fb: 28 };

const readLog = (): Log => (existsSync(logFile) ? JSON.parse(readFileSync(logFile, "utf8")) : {});
const saveLog = (log: Log) => {
  mkdirSync(path.dirname(logFile), { recursive: true });
  writeFileSync(logFile, JSON.stringify(log, null, 2) + "\n");
};

const argv = process.argv.slice(2);
const live = argv.includes("--yes");
const next = Number(argv.find((a) => a.startsWith("--next="))?.slice(7) ?? 0);
const onlyIg = argv.includes("--ig");
const onlyFb = argv.includes("--fb");
const platforms: Platform[] = onlyIg && !onlyFb ? ["ig"] : onlyFb && !onlyIg ? ["fb"] : ["ig", "fb"];
const named = argv.filter((a) => !a.startsWith("--"));

const log = readLog();
const needs = (slug: string) => platforms.filter((p) => !log[slug]?.[p]);

let slugs: string[];
if (next > 0) {
  if (!existsSync(queueFile)) {
    console.error("posts/queue.txt is missing — run npm run captions first");
    process.exit(1);
  }
  slugs = readFileSync(queueFile, "utf8").split("\n").filter(Boolean).filter((s) => needs(s).length).slice(0, next);
} else {
  slugs = named;
}
if (!slugs.length) {
  console.log(next ? "nothing left to post in the queue" : "usage: npm run post -- <slug...> | --next=N   [--yes] [--ig|--fb]");
  process.exit(next ? 0 : 1);
}

// ---- checks that need no network ----
let problems = 0;
for (const s of slugs) {
  const issues: string[] = [];
  if (!existsSync(video(s))) issues.push("no video in out/");
  else if (statSync(video(s)).size < 100_000) issues.push("video file looks broken");
  const text = existsSync(caption(s)) ? readFileSync(caption(s), "utf8").trim() : "";
  if (!text) issues.push("no caption — run npm run captions");
  if (text.length > 2200) issues.push(`caption is ${text.length} characters (Instagram allows 2200)`);
  if ((text.match(/#/g) ?? []).length > 30) issues.push("more than 30 hashtags");
  if (issues.length) {
    problems++;
    console.log(`✗ ${s}: ${issues.join("; ")}`);
  }
}
if (problems) process.exit(1);

const since = Date.now() - 24 * 3600 * 1000;
for (const p of platforms) {
  const recent = Object.values(log).filter((e) => e[p] && Date.parse(e[p]!.at) > since).length;
  const planned = slugs.filter((s) => needs(s).includes(p)).length;
  if (recent + planned > DAILY_LIMIT[p]) {
    console.error(`${p}: ${recent} posted in the last 24h + ${planned} planned would pass Meta's limit (${DAILY_LIMIT[p]}). Post fewer.`);
    process.exit(1);
  }
}

// ---- dry run ----
if (!live) {
  console.log(`DRY RUN — nothing is published. Add --yes to post.\n`);
  for (const s of slugs) {
    const text = readFileSync(caption(s), "utf8").trim();
    console.log(`• ${s}  → ${needs(s).join(" + ")}  (${(statSync(video(s)).size / 1048576).toFixed(1)} MB)`);
    console.log(`  ${text.replace(/\n+/g, "\n  ")}\n`);
  }
  process.exit(0);
}

// ---- publishing ----
const cfg = metaConfig();
if (platforms.includes("ig") && !cfg.igUserId) {
  console.error("META_IG_USER_ID is empty — link Instagram to the Page and run npm run meta-setup again, or use --fb");
  process.exit(1);
}

async function postInstagram(file: string, text: string): Promise<Entry> {
  const { id } = await graph<{ id: string }>(
    "POST",
    `/${cfg.igUserId}/media`,
    { media_type: "REELS", upload_type: "resumable", caption: text, share_to_feed: true },
    cfg.pageToken,
  );
  await rupload(`https://rupload.facebook.com/ig-api-upload/${GRAPH_VERSION}/${id}`, cfg.pageToken, file);

  // Meta asks for at most one status check a minute, for up to 5 minutes
  for (let i = 0; ; i++) {
    await sleep(i === 0 ? 20_000 : 60_000);
    const { status_code, status } = await graph<{ status_code: string; status?: string }>("GET", `/${id}`, { fields: "status_code,status" }, cfg.pageToken);
    if (status_code === "FINISHED") break;
    if (status_code === "ERROR" || status_code === "EXPIRED") throw new Error(`Instagram could not process the video: ${status ?? status_code}`);
    if (i >= 5) throw new Error("Instagram is still processing after 5 minutes — try again later");
  }

  const media = await graph<{ id: string }>("POST", `/${cfg.igUserId}/media_publish`, { creation_id: id }, cfg.pageToken);
  const { permalink } = await graph<{ permalink?: string }>("GET", `/${media.id}`, { fields: "permalink" }, cfg.pageToken).catch(() => ({ permalink: undefined }));
  return { id: media.id, at: new Date().toISOString(), url: permalink };
}

async function postFacebook(file: string, text: string): Promise<Entry> {
  const start = await graph<{ video_id: string; upload_url: string }>("POST", `/${cfg.pageId}/video_reels`, { upload_phase: "start" }, cfg.pageToken);
  await rupload(start.upload_url, cfg.pageToken, file);
  await graph("POST", `/${cfg.pageId}/video_reels`, { upload_phase: "finish", video_id: start.video_id, video_state: "PUBLISHED", description: text }, cfg.pageToken);
  return { id: start.video_id, at: new Date().toISOString(), url: `https://www.facebook.com/reel/${start.video_id}` };
}

let failed = 0;
for (const s of slugs) {
  const text = readFileSync(caption(s), "utf8").trim();
  for (const p of needs(s)) {
    process.stdout.write(`${p === "ig" ? "Instagram" : "Facebook "}  ${s} … `);
    try {
      const entry = await (p === "ig" ? postInstagram : postFacebook)(video(s), text);
      log[s] = { ...log[s], [p]: entry };
      saveLog(log);
      console.log(`posted ${entry.url ?? entry.id}`);
    } catch (e) {
      failed++;
      console.log(`FAILED — ${(e as Error).message}`);
    }
  }
}
if (failed) process.exit(1);
