import type { Lesson } from "@/lib/grammar/types";

export const pastPerfectContinuous: Lesson = {
  slug: "past-perfect-continuous",
  title: "Past Perfect Continuous",
  mn: "Өнгөрсөн төгссөн үргэлжлэх цаг",
  level: "B2",
  summary: "Өнгөрсөн нэг мөч хүртэл хэр удаан үргэлжилсэн үйлийг хэлнэ.",
  uses: [
    {
      title: "Өнгөрсөн мөч хүртэл үргэлжилсэн үйл",
      body: "Өнгөрсөнд өөр үйл болох хүртэл хэр удаан үргэлжилснийг хэлнэ.",
      examples: [
        {
          en: "He had been living in Seoul for two years when he met his wife.",
          mn: "Эхнэртэйгээ танилцах үедээ тэр Сөүлд хоёр жил амьдарч байсан.",
        },
        { en: "We had been waiting for an hour before the bus came.", mn: "Автобус ирэхээс өмнө бид нэг цаг хүлээсэн." },
      ],
    },
    {
      title: "Өнгөрсөнд харагдсан үр дүнгийн шалтгаан",
      body: "Өнгөрсөнд харагдсан байдал яагаад болсныг тайлбарлахад хэрэглэнэ.",
      examples: [
        { en: "His clothes were wet because he had been walking in the rain.", mn: "Бороонд алхсан болохоор хувцас нь норсон байсан." },
        { en: "Her eyes were red. She had been crying.", mn: "Нүд нь улайсан байсан. Тэр уйлсан байжээ." },
      ],
    },
  ],
  timeline: {
    marks: [
      { type: "span", from: -0.9, to: -0.35, label: "хүлээж байсан" },
      { type: "dot", at: -0.35, label: "автобус ирсэн" },
    ],
    caption: "Өнгөрсөн нэг мөч хүртэл үргэлжилсэн үйл",
  },
  form: [
    { label: "Эерэг", pattern: "had + been + V-ing", example: "I had been studying for hours." },
    { label: "Үгүйсгэх", pattern: "had + not + been + V-ing", example: "She hadn't been sleeping well." },
    { label: "Асуух", pattern: "Had + S + been + V-ing?", example: "How long had you been waiting?" },
  ],
  signals: ["for", "since", "how long", "before", "when", "by the time", "all day"],
  pitfalls: [
    {
      wrong: "I was waiting for two hours when he finally came.",
      right: "I had been waiting for two hours when he finally came.",
      note: "Тэр мөч хүртэл хэр удаан үргэлжилснийг for-оор хэлбэл Past Perfect Continuous.",
    },
    {
      wrong: "They had been knowing each other for years.",
      right: "They had known each other for years.",
      note: "Төлөв заадаг үйл үгтэй Continuous хэрэглэхгүй.",
    },
    {
      wrong: "He had been work all day.",
      right: "He had been working all day.",
      note: "been-ий дараа үйл үг -ing хэлбэртэй байна.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "The ground was wet. It ___ all night.",
      options: ["has been raining", "had been raining", "was rain", "is raining"],
      answer: "had been raining",
      explain: "Газар норсон байсан нь өмнө нь шөнөжин бороо орсны үр дүн.",
    },
    {
      kind: "choice",
      sentence: "How long ___ you been studying before the exam started?",
      options: ["have", "had", "did", "were"],
      answer: "had",
      explain: "Шалгалт эхлэх хүртэлх хугацааг асууж байгаа тул had.",
    },
    {
      kind: "type",
      sentence: "She was tired because she ___ all day.",
      hint: "work",
      answers: ["had been working"],
      explain: "Ядарсан шалтгаан нь өдөржин ажилласан: had been working.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["We had been knowing him for years.", "We had known him for years.", "We had been know him for years."],
      answer: "We had known him for years.",
      explain: "know төлөв заадаг тул Continuous хэлбэр авахгүй.",
    },
    {
      kind: "choice",
      sentence: "I ___ for 30 minutes when the taxi finally arrived.",
      options: ["had been waiting", "have been waiting", "am waiting", "wait"],
      answer: "had been waiting",
      explain: "Такси ирэх хүртэл 30 минут үргэлжилсэн үйл.",
    },
    {
      kind: "type",
      sentence: "His hands were dirty because he ___ the car.",
      hint: "repair",
      answers: ["had been repairing"],
      explain: "Гар нь бохирдсон шалтгаан: had been repairing.",
    },
    {
      kind: "choice",
      sentence: "They had been ___ for hours, so they were hungry.",
      options: ["walk", "walked", "walking", "walks"],
      answer: "walking",
      explain: "had been-ий дараа -ing хэлбэр орно.",
    },
    {
      kind: "pick",
      prompt: "\"Намайг ирэх үед тэд нэг цаг ярилцаж байсан\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: [
        "They talked for an hour when I arrived.",
        "They had been talking for an hour when I arrived.",
        "They have been talking for an hour when I arrived.",
      ],
      answer: "They had been talking for an hour when I arrived.",
      explain: "Намайг ирэх хүртэл нэг цаг үргэлжилсэн тул had been talking.",
    },
  ],
};
