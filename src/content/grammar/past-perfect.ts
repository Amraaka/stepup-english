import type { Lesson } from "@/lib/grammar/types";

export const pastPerfect: Lesson = {
  slug: "past-perfect",
  title: "Past Perfect",
  mn: "Өнгөрсөн төгссөн цаг",
  level: "B1",
  summary: "Өнгөрсөнд болсон өөр үйлээс өмнө болчихсон байсан үйлийг хэлнэ.",
  uses: [
    {
      title: "Өөр өнгөрсөн үйлээс өмнө болсон үйл",
      body: "Өнгөрсөнд хоёр үйл байхад эрт болсныг нь Past Perfect-ээр хэлнэ.",
      examples: [
        { en: "When we arrived, the film had started.", mn: "Биднийг очиход кино эхэлчихсэн байсан." },
        { en: "She had left before I called.", mn: "Намайг залгахаас өмнө тэр гарчихсан байсан." },
      ],
    },
    {
      title: "Шалтгааныг тайлбарлах",
      body: "Өнгөрсөнд ямар нэг зүйл яагаад болсныг тайлбарлахад хэрэглэнэ.",
      examples: [{ en: "I was hungry because I hadn't eaten all day.", mn: "Би өдөржин юм идээгүй болохоор өлссөн байсан." }],
    },
    {
      title: "Тэр мөч хүртэлх туршлага",
      body: "Өнгөрсөн нэг мөч хүртэл хийж үзсэн, үзээгүй зүйлийг хэлнэ.",
      examples: [{ en: "I had never seen the sea before that trip.", mn: "Тэр аяллаас өмнө би далай харж байгаагүй." }],
    },
  ],
  timeline: {
    marks: [
      { type: "dot", at: -0.8, label: "эхэлсэн" },
      { type: "dot", at: -0.3, label: "очсон" },
    ],
    caption: "Өнгөрсөнд болсон хоёр үйлээс эрт болсон нь Past Perfect",
  },
  form: [
    { label: "Эерэг", pattern: "had + V3", example: "They had finished dinner." },
    { label: "Үгүйсгэх", pattern: "had + not + V3", example: "I hadn't met him before." },
    { label: "Асуух", pattern: "Had + S + V3?", example: "Had you ever been abroad before?" },
  ],
  signals: ["before", "after", "already", "by the time", "when", "never ... before"],
  pitfalls: [
    {
      wrong: "When I got home, my brother already left.",
      right: "When I got home, my brother had already left.",
      note: "Намайг ирэхээс өмнө болчихсон тул had left.",
    },
    {
      wrong: "I had gone to Japan last year.",
      right: "I went to Japan last year.",
      note: "Өөр өнгөрсөн үйлтэй харьцуулахгүй бол энгийн Past Simple хангалттай.",
    },
    {
      wrong: "She had went home.",
      right: "She had gone home.",
      note: "had-ийн дараа үйл үгийн 3-р хэлбэр орно: go → went → gone.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "By the time I arrived at the station, the train ___.",
      options: ["left", "had left", "has left", "leaves"],
      answer: "had left",
      explain: "Намайг очихоос өмнө галт тэрэг явчихсан байсан: had left.",
    },
    {
      kind: "type",
      sentence: "She was nervous because she ___ on a plane before.",
      hint: "never / fly",
      answers: ["had never flown"],
      explain: "Тэр мөч хүртэл нисэж үзээгүй: had never flown. fly → flew → flown.",
    },
    {
      kind: "choice",
      sentence: "___ you finished your homework before the film started?",
      options: ["Have", "Had", "Did", "Were"],
      answer: "Had",
      explain: "Кино эхлэхээс өмнө дууссан эсэхийг асууж байгаа тул Had.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["After she had eaten, she went to bed.", "After she had ate, she went to bed.", "After she has eaten, she went to bed."],
      answer: "After she had eaten, she went to bed.",
      explain: "had + 3-р хэлбэр: eat → ate → eaten.",
    },
    {
      kind: "choice",
      sentence: "By the time the police came, the thief ___.",
      options: ["escaped", "had escaped", "has escaped", "escapes"],
      answer: "had escaped",
      explain: "by the time гэдэг нь цагдаа ирэхээс өмнө болчихсоныг заана.",
    },
    {
      kind: "type",
      sentence: "They ___ each other before the wedding.",
      hint: "not / meet",
      answers: ["had not met"],
      explain: "had + not + met, товчилбол hadn't met.",
    },
    {
      kind: "choice",
      sentence: "I ___ that film, so I didn't want to watch it again.",
      options: ["had seen", "have seen", "see", "was seeing"],
      answer: "had seen",
      explain: "Үзэхийг хүсээгүй тэр мөчөөс өмнө үзчихсэн байсан.",
    },
    {
      kind: "pick",
      prompt: "\"Намайг гэртээ ирэхэд ээж хоол хийчихсэн байсан\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: [
        "When I came home, Mom cooked dinner.",
        "When I came home, Mom had cooked dinner.",
        "When I had come home, Mom cooked dinner.",
      ],
      answer: "When I came home, Mom had cooked dinner.",
      explain: "Хоол хийсэн нь эрт болсон тул had cooked.",
    },
  ],
};
