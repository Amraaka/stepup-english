import type { Lesson } from "@/lib/grammar/types";

export const pastSimple: Lesson = {
  slug: "past-simple",
  title: "Past Simple",
  mn: "Өнгөрсөн энгийн цаг",
  level: "A1",
  summary: "Өнгөрсөнд болоод дууссан үйлийг хэлнэ.",
  uses: [
    {
      title: "Өнгөрсөнд болоод дууссан үйл",
      body: "Хэзээ болсон нь тодорхой, бүрэн дууссан үйлийг хэлнэ.",
      examples: [
        { en: "I met Saraa yesterday.", mn: "Би өчигдөр Саратай уулзсан." },
        { en: "We moved to Erdenet in 2019.", mn: "Бид 2019 онд Эрдэнэт рүү нүүсэн." },
      ],
    },
    {
      title: "Дараалсан үйлс",
      body: "Өнгөрсөнд нэг нэгнийхээ араас болсон үйлсийг ярихад хэрэглэнэ.",
      examples: [
        { en: "He came home, had dinner and went to bed.", mn: "Тэр гэртээ ирээд, оройн хоолоо идээд, унтсан." },
      ],
    },
    {
      title: "Өмнөх дадал",
      body: "Өмнө нь байнга хийдэг байсан ч одоо больсон зүйлийг хэлж болно.",
      examples: [
        { en: "When I was a child, I played outside every day.", mn: "Хүүхэд байхдаа би өдөр бүр гадаа тоглодог байсан." },
      ],
    },
  ],
  timeline: {
    marks: [{ type: "dot", at: -0.55, label: "өчигдөр" }],
    caption: "Өнгөрсөнд нэг цэгт болоод дууссан үйл",
  },
  form: [
    { label: "Эерэг", pattern: "V-ed · дүрмийн бус үйл үг: go → went", example: "She called me last night." },
    { label: "Үгүйсгэх", pattern: "did + not + V", example: "I didn't see him." },
    { label: "Асуух", pattern: "Did + S + V?", example: "Did you finish your homework?" },
  ],
  signals: ["yesterday", "last week", "last year", "two days ago", "in 2020", "when I was young"],
  pitfalls: [
    {
      wrong: "I go to Khuvsgul last summer.",
      right: "I went to Khuvsgul last summer.",
      note: "Монголоор -сан, -сэн нэмдэг шиг англиар үйл үгээ өнгөрсөн хэлбэрт оруулна.",
    },
    {
      wrong: "I didn't went to school.",
      right: "I didn't go to school.",
      note: "did байвал үйл үг үндсэн хэлбэрээрээ байна.",
    },
    {
      wrong: "She buyed a new bag.",
      right: "She bought a new bag.",
      note: "Дүрмийн бус үйл үг -ed авахгүй: buy → bought, see → saw, go → went.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "We ___ a great film last night.",
      options: ["watch", "watched", "watching", "were watch"],
      answer: "watched",
      explain: "last night гэдэг нь өнгөрсөн, тиймээс watched.",
    },
    {
      kind: "type",
      sentence: "I ___ my keys yesterday.",
      hint: "lose",
      answers: ["lost"],
      explain: "lose дүрмийн бус үйл үг: lose → lost.",
    },
    {
      kind: "choice",
      sentence: "She ___ come to the party last Friday.",
      options: ["didn't", "doesn't", "wasn't", "not"],
      answer: "didn't",
      explain: "Өнгөрсөнд үгүйсгэхдээ didn't + үйл үгийн үндсэн хэлбэр.",
    },
    {
      kind: "choice",
      sentence: "___ you call your mom yesterday?",
      options: ["Do", "Did", "Were", "Are"],
      answer: "Did",
      explain: "yesterday байгаа тул асуухдаа Did хэрэглэнэ.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["They didn't went home.", "They didn't go home.", "They not went home."],
      answer: "They didn't go home.",
      explain: "didn't-ийн дараа үйл үг үндсэн хэлбэрээрээ байна.",
    },
    {
      kind: "type",
      sentence: "Two years ago, my family ___ a car.",
      hint: "buy",
      answers: ["bought"],
      explain: "buy дүрмийн бус үйл үг: buy → bought.",
    },
    {
      kind: "choice",
      sentence: "Temuulen ___ to Seoul in 2022.",
      options: ["goes", "went", "has gone", "go"],
      answer: "went",
      explain: "in 2022 гэж хэзээ болсон нь тодорхой тул Past Simple.",
    },
    {
      kind: "pick",
      prompt: "\"Би өчигдөр ном уншсан\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: ["I read a book yesterday.", "I am read a book yesterday.", "I readed a book yesterday."],
      answer: "I read a book yesterday.",
      explain: "read-ийн өнгөрсөн хэлбэр бичихдээ адилхан, харин \"рэд\" гэж дуудна.",
    },
  ],
};
