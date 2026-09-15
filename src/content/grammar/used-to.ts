import type { Lesson } from "@/lib/grammar/types";

export const usedTo: Lesson = {
  slug: "used-to",
  title: "used to / would",
  mn: "Өнгөрсөн дадал",
  level: "B1",
  summary: "Өмнө нь байнга хийдэг байсан, одоо болисон зүйлийг хэлнэ.",
  uses: [
    {
      title: "Өмнө нь хийдэг байсан дадал",
      body: "Өнгөрсөнд байнга хийдэг байсан ч одоо хийхээ больсон зүйлийг used to + V-ээр хэлнэ.",
      examples: [
        { en: "I used to play basketball every day.", mn: "Би өмнө нь өдөр бүр сагсан бөмбөг тоглодог байсан." },
        { en: "She didn't use to like vegetables.", mn: "Тэр өмнө нь ногоонд дургүй байсан." },
      ],
    },
    {
      title: "Өмнөх байдал",
      body: "Одоо өөрчлөгдсөн байдлыг used to-гоор хэлнэ. would-ийг ингэж хэрэглэдэггүй.",
      examples: [
        { en: "There used to be a cinema here.", mn: "Энд өмнө нь кино театр байсан." },
        { en: "I used to have long hair.", mn: "Би өмнө нь урт үстэй байсан." },
      ],
    },
    {
      title: "Дурсамжинд давтагдах үйл · would",
      body: "Өнгөрсний дурсамжаа ярихдаа давтагддаг байсан үйлд would хэрэглэж болно.",
      examples: [{ en: "Every summer, we would go to the countryside.", mn: "Зун болгон бид хөдөө явдаг байлаа." }],
    },
  ],
  timeline: {
    marks: [{ type: "dots", from: -0.9, to: -0.3, label: "өмнө нь байнга" }],
    caption: "Өнгөрсөнд давтагддаг байсан, одоо больсон үйл",
  },
  form: [
    { label: "Эерэг", pattern: "used to + V · would + V", example: "He used to smoke." },
    { label: "Үгүйсгэх", pattern: "didn't use to + V", example: "We didn't use to have a car." },
    { label: "Асуух", pattern: "Did + S + use to + V?", example: "Did you use to walk to school?" },
  ],
  signals: ["when I was a child", "in the past", "every summer", "but now", "not anymore"],
  pitfalls: [
    {
      wrong: "I use to live in Darkhan.",
      right: "I used to live in Darkhan.",
      note: "Эерэг өгүүлбэрт used to гэж -d-тэй бичнэ.",
    },
    {
      wrong: "Did you used to play chess?",
      right: "Did you use to play chess?",
      note: "did-ийн дараа use to гэж -d-гүй бичнэ.",
    },
    {
      wrong: "I would have a dog when I was young.",
      right: "I used to have a dog when I was young.",
      note: "have, be, live, like гэх мэт байдал заасан үйл үгтэй would биш used to хэрэглэнэ.",
    },
    {
      wrong: "I'm used to play football.",
      right: "I used to play football.",
      note: "be used to + V-ing гэдэг нь \"дассан\" гэсэн өөр утгатай.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "When I was a kid, I ___ cartoons every morning.",
      options: ["use to watch", "used to watch", "am used to watch", "was used to watching"],
      answer: "used to watch",
      explain: "Өмнө нь байнга хийдэг байсан дадал: used to + V.",
    },
    {
      kind: "choice",
      sentence: "___ you use to live in the countryside?",
      options: ["Do", "Did", "Were", "Are"],
      answer: "Did",
      explain: "Асуухдаа Did + S + use to + V.",
    },
    {
      kind: "type",
      sentence: "There ___ a big park here, but now it's a shopping mall.",
      hint: "be",
      answers: ["used to be"],
      explain: "Өмнөх байдал: used to be.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["I didn't used to like coffee.", "I didn't use to like coffee.", "I not used to like coffee."],
      answer: "I didn't use to like coffee.",
      explain: "didn't-ийн дараа use to гэж -d-гүй бичнэ.",
    },
    {
      kind: "choice",
      sentence: "My grandfather ___ us stories every night.",
      options: ["would tell", "would told", "used tell", "use to tell"],
      answer: "would tell",
      explain: "Дурсамжинд давтагддаг байсан үйл: would + V.",
    },
    {
      kind: "pick",
      prompt: "would-ийг зөв хэрэглэсэн өгүүлбэр аль нь вэ?",
      options: ["I would have a bike when I was ten.", "I would ride my bike every afternoon.", "I would be shy as a child."],
      answer: "I would ride my bike every afternoon.",
      explain: "would-ийг давтагддаг үйлд хэрэглэнэ. have, be гэх мэт байдалд хэрэглэхгүй.",
    },
    {
      kind: "type",
      sentence: "She ___ glasses, but now she wears contact lenses.",
      hint: "wear",
      answers: ["used to wear"],
      explain: "Өмнө нь зүүдэг байсан, одоо больсон: used to wear.",
    },
    {
      kind: "pick",
      prompt: "\"Би өмнө нь их ичимхий байсан\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: ["I would be very shy.", "I used to be very shy.", "I use to be very shy."],
      answer: "I used to be very shy.",
      explain: "Өмнөх байдлыг used to be гэж хэлнэ.",
    },
  ],
};
