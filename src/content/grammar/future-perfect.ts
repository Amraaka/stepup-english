import type { Lesson } from "@/lib/grammar/types";

export const futurePerfect: Lesson = {
  slug: "future-perfect",
  title: "Future Perfect",
  mn: "Ирээдүй төгссөн цаг",
  level: "B2",
  summary: "Ирээдүйн нэг мөчөөс өмнө дуусчихсан байх үйлийг хэлнэ.",
  uses: [
    {
      title: "Ирээдүйн мөчөөс өмнө дуусах үйл",
      body: "\"...гэхэд дуусчихсан байна\" гэдгийг by-тай хамт хэлнэ.",
      examples: [
        { en: "I will have finished the report by Friday.", mn: "Би Баасан гараг гэхэд тайлангаа дуусгачихсан байна." },
        { en: "By 2030, she will have graduated.", mn: "2030 он гэхэд тэр сургуулиа төгсчихсөн байна." },
      ],
    },
    {
      title: "Тэр мөч хүртэлх хугацаа, тоо",
      body: "Ирээдүйн тэр мөчид хэр удаан, хэдэн удаа болсон байхыг хэлнэ.",
      examples: [
        { en: "Next month, we will have lived here for ten years.", mn: "Ирэх сард бид энд арван жил амьдарсан болно." },
        { en: "By the end of the day, I'll have walked 15,000 steps.", mn: "Өдрийн эцэс гэхэд би 15,000 алхам алхчихсан байна." },
      ],
    },
    {
      title: "Одоо болчихсон байх гэж таамаглах",
      body: "Ямар нэг зүйл одоо болчихсон байх гэж итгэлтэй таамаглахад хэрэглэнэ.",
      examples: [{ en: "It's 6 p.m. Dad will have left the office.", mn: "Оройн 6 болж байна. Аав ажлаасаа гарчихсан байх." }],
    },
  ],
  timeline: {
    marks: [
      { type: "arrow", from: 0.05, to: 0.55, label: "дуусчихсан байна" },
      { type: "dot", at: 0.7, label: "by Friday" },
    ],
    caption: "Ирээдүйн нэг мөчөөс өмнө дуусчихсан байх үйл",
  },
  form: [
    { label: "Эерэг", pattern: "will + have + V3", example: "They will have arrived by noon." },
    { label: "Үгүйсгэх", pattern: "won't + have + V3", example: "I won't have finished by then." },
    { label: "Асуух", pattern: "Will + S + have + V3?", example: "Will you have left by 8?" },
  ],
  signals: ["by Friday", "by then", "by the time", "by the end of", "by now"],
  pitfalls: [
    {
      wrong: "By next year, I will have save enough money.",
      right: "By next year, I will have saved enough money.",
      note: "have-ийн дараа үйл үгийн 3-р хэлбэр орно.",
    },
    {
      wrong: "I will have finished until Friday.",
      right: "I will have finished by Friday.",
      note: "\"...гэхэд\" гэдгийг by-гаар хэлнэ. until нь \"хүртэл үргэлжлэх\" гэсэн утгатай.",
    },
    {
      wrong: "By the time you will arrive, we will have eaten.",
      right: "By the time you arrive, we will have eaten.",
      note: "by the time-ийн дараа Present Simple хэрэглэнэ.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "By the time you wake up, I ___ the house.",
      options: ["will have left", "have left", "leave", "had left"],
      answer: "will have left",
      explain: "Чамайг сэрэхээс өмнө гарчихсан байна: will have left.",
    },
    {
      kind: "choice",
      sentence: "We will have lived in this flat for five years ___ next June.",
      options: ["until", "by", "since", "for"],
      answer: "by",
      explain: "\"Ирэх 6-р сар гэхэд\" гэдгийг by next June гэнэ.",
    },
    {
      kind: "type",
      sentence: "By the end of this year, she ___ 20 countries.",
      hint: "visit",
      answers: ["will have visited"],
      explain: "Он дуусахад хэдэн оронд очсон байхыг хэлж байна: will have visited.",
    },
    {
      kind: "choice",
      sentence: "___ you have finished the project by Monday?",
      options: ["Do", "Will", "Have", "Are"],
      answer: "Will",
      explain: "Асуухдаа Will + S + have + V3?",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: [
        "By the time we will get there, the film will have started.",
        "By the time we get there, the film will have started.",
        "By the time we get there, the film will have start.",
      ],
      answer: "By the time we get there, the film will have started.",
      explain: "by the time-ийн дараа Present Simple, have-ийн дараа 3-р хэлбэр.",
    },
    {
      kind: "type",
      sentence: "The shops close at 9. They ___ by the time we arrive at 10.",
      hint: "close",
      answers: ["will have closed"],
      explain: "Биднийг очихоос өмнө хаачихсан байна: will have closed.",
    },
    {
      kind: "choice",
      sentence: "It's 7 o'clock. The guests ___ by now.",
      options: ["will have arrived", "will arrive", "arrive", "are arrive"],
      answer: "will have arrived",
      explain: "by now гэж одоо ирчихсэн байх гэж таамаглаж байна.",
    },
    {
      kind: "pick",
      prompt: "\"Ирэх сар гэхэд би 100 ном уншчихсан байна\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: [
        "By next month, I will read 100 books.",
        "By next month, I will have read 100 books.",
        "By next month, I have read 100 books.",
      ],
      answer: "By next month, I will have read 100 books.",
      explain: "Ирээдүйн мөчөөс өмнө дуусчихсан байх тул will have read.",
    },
  ],
};
