import type { Lesson } from "@/lib/grammar/types";

export const presentPerfectContinuous: Lesson = {
  slug: "present-perfect-continuous",
  title: "Present Perfect Continuous",
  mn: "Одоо төгссөн үргэлжлэх цаг",
  level: "B1",
  summary: "Өмнө эхэлж одоо хүртэл үргэлжилж байгаа үйл, түүний хугацааг хэлнэ.",
  uses: [
    {
      title: "Одоо хүртэл үргэлжилж байгаа үйл",
      body: "Өмнө эхэлсэн, одоо ч үргэлжилж байгаа үйлийг for, since, how long-той хамт хэлнэ.",
      examples: [
        { en: "I've been learning English for two years.", mn: "Би хоёр жил англи хэл сурч байна." },
        { en: "How long have you been waiting?", mn: "Чи хэр удаан хүлээж байна?" },
      ],
    },
    {
      title: "Үр дүн нь харагдаж байгаа саяхны үйл",
      body: "Саяхан болж өнгөрсөн ч үр дүн нь одоо харагдаж байгаа үйлийг хэлнэ.",
      examples: [
        { en: "I'm tired because I've been running.", mn: "Би гүйгээд ирсэн болохоор ядарч байна." },
        { en: "Your eyes are red. Have you been crying?", mn: "Нүд чинь улайчихсан байна. Уйлсан юм уу?" },
      ],
    },
    {
      title: "Present Perfect-ээс ялгах нь",
      body: "Үйлийн үргэлжилсэн хугацааг онцлоход Continuous, хэдийг хийснийг буюу үр дүнг онцлоход Present Perfect хэрэглэнэ.",
      examples: [
        { en: "I've been reading this book all day.", mn: "Би өдөржин энэ номыг уншлаа." },
        { en: "I've read three chapters.", mn: "Би гурван бүлэг уншчихлаа." },
      ],
    },
  ],
  timeline: {
    marks: [{ type: "span", from: -0.7, to: 0.02, label: "одоо хүртэл үргэлжилж байна" }],
    caption: "Өмнө эхэлсэн, одоо хүртэл үргэлжилж байгаа үйл",
  },
  form: [
    { label: "Эерэг", pattern: "have / has + been + V-ing", example: "She has been working here since May." },
    { label: "Үгүйсгэх", pattern: "have / has + not + been + V-ing", example: "I haven't been sleeping well." },
    { label: "Асуух", pattern: "Have / Has + S + been + V-ing?", example: "How long have you been living here?" },
  ],
  signals: ["for", "since", "how long", "all day", "lately", "recently"],
  pitfalls: [
    {
      wrong: "I am learning English for two years.",
      right: "I have been learning English for two years.",
      note: "Монголоор \"сурч байна\" гэдэг ч for, since-тэй бол Present Perfect Continuous хэрэглэнэ.",
    },
    {
      wrong: "I've been knowing her since school.",
      right: "I've known her since school.",
      note: "know, like, own гэх мэт төлөв заадаг үйл үгтэй Continuous хэрэглэхгүй.",
    },
    {
      wrong: "She has been work here since 2021.",
      right: "She has been working here since 2021.",
      note: "been-ий дараа үйл үг -ing хэлбэртэй байна.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "I ___ for the bus for 20 minutes.",
      options: ["am waiting", "have been waiting", "waited", "has been waiting"],
      answer: "have been waiting",
      explain: "for 20 minutes гэж хугацааг хэлж байгаа, одоо ч хүлээж байна.",
    },
    {
      kind: "choice",
      sentence: "How long ___ you been studying English?",
      options: ["are", "have", "did", "has"],
      answer: "have",
      explain: "How long have you been + V-ing? гэж асууна.",
    },
    {
      kind: "type",
      sentence: "It ___ all morning. The streets are wet.",
      hint: "rain",
      answers: ["has been raining"],
      explain: "Өглөөжин үргэлжилсэн, үр дүн нь харагдаж байна: has been raining.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["I've been knowing him for years.", "I've known him for years.", "I'm knowing him for years."],
      answer: "I've known him for years.",
      explain: "know төлөв заадаг тул Continuous хэлбэр авахгүй.",
    },
    {
      kind: "choice",
      sentence: "She's out of breath because she ___.",
      options: ["has been running", "runs", "is run", "has been run"],
      answer: "has been running",
      explain: "Амьсгаадаж байгаа нь саяхан гүйсний үр дүн.",
    },
    {
      kind: "type",
      sentence: "They ___ here since 2018.",
      hint: "live",
      answers: ["have been living", "have lived"],
      explain: "since 2018-аас хойш одоо ч амьдарч байна: have been living. live-тэй have lived ч бас зөв.",
    },
    {
      kind: "choice",
      sentence: "I ___ three emails this morning.",
      options: ["have written", "have been writing", "am writing", "write"],
      answer: "have written",
      explain: "three emails гэж хэдийг хийснийг хэлж байгаа тул Present Perfect.",
    },
    {
      kind: "pick",
      prompt: "\"Чи хэр удаан машин барьж байна?\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: ["How long are you driving?", "How long have you been driving?", "How long do you drive?"],
      answer: "How long have you been driving?",
      explain: "Одоо хүртэлх хугацааг асууж байгаа тул have you been driving.",
    },
  ],
};
