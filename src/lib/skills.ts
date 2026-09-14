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
  tagline: string;
  /** what the module will offer — shown while the page is "coming soon" */
  planned: string[];
};

export const SKILLS: Skill[] = [
  {
    id: "listening",
    href: "/listening",
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
    name: "Унших",
    english: "Reading",
    tone: "mint",
    core: true,
    tagline: "Үг дээр дарж орчуулга харан, түвшиндээ тохирсон эх унш.",
    planned: [
      "Түвшин тус бүрийн богино эх, ном",
      "Үг дээр дарж орчуулах, үгийн сандаа нэмэх",
      "Ойлгосноо шалгах асуултууд",
    ],
  },
  {
    id: "writing",
    href: "/writing",
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
    name: "Ярих",
    english: "Speaking",
    tone: "violet",
    core: true,
    tagline: "Дуудлага, өдөр тутмын ярианы дадлага.",
    planned: [
      "Үг, өгүүлбэр давтаж дуудлага засах",
      "Өөрийн бичлэгийг сонсож харьцуулах",
      "Өдөр тутмын ярианы хэллэгүүд",
    ],
  },
  {
    id: "vocabulary",
    href: "/vocabulary",
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
