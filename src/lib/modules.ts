import type { ActivityModule } from "@/db/schema";

export type ModuleInfo = {
  id: ActivityModule;
  name: string;
  tagline: string;
  status: "active" | "soon";
  /** available without an account */
  guest: boolean;
};

export const MODULES: ModuleInfo[] = [
  { id: "general", name: "Өдрийн бүртгэл", tagline: "Суусан цагаа тэмдэглэж оноо цуглуул", status: "active", guest: true },
  { id: "vocabulary", name: "Үгийн сан", tagline: "Өдөр бүр шинэ үг — давталттай карт", status: "soon", guest: false },
  { id: "grammar", name: "Дүрэм", tagline: "Богино тайлбар, шууд дасгал", status: "soon", guest: false },
  { id: "listening", name: "Сонсгол", tagline: "Түвшин тохирсон яриа, подкаст", status: "soon", guest: false },
  { id: "reading", name: "Унших", tagline: "Дарж орчуулдаг эх зохиол", status: "soon", guest: false },
  { id: "writing", name: "Бичих", tagline: "Монгол тайлбартай AI засвар", status: "soon", guest: false },
  { id: "speaking", name: "Ярих", tagline: "Дуудлагын дадлага", status: "soon", guest: false },
  { id: "books", name: "Ном", tagline: "Түвшин тус бүрийн уншлага", status: "soon", guest: false },
  { id: "games", name: "Тоглоом", tagline: "Үг, дүрмийн жижиг тоглоомууд", status: "soon", guest: false },
  { id: "challenges", name: "Сорил", tagline: "7 хоногийн challenge-ууд", status: "soon", guest: false },
];
