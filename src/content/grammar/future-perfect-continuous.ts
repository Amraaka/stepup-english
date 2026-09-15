import type { Lesson } from "@/lib/grammar/types";

export const futurePerfectContinuous: Lesson = {
  slug: "future-perfect-continuous",
  title: "Future Perfect Continuous",
  mn: "Ирээдүй төгссөн үргэлжлэх цаг",
  level: "C1",
  summary: "Ирээдүйн нэг мөч хүртэл хэр удаан үргэлжилсэн байхыг хэлнэ.",
  uses: [
    {
      title: "Ирээдүйн мөч хүртэлх хугацаа",
      body: "Ирээдүйн тэр мөчид үйл хэр удаан үргэлжилсэн байхыг for-той хамт хэлнэ.",
      examples: [
        { en: "Next year, I will have been teaching for 20 years.", mn: "Ирэх жил гэхэд би 20 жил багшилсан болно." },
        { en: "By 6 p.m., we'll have been driving for ten hours.", mn: "Оройн 6 цаг гэхэд бид арван цаг машин барьсан байна." },
      ],
    },
    {
      title: "Ирээдүйн байдлын шалтгаан",
      body: "Ирээдүйд харагдах байдал яагаад болсныг тайлбарлахад хэрэглэнэ.",
      examples: [
        {
          en: "She'll be tired when she arrives because she'll have been travelling all day.",
          mn: "Өдөржин замд явсан болохоор тэр ирэхдээ ядарсан байна.",
        },
      ],
    },
  ],
  timeline: {
    marks: [
      { type: "span", from: 0, to: 0.65, label: "10 цаг машин барьсан" },
      { type: "dot", at: 0.65, label: "оройн 6" },
    ],
    caption: "Ирээдүйн нэг мөч хүртэл үргэлжилсэн байх үйлийн хугацаа",
  },
  form: [
    { label: "Эерэг", pattern: "will + have + been + V-ing", example: "In June, I'll have been working here for a year." },
    { label: "Үгүйсгэх", pattern: "won't + have + been + V-ing", example: "He won't have been waiting long." },
    { label: "Асуух", pattern: "Will + S + have + been + V-ing?", example: "How long will you have been living here?" },
  ],
  signals: ["for ... by", "by next year", "by the time", "by then", "all day"],
  pitfalls: [
    {
      wrong: "By June, I will be working here for five years.",
      right: "By June, I will have been working here for five years.",
      note: "Ирээдүйн мөч хүртэлх хугацааг for-оор хэлбэл will have been + V-ing.",
    },
    {
      wrong: "By 2030, they will have been knowing each other for 20 years.",
      right: "By 2030, they will have known each other for 20 years.",
      note: "Төлөв заадаг үйл үгтэй Continuous хэрэглэхгүй.",
    },
    {
      wrong: "When he will retire, he will have been working for 40 years.",
      right: "When he retires, he will have been working for 40 years.",
      note: "when-ий дараа ирээдүйг Present Simple-ээр хэлнэ.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "By December, I ___ English for three years.",
      options: ["will study", "will have been studying", "have been studying", "am studying"],
      answer: "will have been studying",
      explain: "12-р сар гэхэд үргэлжилсэн хугацааг хэлж байна.",
    },
    {
      kind: "choice",
      sentence: "By the time you arrive, we ___ for two hours.",
      options: ["will have been waiting", "will wait", "are waiting", "waited"],
      answer: "will have been waiting",
      explain: "Чамайг ирэх хүртэл хоёр цаг үргэлжилсэн байх үйл.",
    },
    {
      kind: "type",
      sentence: "Next month, they ___ married for 25 years.",
      hint: "be",
      answers: ["will have been"],
      explain: "be нь төлөв тул Continuous биш: will have been married.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: [
        "By noon, she will have been cooking for five hours.",
        "By noon, she will be cooking for five hours.",
        "By noon, she will have cooking for five hours.",
      ],
      answer: "By noon, she will have been cooking for five hours.",
      explain: "Үд хүртэлх хугацаа тул will have been + V-ing.",
    },
    {
      kind: "choice",
      sentence: "In 2027, my parents will have been ___ in this house for 30 years.",
      options: ["live", "lived", "living", "lives"],
      answer: "living",
      explain: "have been-ий дараа -ing хэлбэр орно.",
    },
    {
      kind: "type",
      sentence: "He will be exhausted because he ___ all night.",
      hint: "drive",
      answers: ["will have been driving"],
      explain: "Ядрах шалтгаан нь шөнөжин машин барьсан: will have been driving.",
    },
    {
      kind: "choice",
      sentence: "How long ___ you have been working here by next summer?",
      options: ["do", "will", "have", "are"],
      answer: "will",
      explain: "Асуухдаа How long will + S + have been + V-ing?",
    },
    {
      kind: "pick",
      prompt: "\"Ирэх жил гэхэд би энд арван жил ажилласан болно\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: [
        "Next year, I'll have been working here for ten years.",
        "Next year, I'll be working here for ten years.",
        "Next year, I've been working here for ten years.",
      ],
      answer: "Next year, I'll have been working here for ten years.",
      explain: "Ирэх жил хүртэлх хугацаа тул will have been working.",
    },
  ],
};
