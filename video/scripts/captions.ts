// Writes a Mongolian caption for each video to captions/<slug>.txt — only where none
// exists, so edited captions are never overwritten. Also (re)builds posts/queue.txt.
//
//   npm run captions            captions for every rendered video + queue if missing
//   npm run captions -- --queue rebuild the posting order
//
// Voice follows the stepup-mongolian-copy skill: чи, one paragraph, one ask that matches
// the video's end card, at most two emoji, hashtags last.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { FormatName, Quiz } from "../src/types.ts";
import { allSlugs, loadQuiz, root } from "./lib.ts";

const captionsDir = path.join(root, "captions");
const queueFile = path.join(root, "posts", "queue.txt");
export const captionPath = (slug: string) => path.join(captionsDir, `${slug}.txt`);

// Must match the end card (src/EndCard.tsx)
const ASK = "Хэдийг нь зөв таасан бэ? Хариултаа коммент хэсэгт үлдээгээрэй 👇";
const TAGS = "#англихэл #англихэлсурах #englishquiz #stepupenglish";

const q = (s: string) => `"${s}"`;

// Demo quizzes use the format name as their topic; saying it again adds nothing.
const GENERIC = new Set(["Эсрэг утга", "Илүүц үг", "Үг таах", "Ярианы хэллэг", "Хоёр дуудлага", "Угтвар үг"]);
const topicLine = (z: Quiz) => (GENERIC.has(z.topic) ? [] : [`Энэ удаагийн сэдэв: ${z.topic.toLowerCase()}.`]);

const BODY: Record<FormatName, (quiz: Quiz) => string[]> = {
  picture: (z) => [
    "Өдөр бүр хардаг ч нэрийг нь англиар хэлж чаддаггүй зүйл олон бий шүү.",
    ...topicLine(z),
    "Зургийг хараад англиар юу гэдгийг нь таагаарай.",
  ],
  "fix-mistake": (z) => [
    `${q(z.items[0].wrong ?? "")} гэж хэлдэг үү? 😅`,
    "Монголоор бодоод шууд орчуулчихдаг болохоор ийм алдаа их гардаг.",
    `Зөв нь ${q(z.items[0].en)}${/[.!?]$/.test(z.items[0].en) ? "" : "."} Видеонд ийм түгээмэл алдаа дахиад ${z.items.length - 1} бий.`,
  ],
  "gap-fill": (z) => [
    `${q(z.items[0].sentence ?? "")} энэ өгүүлбэрт аль үг орох вэ?`,
    "Жижигхэн үг ч гэсэн өгүүлбэрийн утгыг бүхэлд нь өөрчилдөг шүү.",
    `Видеог үзээд ${z.items.length} өгүүлбэрийг бүгдийг нь нөхөөд үзээрэй.`,
  ],
  "silent-letter": (z) => [
    `${z.items[0].en.toUpperCase()} гэдэг үгийн аль үсэг нь дуудагдахгүй вэ?`,
    "Монголоор үсэг бүрийг дууддаг болохоор англи үгэнд бичигддэг ч дуудагддаггүй үсэг байдгийг мартчихдаг.",
    `Видеонд ийм ${z.items.length} үг байна.`,
  ],
  "word-stress": (z) => [
    `${z.items[0].en} гэдэг үгийн өргөлт хаана байдаг вэ?`,
    "Монгол хэлэнд өргөлт үргэлж эхний үе дээр байдаг болохоор англи үгийг ч ингэж дуудчихдаг.",
    "Өргөлт буруу бол зөв үгийг ч ойлгохгүй байх нь бий шүү.",
  ],
  opposites: (z) => [
    `${q(z.items[0].prompt ?? "")} гэдэг үгийн эсрэг үг юу вэ?`,
    "Үгийг эсрэг утгатай нь хамт цээжилбэл илүү хурдан тогтдог.",
    ...topicLine(z),
  ],
  "odd-one-out": (z) => [
    `${(z.items[0].options ?? []).join(", ")}. Эдгээрээс аль нь илүүц вэ? 👀`,
    "Үгсийг бүлэглэж цээжилбэл илүү амархан тогтдог.",
    ...topicLine(z),
  ],
  "sound-pair": (z) => [
    `${(z.items[0].options ?? []).join(" ба ")} хоёрыг чихээрээ ялгаж чадах уу? 🎧`,
    "Монгол хэлэнд ийм ялгаа байдаггүй болохоор чих дасах хүртэл хэцүү санагддаг.",
    "Дууг нь сонсоод аль үгийг хэлснийг таагаарай.",
  ],
  unscramble: (z) => [
    "Холилдсон үсгүүдээс ямар үг гарах вэ?",
    "Үгийг таньдаг ч зөв бичиж чаддаггүй нь их тохиолддог шүү.",
    ...topicLine(z),
  ],
  "where-is-it": () => [
    "Бөмбөг хаана байгааг англиар хэлж чадах уу?",
    "Монголоор дээр, доор гэдгийг үгийн ард хэлдэг бол англиар on, under гэж урд нь хэлдэг.",
    "Зургийг хараад зөв үгийг нь сонгоорой.",
  ],
  "mini-dialogue": (z) => [
    `Хэн нэгэн ${q(z.items[0].prompt ?? "")} гэвэл юу гэж хариулах вэ? 😅`,
    "Үгээ мэддэг ч яг тэр мөчид юу хэлэхээ мэдэхгүй гацах нь их.",
    ...topicLine(z),
  ],
};

const EXTRA_TAG: Record<FormatName, string> = {
  picture: "#англиүг",
  "fix-mistake": "#түгээмэлалдаа",
  "gap-fill": "#англидүрэм",
  "silent-letter": "#дуудлага",
  "word-stress": "#дуудлага",
  opposites: "#англиүг",
  "odd-one-out": "#англиүг",
  "sound-pair": "#дуудлага",
  unscramble: "#англиүг",
  "where-is-it": "#англидүрэм",
  "mini-dialogue": "#ярианыангли",
};

export function makeCaption(quiz: Quiz): string {
  const format = quiz.format ?? "picture";
  return `${[...BODY[format](quiz), ASK].join(" ")}\n\n${TAGS} ${EXTRA_TAG[format]}\n`;
}

const rendered = (slug: string) => existsSync(path.join(root, "out", `${slug}.mp4`));

/** Posting order: take one video from each format in turn, so the feed keeps changing. */
function buildQueue(slugs: string[]): string[] {
  const byFormat = new Map<string, string[]>();
  for (const s of slugs) {
    const f = loadQuiz(s).format ?? "picture";
    byFormat.set(f, [...(byFormat.get(f) ?? []), s]);
  }
  // strongest first: the formats that ask for a comment most naturally
  const order = ["fix-mistake", "odd-one-out", "sound-pair", "gap-fill", "opposites", "mini-dialogue", "picture", "silent-letter", "unscramble", "word-stress", "where-is-it"];
  const lanes = order.map((f) => byFormat.get(f) ?? []);
  const out: string[] = [];
  while (lanes.some((l) => l.length)) for (const lane of lanes) if (lane.length) out.push(lane.shift()!);
  return out;
}

const slugs = allSlugs().filter(rendered);
mkdirSync(captionsDir, { recursive: true });
let written = 0;
for (const s of slugs) {
  if (existsSync(captionPath(s))) continue;
  writeFileSync(captionPath(s), makeCaption(loadQuiz(s)));
  written++;
}
console.log(`captions: ${written} written, ${slugs.length - written} already there (captions/)`);

if (process.argv.includes("--queue") || !existsSync(queueFile)) {
  mkdirSync(path.dirname(queueFile), { recursive: true });
  writeFileSync(queueFile, buildQueue(slugs).join("\n") + "\n");
  console.log(`queue: ${slugs.length} videos → posts/queue.txt`);
} else {
  const inQueue = new Set(readFileSync(queueFile, "utf8").split("\n").filter(Boolean));
  const missing = slugs.filter((s) => !inQueue.has(s));
  if (missing.length) console.log(`queue: ${missing.length} rendered video(s) not in posts/queue.txt — add them, or rebuild with -- --queue`);
}
