import type { Lesson } from "@/lib/grammar/types";

export const pastSimpleVsPresentPerfect: Lesson = {
  slug: "past-simple-vs-present-perfect",
  title: "Past Simple vs Present Perfect",
  mn: "Өнгөрсөн энгийн ба Одоо төгссөн цаг",
  level: "B1",
  summary: "Монголоор хоёулаа \"хийсэн\" гэж орчуулагддаг ч англиар хэзээ болсон нь тодорхой эсэхээс хамаарч өөр цаг хэрэглэнэ.",
  uses: [
    {
      title: "Хэзээ болсон нь тодорхой · Past Simple",
      body: "yesterday, in 2020, last week гэх мэт дууссан цагтай бол Past Simple хэрэглэнэ.",
      examples: [
        { en: "I lost my keys yesterday.", mn: "Би өчигдөр түлхүүрээ гээсэн." },
        { en: "Did you see the match last night?", mn: "Чи өчигдөр орой тоглолт үзсэн үү?" },
      ],
    },
    {
      title: "Хэзээ болсон нь чухал биш · Present Perfect",
      body: "Туршлага эсвэл одоо харагдаж байгаа үр дүнг хэлэхэд Present Perfect хэрэглэнэ.",
      examples: [
        { en: "I've lost my keys. Can you help me find them?", mn: "Би түлхүүрээ гээчихлээ. Хайхад туслаач?" },
        { en: "Have you ever seen a match live?", mn: "Чи тоглолтыг амьдаар нь үзэж байсан уу?" },
      ],
    },
    {
      title: "Дууссан ба дуусаагүй хугацаа",
      body: "Дууссан хугацаанд (yesterday, last year) Past Simple, дуусаагүй хугацаанд (today, this week, so far) Present Perfect хэрэглэнэ.",
      examples: [
        { en: "I drank three coffees yesterday.", mn: "Би өчигдөр гурван кофе уусан." },
        { en: "I've drunk three coffees today.", mn: "Би өнөөдөр гурван кофе уучихлаа." },
      ],
    },
  ],
  timeline: {
    marks: [
      { type: "dot", at: -0.6, label: "өчигдөр" },
      { type: "arrow", from: -0.35, to: 0, label: "одоо хүртэл" },
    ],
    caption: "Цэг нь Past Simple, одоо хүрсэн сум нь Present Perfect",
  },
  form: [
    { label: "Past Simple", pattern: "V-ed / V2 · did + V", example: "I visited Japan in 2019." },
    { label: "Present Perfect", pattern: "have / has + V3", example: "I have visited Japan twice." },
    { label: "Асуух", pattern: "When did you + V? · Have you ever + V3?", example: "When did you go? Have you ever been there?" },
  ],
  signals: ["yesterday", "last year", "ago", "in 2019", "ever", "never", "already", "yet", "so far", "today"],
  pitfalls: [
    {
      wrong: "I have finished school in 2020.",
      right: "I finished school in 2020.",
      note: "in 2020 гэж хэзээ болсныг хэлсэн тул Past Simple.",
    },
    {
      wrong: "When have you arrived?",
      right: "When did you arrive?",
      note: "When-ээр асуувал цаг нь тодорхой болох тул Past Simple.",
    },
    {
      wrong: "This is the best film I ever saw.",
      right: "This is the best film I have ever seen.",
      note: "the best ... ever гэх мэт одоо хүртэлх туршлагыг Present Perfect-ээр хэлнэ.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "I ___ Paris in 2019.",
      options: ["visited", "have visited", "has visited", "visit"],
      answer: "visited",
      explain: "in 2019 гэж хэзээ болсныг хэлсэн тул Past Simple.",
    },
    {
      kind: "choice",
      sentence: "___ you ever eaten Korean food?",
      options: ["Did", "Have", "Were", "Do"],
      answer: "Have",
      explain: "ever-тэй туршлагыг асууж байгаа тул Have you ever + V3?",
    },
    {
      kind: "type",
      sentence: "We ___ this house two years ago.",
      hint: "buy",
      answers: ["bought"],
      explain: "ago гэдэг нь дууссан цэг тул Past Simple: bought.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["When have you finished university?", "When did you finish university?", "When you finished university?"],
      answer: "When did you finish university?",
      explain: "When-ээр асуухдаа Past Simple хэрэглэнэ.",
    },
    {
      kind: "choice",
      sentence: "I ___ three cups of tea so far today.",
      options: ["had", "have had", "has had", "having"],
      answer: "have had",
      explain: "so far today гэдэг нь дуусаагүй хугацаа тул Present Perfect.",
    },
    {
      kind: "type",
      sentence: "This is the most interesting book I ___.",
      hint: "ever / read",
      answers: ["have ever read"],
      explain: "Одоо хүртэлх туршлага: have ever read.",
    },
    {
      kind: "choice",
      sentence: "She ___ her leg last winter.",
      options: ["broke", "has broken", "breaks", "is breaking"],
      answer: "broke",
      explain: "last winter гэж дууссан хугацааг хэлсэн тул Past Simple.",
    },
    {
      kind: "pick",
      prompt: "Чи энэ киног өмнө нь үзсэн. Хэзээ үзсэнээ хэлэхгүйгээр хариулна уу.",
      options: ["Yes, I saw it last year.", "Yes, I've seen it.", "Yes, I've seen it last year."],
      answer: "Yes, I've seen it.",
      explain: "Хэзээ гэдгийг хэлэхгүй туршлага тул Present Perfect. last year нэмбэл Past Simple болно.",
    },
  ],
};
