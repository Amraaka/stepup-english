import type { Lesson } from "@/lib/grammar/types";

export const willGoingTo: Lesson = {
  slug: "will-going-to",
  title: "will / be going to",
  mn: "Ирээдүй цаг",
  level: "A2",
  summary: "Ирээдүйд болох зүйлийг хэлэх хоёр гол арга, ялгааг нь хамт үзнэ.",
  uses: [
    {
      title: "Шууд гаргасан шийдвэр · will",
      body: "Ярьж байх үедээ шийдсэн зүйл, санал болгох, амлахад will хэрэглэнэ.",
      examples: [
        { en: "It's cold. I'll close the window.", mn: "Хүйтэн байна. Би цонхоо хаачихъя." },
        { en: "I'll help you with your bags.", mn: "Би цүнхийг чинь авалцъя." },
      ],
    },
    {
      title: "Урьдчилан шийдсэн төлөвлөгөө · going to",
      body: "Өмнө нь бодож шийдсэн зорилго, төлөвлөгөөг going to-гоор хэлнэ.",
      examples: [{ en: "I'm going to study abroad next year.", mn: "Би ирэх жил гадаадад сурахаар шийдсэн." }],
    },
    {
      title: "Таамаглал",
      body: "Бодол санаагаараа таамаглахад will, одоо харагдаж байгаа зүйлд тулгуурлахад going to хэрэглэнэ.",
      examples: [
        { en: "I think Mongolia will win.", mn: "Монгол ялна гэж бодож байна." },
        { en: "Look at those clouds. It's going to rain.", mn: "Тэр үүлсийг хар. Бороо орох нь." },
      ],
    },
  ],
  timeline: {
    marks: [{ type: "dot", at: 0.55, label: "маргааш" }],
    caption: "Одооноос хойш болох үйл",
  },
  form: [
    { label: "Эерэг", pattern: "will + V · am / is / are going to + V", example: "She'll call you. We're going to move." },
    { label: "Үгүйсгэх", pattern: "won't + V · am / is / are not going to + V", example: "I won't tell anyone." },
    { label: "Асуух", pattern: "Will + S + V? · Am / Is / Are + S + going to + V?", example: "Are you going to come?" },
  ],
  signals: ["tomorrow", "next week", "next year", "soon", "in two days", "I think", "probably"],
  pitfalls: [
    {
      wrong: "I will to call you.",
      right: "I will call you.",
      note: "will-ийн дараа to хэрэггүй.",
    },
    {
      wrong: "She going to buy a car.",
      right: "She is going to buy a car.",
      note: "going to-гийн өмнө am, is, are заавал байна.",
    },
    {
      wrong: "I will visit Japan next month. I already bought the ticket.",
      right: "I'm going to visit Japan next month. I already bought the ticket.",
      note: "Урьдчилан шийдчихсэн төлөвлөгөөг going to-гоор хэлнэ.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "A: I'm thirsty. B: Wait, I ___ you some water.",
      options: ["'ll get", "am going to get", "get", "got"],
      answer: "'ll get",
      explain: "Ярьж байх үедээ шууд гаргасан шийдвэр тул will.",
    },
    {
      kind: "choice",
      sentence: "We ___ visit our grandparents this weekend. We planned it last month.",
      options: ["will", "are going to", "going to", "won't"],
      answer: "are going to",
      explain: "Өнгөрсөн сард төлөвлөчихсөн тул going to.",
    },
    {
      kind: "type",
      sentence: "Look at the sky! It ___.",
      hint: "rain",
      answers: ["is going to rain"],
      explain: "Тэнгэр харагдаж байгаа нотолгоо тул is going to rain.",
    },
    {
      kind: "choice",
      sentence: "Don't worry, I ___ tell anyone.",
      options: ["won't", "am not going", "don't", "not will"],
      answer: "won't",
      explain: "Амлалт тул will not буюу won't.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["She will to start a new job.", "She is going to start a new job.", "She going to start a new job."],
      answer: "She is going to start a new job.",
      explain: "going to-гийн өмнө is байх ёстой, will-ийн дараа to ордоггүй.",
    },
    {
      kind: "choice",
      sentence: "I think it ___ be sunny tomorrow.",
      options: ["is", "will", "going to", "does"],
      answer: "will",
      explain: "I think гэж бодлоо хэлж таамаглаж байгаа тул will.",
    },
    {
      kind: "type",
      sentence: "My sister ___ a doctor. She is studying medicine.",
      hint: "be",
      answers: ["is going to be", "will be"],
      explain: "Анагаах ухаанд сурч байгаа нь нотолгоо тул is going to be илүү тохиромжтой.",
    },
    {
      kind: "pick",
      prompt: "Найз чинь хүнд хайрцаг барьж явна. Чи дор нь \"Би туслая\" гэнэ.",
      options: ["I'm going to help you.", "I'll help you.", "I help you."],
      answer: "I'll help you.",
      explain: "Тэр дор нь гаргасан шийдвэр, санал тул will.",
    },
  ],
};
