import type { ActivityModule } from "@/db/schema";
import type { Tone } from "@/lib/tones";

/** Skills that get a page, a tone, and a spot on the path. */
export type SkillId = Extract<
  ActivityModule,
  "listening" | "reading" | "writing" | "speaking" | "vocabulary" | "grammar"
>;

export type Skill = {
  id: SkillId;
  href: `/${SkillId}`;
  name: string;
  english: string;
  tone: Tone;
  /** the four core skills — shown in compact rows like the home path preview */
  core: boolean;
  /** the module has working content; otherwise cards say "Тун удахгүй" */
  live: boolean;
  tagline: string;
  /** what the module will offer — shown while the page is "coming soon" */
  planned: string[];
};

export const SKILLS: Skill[] = [
  {
    id: "listening",
    href: "/listening",
    live: true,
    name: "Сонсгол",
    english: "Listening",
    tone: "sky",
    core: true,
    tagline: "Түвшиндээ тохирсон яриа, подкаст сонсож чихээ дасга.",
    planned: [
      "Богино аудио — текст, Монгол орчуулгатай",
      "Удаашруулж, давтаж сонсох",
      "Ойлгосноо шалгах богино асуултууд",
    ],
  },
  {
    id: "reading",
    href: "/reading",
    live: true,
    name: "Унших",
    english: "Reading",
    tone: "mint",
    core: true,
    tagline: "Үг дээр дарж орчуулга харан, түвшиндээ тохирсон эх унш.",
    // Texts with tap-to-translate and questions shipped (ADR 0017); these are still to come.
    planned: [
      "Шинэ, хадгалсан, мэддэг үгсийг өнгөөр ялгах",
      "A1–A2 эхэд Монгол орчуулга",
      "Илүү олон эх, ном",
    ],
  },
  {
    id: "writing",
    href: "/writing",
    live: false,
    name: "Бичих",
    english: "Writing",
    tone: "sun",
    core: true,
    tagline: "Бичвэрээ илгээж, Монгол тайлбартай засвар ав.",
    planned: [
      "Өдрийн сэдэвтэй богино бичлэг",
      "AI засвар — алдааг Монголоор тайлбарлана",
      "Өмнөх бичвэртэйгээ харьцуулж ахицаа харах",
    ],
  },
  {
    id: "speaking",
    href: "/speaking",
    live: true,
    name: "Ярих",
    english: "Speaking",
    tone: "violet",
    core: true,
    tagline: "Дуудлага, өдөр тутмын ярианы дадлага.",
    // Shadowing with record-and-compare shipped (ADR 0011); these are still to come.
    planned: [
      "Өдөр тутмын ярианы хэллэгүүд — сонсож, дагаж хэлэх",
      "th, w/v, r/l зэрэг хэцүү авианы дасгал",
    ],
  },
  {
    id: "vocabulary",
    href: "/vocabulary",
    live: true,
    name: "Үгийн сан",
    english: "Vocabulary",
    tone: "teal",
    core: false,
    tagline: "Өдөр бүр шинэ үг — мартах гэж байхад нь давтаж цээжил.",
    planned: [
      "Түвшин, сэдвээр ангилсан үгийн жагсаалт",
      "Давталттай карт — үгийг мартах үед нь дахин харуулна",
      "Үг бүрт жишээ өгүүлбэр, дуудлага, Монгол орчуулга",
    ],
  },
  {
    id: "grammar",
    href: "/grammar",
    live: true,
    name: "Дүрэм",
    english: "Grammar",
    tone: "rose",
    core: false,
    tagline: "Богино тайлбар, шууд дасгал — Монголоор ойлгомжтой.",
    planned: [
      "Дүрэм бүрийг Монголоор богино, жишээтэй тайлбарлана",
      "Тайлбарын дараа шууд дасгал, алдаагаа тайлбартай харна",
      "30 өдрийн дүрмийн сорил",
    ],
  },
];

export const CORE_SKILLS = SKILLS.filter((s) => s.core);

export function getSkill(id: SkillId): Skill {
  return SKILLS.find((s) => s.id === id)!;
}
