import type { Lesson } from "@/lib/grammar/types";

export const presentContinuous: Lesson = {
  slug: "present-continuous",
  title: "Present Continuous",
  mn: "Одоо үргэлжлэх цаг",
  level: "A1",
  summary: "Яг одоо болж байгаа, эсвэл энэ үед түр үргэлжилж буй үйлийг хэлнэ.",
  uses: [
    {
      title: "Яг одоо болж байгаа үйл",
      body: "Ярьж байх үед эхэлсэн, хараахан дуусаагүй үйлийг хэлнэ.",
      examples: [
        { en: "I'm cooking dinner right now.", mn: "Би яг одоо оройн хоол хийж байна." },
        { en: "Listen! Someone is knocking on the door.", mn: "Сонс! Хэн нэгэн хаалга тогшиж байна." },
      ],
    },
    {
      title: "Энэ үеийн түр зуурын үйл",
      body: "Яг энэ мөчид биш ч гэсэн сүүлийн үед үргэлжилж буй түр зуурын зүйлийг хэлнэ.",
      examples: [
        { en: "She's living with her aunt this month.", mn: "Тэр энэ сард нагац эгчийнхээд амьдарч байгаа." },
        { en: "I'm reading a great book these days.", mn: "Би сүүлийн үед нэг гоё ном уншиж байгаа." },
      ],
    },
    {
      title: "Тохирчихсон төлөвлөгөө",
      body: "Цаг, газраа тохирчихсон ойрын төлөвлөгөөг хэлнэ.",
      examples: [{ en: "We're meeting Bat tomorrow at six.", mn: "Бид маргааш зургаан цагт Баттай уулзана." }],
    },
  ],
  timeline: {
    marks: [{ type: "span", from: -0.25, to: 0.25, label: "яг одоо" }],
    caption: "Ярьж байх үед үргэлжилж байгаа үйл",
  },
  form: [
    { label: "Эерэг", pattern: "am / is / are + V-ing", example: "They are playing basketball." },
    { label: "Үгүйсгэх", pattern: "am / is / are + not + V-ing", example: "He isn't working today." },
    { label: "Асуух", pattern: "Am / Is / Are + S + V-ing?", example: "Are you listening?" },
  ],
  signals: ["now", "right now", "at the moment", "today", "this week", "these days", "Look!", "Listen!"],
  pitfalls: [
    {
      wrong: "I playing games now.",
      right: "I'm playing games now.",
      note: "-ing хэлбэрийн өмнө am, is, are заавал байна.",
    },
    {
      wrong: "I'm knowing the answer.",
      right: "I know the answer.",
      note: "know, like, want, need, understand гэх мэт төлөв заадаг үйл үг ихэвчлэн -ing авдаггүй.",
    },
    {
      wrong: "She is swiming.",
      right: "She is swimming.",
      note: "Богино үгийн төгсгөлийн гийгүүлэгч давхарна: swim → swimming, run → running.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "Be quiet! The baby ___.",
      options: ["sleeps", "is sleeping", "sleeping", "are sleeping"],
      answer: "is sleeping",
      explain: "Be quiet! гэснээс яг одоо болж байгаа нь харагдаж байна.",
    },
    {
      kind: "type",
      sentence: "Look! It ___.",
      hint: "snow",
      answers: ["is snowing"],
      explain: "Look! гэдэг нь яг одоо болж байгааг заана: it + is + snowing.",
    },
    {
      kind: "choice",
      sentence: "I ___ to music right now.",
      options: ["listen", "am listening", "is listening", "listening"],
      answer: "am listening",
      explain: "right now байгаа тул Present Continuous. I-тэй am хэрэглэнэ.",
    },
    {
      kind: "choice",
      sentence: "___ they watching a film?",
      options: ["Do", "Is", "Are", "Does"],
      answer: "Are",
      explain: "they-тэй are, асуухдаа урагш нь гаргана.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["I'm wanting a new phone.", "I want a new phone.", "I wanting a new phone."],
      answer: "I want a new phone.",
      explain: "want нь төлөв заадаг үйл үг тул -ing авахгүй.",
    },
    {
      kind: "type",
      sentence: "He ___ today because he is sick.",
      hint: "not / work",
      answers: ["is not working"],
      explain: "Өнөөдрийн түр зуурын байдал: is + not + working, товчилбол isn't working.",
    },
    {
      kind: "choice",
      sentence: "We ___ my grandmother on Sunday. The tickets are ready.",
      options: ["visit", "are visiting", "visiting", "visits"],
      answer: "are visiting",
      explain: "Тохирчихсон ойрын төлөвлөгөөг Present Continuous-аар хэлнэ.",
    },
    {
      kind: "pick",
      prompt: "\"Тэр одоо шүршүүрт орж байна\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: ["She takes a shower now.", "She is taking a shower now.", "She taking a shower now."],
      answer: "She is taking a shower now.",
      explain: "now гэдэг нь яг одоо, тиймээс is + taking.",
    },
  ],
};
