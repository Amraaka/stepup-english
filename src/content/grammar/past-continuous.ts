import type { Lesson } from "@/lib/grammar/types";

export const pastContinuous: Lesson = {
  slug: "past-continuous",
  title: "Past Continuous",
  mn: "Өнгөрсөн үргэлжлэх цаг",
  level: "A2",
  summary: "Өнгөрсөнд тодорхой мөчид үргэлжилж байсан үйлийг хэлнэ.",
  uses: [
    {
      title: "Өнгөрсөн мөчид үргэлжилж байсан үйл",
      body: "\"Өчигдөр 8 цагт юу хийж байсан бэ?\" гэх мэт тодорхой мөчид үргэлжилж байсан үйлийг хэлнэ.",
      examples: [{ en: "At 8 p.m. yesterday, I was studying.", mn: "Өчигдөр оройн 8 цагт би хичээлээ хийж байсан." }],
    },
    {
      title: "Өөр үйлээр тасалдсан үйл",
      body: "Үргэлжилж байсан урт үйл Past Continuous, дундуур нь болсон богино үйл Past Simple байна.",
      examples: [
        { en: "I was walking home when it started to rain.", mn: "Намайг гэр лүүгээ алхаж явахад бороо орж эхэлсэн." },
        { en: "The phone rang while we were having dinner.", mn: "Биднийг оройн хоол идэж байхад утас дуугарсан." },
      ],
    },
    {
      title: "Зэрэг болж байсан хоёр үйл",
      body: "Нэгэн зэрэг үргэлжилж байсан хоёр үйлийг while-аар холбоно.",
      examples: [
        {
          en: "While Mom was cooking, Dad was cleaning the room.",
          mn: "Ээж хоол хийж байхад аав өрөө цэвэрлэж байсан.",
        },
      ],
    },
  ],
  timeline: {
    marks: [
      { type: "span", from: -0.85, to: -0.25, label: "хоол идэж байсан" },
      { type: "dot", at: -0.55, label: "утас дуугарсан" },
    ],
    caption: "Өнгөрсөнд үргэлжилж байсан үйл ба түүнийг тасалдуулсан богино үйл",
  },
  form: [
    { label: "Эерэг", pattern: "was / were + V-ing", example: "They were playing chess." },
    { label: "Үгүйсгэх", pattern: "was / were + not + V-ing", example: "I wasn't sleeping." },
    { label: "Асуух", pattern: "Was / Were + S + V-ing?", example: "What were you doing at 10?" },
  ],
  signals: ["while", "when", "at 7 o'clock yesterday", "all day yesterday", "at that moment"],
  pitfalls: [
    {
      wrong: "When I arrived, they were eat.",
      right: "When I arrived, they were eating.",
      note: "was, were-ийн дараа үйл үг -ing хэлбэртэй байна.",
    },
    {
      wrong: "I was sleeping when you were calling.",
      right: "I was sleeping when you called.",
      note: "Тасалдуулсан богино үйл Past Simple байна.",
    },
    {
      wrong: "We was waiting for the bus.",
      right: "We were waiting for the bus.",
      note: "I, he, she, it-тэй was, you, we, they-тэй were.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "At 9 o'clock last night, I ___ a film.",
      options: ["watched", "was watching", "were watching", "am watching"],
      answer: "was watching",
      explain: "Өнгөрсөн тодорхой мөчид үргэлжилж байсан үйл. I-тэй was.",
    },
    {
      kind: "choice",
      sentence: "She was cooking when the lights ___ out.",
      options: ["were going", "went", "go", "was going"],
      answer: "went",
      explain: "Гэрэл унтарсан нь богино, тасалдуулсан үйл тул Past Simple.",
    },
    {
      kind: "type",
      sentence: "They ___ football when it started to rain.",
      hint: "play",
      answers: ["were playing"],
      explain: "Бороо орж эхлэх үед үргэлжилж байсан үйл: they + were + playing.",
    },
    {
      kind: "choice",
      sentence: "What ___ you doing at 7 this morning?",
      options: ["was", "were", "did", "are"],
      answer: "were",
      explain: "you-тэй were хэрэглэнэ.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: [
        "I was reading while my sister was listening to music.",
        "I was read while my sister listened to music.",
        "I reading while my sister was listening to music.",
      ],
      answer: "I was reading while my sister was listening to music.",
      explain: "Зэрэг үргэлжилж байсан хоёр үйл, хоёулаа was + V-ing.",
    },
    {
      kind: "type",
      sentence: "He ___ when I called him.",
      hint: "not / sleep",
      answers: ["was not sleeping"],
      explain: "was + not + sleeping, товчилбол wasn't sleeping.",
    },
    {
      kind: "choice",
      sentence: "While I ___ to work, I saw an old friend.",
      options: ["walked", "was walking", "am walking", "were walking"],
      answer: "was walking",
      explain: "while-ийн дараа үргэлжилж байсан урт үйл орно.",
    },
    {
      kind: "pick",
      prompt: "\"Намайг орж ирэхэд тэд ярилцаж байсан\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: ["They talked when I came in.", "They were talking when I came in.", "They were talking when I was coming in."],
      answer: "They were talking when I came in.",
      explain: "Ярилцаж байсан нь урт үйл, орж ирсэн нь богино үйл.",
    },
  ],
};
