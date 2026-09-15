import type { Lesson } from "@/lib/grammar/types";

export const futureContinuous: Lesson = {
  slug: "future-continuous",
  title: "Future Continuous",
  mn: "Ирээдүй үргэлжлэх цаг",
  level: "B2",
  summary: "Ирээдүйн тодорхой мөчид үргэлжилж байх үйлийг хэлнэ.",
  uses: [
    {
      title: "Ирээдүйн мөчид үргэлжилж байх үйл",
      body: "\"Маргааш энэ үед юу хийж байх вэ?\" гэх мэт ирээдүйн мөчид үргэлжилж байх үйлийг хэлнэ.",
      examples: [
        { en: "This time tomorrow, I'll be flying to Seoul.", mn: "Маргааш энэ үед би Сөүл рүү нисч явж байна." },
        { en: "At 8 p.m., we'll be having dinner.", mn: "Оройн 8 цагт бид оройн хоол идэж байх болно." },
      ],
    },
    {
      title: "Ердийн жамаараа болох үйл",
      body: "Тусгайлан төлөвлөөгүй ч ердийн байдлаараа болох зүйлийг хэлнэ.",
      examples: [
        {
          en: "I'll be seeing Saraa at work tomorrow, so I can give it to her.",
          mn: "Би маргааш ажил дээрээ Сараатай уулзана, тэгэхээр түүнд өгч болно.",
        },
      ],
    },
    {
      title: "Эелдгээр асуух",
      body: "Хэн нэгний төлөвлөгөөг эелдгээр асуухад хэрэглэнэ.",
      examples: [{ en: "Will you be using the car tonight?", mn: "Та өнөө орой машинаа хэрэглэх үү?" }],
    },
  ],
  timeline: {
    marks: [
      { type: "span", from: 0.35, to: 0.85, label: "нисч явна" },
      { type: "dot", at: 0.6, label: "маргааш энэ үед" },
    ],
    caption: "Ирээдүйн нэг мөчид үргэлжилж байх үйл",
  },
  form: [
    { label: "Эерэг", pattern: "will + be + V-ing", example: "I'll be working late tonight." },
    { label: "Үгүйсгэх", pattern: "won't + be + V-ing", example: "She won't be coming to the meeting." },
    { label: "Асуух", pattern: "Will + S + be + V-ing?", example: "Will you be staying at home?" },
  ],
  signals: ["this time tomorrow", "at 10 o'clock tomorrow", "tonight", "all day tomorrow", "when you arrive"],
  pitfalls: [
    {
      wrong: "This time tomorrow, I will lie on the beach.",
      right: "This time tomorrow, I will be lying on the beach.",
      note: "Ирээдүйн тэр мөчид үргэлжилж байх үйл тул will be + V-ing.",
    },
    {
      wrong: "At 9 tomorrow, I will working.",
      right: "At 9 tomorrow, I will be working.",
      note: "will-ийн дараа be заавал байна.",
    },
    {
      wrong: "When you will arrive, I'll be waiting.",
      right: "When you arrive, I'll be waiting.",
      note: "when, after, before-ийн дараа ирээдүйг Present Simple-ээр хэлнэ.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "Don't call me at 9. I ___ my exam then.",
      options: ["will be taking", "will taking", "am take", "took"],
      answer: "will be taking",
      explain: "9 цагт шалгалт өгч байх үргэлжлэх үйл: will be taking.",
    },
    {
      kind: "choice",
      sentence: "This time next week, we ___ on the beach.",
      options: ["will lie", "will be lying", "are lie", "lie"],
      answer: "will be lying",
      explain: "this time next week гэдэг нь ирээдүйн тодорхой мөч.",
    },
    {
      kind: "type",
      sentence: "At midnight, I ___.",
      hint: "sleep",
      answers: ["will be sleeping"],
      explain: "Шөнийн 12 цагт үргэлжилж байх үйл: will be sleeping.",
    },
    {
      kind: "choice",
      sentence: "___ you be using your laptop this afternoon?",
      options: ["Are", "Will", "Do", "Have"],
      answer: "Will",
      explain: "Эелдгээр асуухдаа Will you be + V-ing?",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["When you will get home, I'll be cooking.", "When you get home, I'll be cooking.", "When you get home, I'll cooking."],
      answer: "When you get home, I'll be cooking.",
      explain: "when-ий дараа Present Simple, үндсэн өгүүлбэрт will be + V-ing.",
    },
    {
      kind: "type",
      sentence: "She ___ to the party because she is working late.",
      hint: "not / come",
      answers: ["will not be coming"],
      explain: "will + not + be + coming, товчилбол won't be coming.",
    },
    {
      kind: "choice",
      sentence: "From 10 to 12 tomorrow, the students ___ their final test.",
      options: ["will be writing", "will writing", "are write", "wrote"],
      answer: "will be writing",
      explain: "10-аас 12 цагийн хооронд үргэлжилж байх үйл.",
    },
    {
      kind: "pick",
      prompt: "\"Маргааш энэ үед би Токио руу нисч явж байна\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: [
        "This time tomorrow, I'll fly to Tokyo.",
        "This time tomorrow, I'll be flying to Tokyo.",
        "This time tomorrow, I'm fly to Tokyo.",
      ],
      answer: "This time tomorrow, I'll be flying to Tokyo.",
      explain: "Маргааш энэ мөчид үргэлжилж байх үйл тул will be flying.",
    },
  ],
};
