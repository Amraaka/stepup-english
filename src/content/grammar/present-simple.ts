import type { Lesson } from "@/lib/grammar/types";

export const presentSimple: Lesson = {
  slug: "present-simple",
  title: "Present Simple",
  mn: "Одоо энгийн цаг",
  level: "A1",
  summary: "Байнга давтагддаг үйл, дадал, үнэн баримтыг хэлэхэд хэрэглэнэ.",
  uses: [
    {
      title: "Дадал, давтагддаг үйл",
      body: "Өдөр бүр, долоо хоног бүр гэх мэт байнга давтагддаг үйлийг хэлнэ.",
      examples: [
        { en: "I drink coffee every morning.", mn: "Би өглөө бүр кофе уудаг." },
        { en: "She goes to the gym on Mondays.", mn: "Тэр Даваа гараг бүр фитнесс явдаг." },
      ],
    },
    {
      title: "Үнэн баримт",
      body: "Үргэлж үнэн байдаг, өөрчлөгддөггүй зүйлийг хэлнэ.",
      examples: [
        { en: "Water boils at 100 degrees.", mn: "Ус 100 градуст буцалдаг." },
        { en: "Ulaanbaatar is the capital of Mongolia.", mn: "Улаанбаатар бол Монголын нийслэл." },
      ],
    },
    {
      title: "Цагийн хуваарь",
      body: "Автобус, хичээл, кино гэх мэт тогтсон хуваарьтай зүйлийг ирээдүйд болох байсан ч энэ цагаар хэлнэ.",
      examples: [{ en: "The bus leaves at 7:30.", mn: "Автобус 7:30-д хөдөлнө." }],
    },
  ],
  timeline: {
    marks: [{ type: "dots", from: -0.8, to: 0.8, label: "өдөр бүр" }],
    caption: "Өнгөрсөн, одоо, ирээдүйд ч давтагддаг үйл",
  },
  form: [
    { label: "Эерэг", pattern: "I / you / we / they + V · he / she / it + V-s", example: "He works in a bank." },
    { label: "Үгүйсгэх", pattern: "do / does + not + V", example: "She doesn't eat meat." },
    { label: "Асуух", pattern: "Do / Does + S + V?", example: "Do you speak English?" },
  ],
  signals: ["every day", "usually", "often", "sometimes", "always", "never", "on Mondays", "once a week"],
  pitfalls: [
    {
      wrong: "He go to work by bus.",
      right: "He goes to work by bus.",
      note: "he, she, it-ийн дараа үйл үгэнд -s эсвэл -es нэмнэ.",
    },
    {
      wrong: "I am work in a hospital.",
      right: "I work in a hospital.",
      note: "Энгийн цагт am, is, are хэрэггүй. \"Би ажилладаг\" гэхэд ганц үйл үг байдагтай адил.",
    },
    {
      wrong: "Does she likes tea?",
      right: "Does she like tea?",
      note: "does байвал үйл үг -s-гүй, үндсэн хэлбэрээрээ байна.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "My brother ___ in Darkhan.",
      options: ["live", "lives", "living", "is live"],
      answer: "lives",
      explain: "My brother гэдэг нь he, тиймээс үйл үгэнд -s нэмнэ.",
    },
    {
      kind: "choice",
      sentence: "We ___ TV in the morning.",
      options: ["don't watch", "doesn't watch", "not watch", "aren't watch"],
      answer: "don't watch",
      explain: "we-тэй үгүйсгэхдээ don't хэрэглэнэ.",
    },
    {
      kind: "type",
      sentence: "She ___ English every evening.",
      hint: "study",
      answers: ["studies"],
      explain: "Гийгүүлэгч + y-ээр төгссөн үйл үгэнд y нь ies болно: study → studies.",
    },
    {
      kind: "choice",
      sentence: "___ your father work on Saturdays?",
      options: ["Do", "Does", "Is", "Are"],
      answer: "Does",
      explain: "your father гэдэг нь he, тиймээс асуухдаа Does хэрэглэнэ.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["He watch football every weekend.", "He watches football every weekend.", "He is watch football every weekend."],
      answer: "He watches football every weekend.",
      explain: "he-гийн дараа watch нь watches болно. ch-ээр төгссөн тул -es нэмдэг.",
    },
    {
      kind: "type",
      sentence: "The shop ___ at 9 a.m.",
      hint: "open",
      answers: ["opens"],
      explain: "Дэлгүүрийн цагийн хуваарь. The shop гэдэг нь it тул opens.",
    },
    {
      kind: "choice",
      sentence: "I ___ coffee. I prefer tea.",
      options: ["don't like", "doesn't like", "not like", "am not like"],
      answer: "don't like",
      explain: "I-тэй үгүйсгэхдээ don't + үйл үг.",
    },
    {
      kind: "pick",
      prompt: "\"Би өдөр бүр 7 цагт босдог\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: ["I'm getting up at 7 every day.", "I get up at 7 every day.", "I got up at 7 every day."],
      answer: "I get up at 7 every day.",
      explain: "every day гэдэг нь дадал тул Present Simple хэрэглэнэ.",
    },
  ],
};
