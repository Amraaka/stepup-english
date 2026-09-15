import type { Lesson } from "@/lib/grammar/types";

export const presentPerfect: Lesson = {
  slug: "present-perfect",
  title: "Present Perfect",
  mn: "Одоо төгссөн цаг",
  level: "A2",
  summary: "Өнгөрсөнд болсон ч одоотой холбоотой үйл, туршлагыг хэлнэ.",
  uses: [
    {
      title: "Амьдралын туршлага",
      body: "Хэзээ болсныг хэлэхгүйгээр амьдралдаа хийж үзсэн эсэхийг хэлнэ.",
      examples: [
        { en: "I have been to Japan.", mn: "Би Японд очиж үзсэн." },
        { en: "Have you ever tried sushi?", mn: "Чи суши идэж үзсэн үү?" },
      ],
    },
    {
      title: "Одоо хүртэл үргэлжилж буй байдал",
      body: "Өмнө эхэлж одоо хүртэл үргэлжилж байгааг for, since-тэй хамт хэлнэ.",
      examples: [
        { en: "We have lived here for five years.", mn: "Бид энд таван жил амьдарч байна." },
        { en: "She has worked at this school since 2020.", mn: "Тэр 2020 оноос хойш энэ сургуульд ажиллаж байна." },
      ],
    },
    {
      title: "Одоо чухал байгаа үр дүн",
      body: "Үйл нь дууссан ч үр дүн нь одоо чухал байгааг хэлнэ.",
      examples: [
        { en: "I've lost my phone, so I can't call you.", mn: "Би утсаа гээчихсэн, тиймээс чам руу залгаж чадахгүй." },
        { en: "He has just finished his homework.", mn: "Тэр дөнгөж сая даалгавраа хийж дуусгалаа." },
      ],
    },
  ],
  timeline: {
    marks: [{ type: "arrow", from: -0.7, to: 0, label: "одоо хүртэл" }],
    caption: "Өнгөрсөнтэй холбоотой боловч одоо чухал байгаа үйл",
  },
  form: [
    { label: "Эерэг", pattern: "have / has + V3", example: "She has visited Paris twice." },
    { label: "Үгүйсгэх", pattern: "have / has + not + V3", example: "I haven't finished yet." },
    { label: "Асуух", pattern: "Have / Has + S + V3?", example: "Have you seen my keys?" },
  ],
  signals: ["ever", "never", "already", "yet", "just", "for", "since", "so far", "recently"],
  pitfalls: [
    {
      wrong: "I have seen him yesterday.",
      right: "I saw him yesterday.",
      note: "yesterday, last year гэх мэт тодорхой өнгөрсөн цагтай Present Perfect хэрэглэхгүй.",
    },
    {
      wrong: "I live here since 2018.",
      right: "I have lived here since 2018.",
      note: "since, for-оор одоо хүртэл үргэлжилж байгааг хэлэхэд Present Perfect хэрэглэнэ.",
    },
    {
      wrong: "She have finished.",
      right: "She has finished.",
      note: "he, she, it-тэй has хэрэглэнэ.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "I ___ this film three times.",
      options: ["saw", "have seen", "has seen", "am seeing"],
      answer: "have seen",
      explain: "Хэзээ гэдгийг хэлээгүй, одоо хүртэл хэдэн удаа үзсэнийг хэлж байна.",
    },
    {
      kind: "choice",
      sentence: "We have known each other ___ 2015.",
      options: ["for", "since", "from", "ago"],
      answer: "since",
      explain: "since + эхэлсэн цэг (2015), for + хугацааны урт (ten years).",
    },
    {
      kind: "type",
      sentence: "She ___ her homework yet.",
      hint: "not / finish",
      answers: ["has not finished"],
      explain: "yet нь үгүйсгэлтэй хамт ирнэ: has + not + finished, товчилбол hasn't finished.",
    },
    {
      kind: "choice",
      sentence: "___ you ever been to the Gobi?",
      options: ["Did", "Have", "Has", "Were"],
      answer: "Have",
      explain: "ever-тэй туршлагыг асуухдаа Have you ever + V3.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["I have met her last week.", "I met her last week.", "I have meet her last week."],
      answer: "I met her last week.",
      explain: "last week гэдэг нь тодорхой өнгөрсөн цаг тул Past Simple.",
    },
    {
      kind: "type",
      sentence: "He ___ in this company for ten years.",
      hint: "work",
      answers: ["has worked", "has been working"],
      explain: "for ten years гэдэг нь одоо хүртэл үргэлжилж байгааг заана: has worked.",
    },
    {
      kind: "choice",
      sentence: "Bat ___ just arrived. He's in the kitchen.",
      options: ["has", "have", "did", "is"],
      answer: "has",
      explain: "just нь Present Perfect-тэй хамт ирнэ. Bat гэдэг нь he тул has.",
    },
    {
      kind: "pick",
      prompt: "\"Чи Хөвсгөлд очиж үзсэн үү?\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: ["Have you ever went to Khuvsgul?", "Have you ever been to Khuvsgul?", "Are you ever been to Khuvsgul?"],
      answer: "Have you ever been to Khuvsgul?",
      explain: "Очиж үзсэн туршлагыг have been to гэж хэлнэ.",
    },
  ],
};
