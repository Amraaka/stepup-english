import type { Lesson } from "@/lib/grammar/types";

export const futureInThePast: Lesson = {
  slug: "future-in-the-past",
  title: "was going to / would",
  mn: "Өнгөрсөн дэх ирээдүй",
  level: "C1",
  summary: "Өнгөрсөн нэг мөчөөс харахад ирээдүйд болох байсан зүйлийг хэлнэ.",
  uses: [
    {
      title: "Биелээгүй төлөвлөгөө · was going to",
      body: "Хийхээр төлөвлөж байсан ч хийгээгүй зүйлийг хэлнэ.",
      examples: [
        { en: "I was going to call you, but my phone died.", mn: "Би чам руу залгах гэж байсан ч утасны цэнэг дуусчихсан." },
        {
          en: "We were going to travel to Europe, but we changed our plans.",
          mn: "Бид Европ руу аялах гэж байсан ч төлөвлөгөөгөө өөрчилсөн.",
        },
      ],
    },
    {
      title: "Хэлсэн, бодсон ирээдүй · would",
      body: "Өнгөрсөнд хэлсэн, бодсон ирээдүйн зүйлийг дамжуулахад will нь would болно.",
      examples: [
        { en: "She said she would help me.", mn: "Тэр надад туслана гэж хэлсэн." },
        { en: "I knew you would like this song.", mn: "Чамд энэ дуу таалагдана гэдгийг би мэдэж байсан." },
      ],
    },
    {
      title: "Өнгөрсөнд харагдаж байсан таамаглал",
      body: "Өнгөрсөн мөчид харагдаж байсан нотолгоонд тулгуурласан таамаглалыг хэлнэ.",
      examples: [{ en: "The sky was dark. It was going to rain.", mn: "Тэнгэр харанхуй байсан. Бороо орох гэж байлаа." }],
    },
  ],
  timeline: {
    marks: [
      { type: "arrow", from: -0.7, to: -0.2, label: "дараа нь болох" },
      { type: "dot", at: -0.7, label: "хэлсэн" },
    ],
    caption: "Өнгөрсөн нэг мөчөөс харахад ирээдүйд болох байсан үйл",
  },
  form: [
    { label: "Эерэг", pattern: "was / were going to + V · would + V", example: "I was going to tell you. He said he would come." },
    { label: "Үгүйсгэх", pattern: "wasn't / weren't going to + V · wouldn't + V", example: "I knew she wouldn't agree." },
    { label: "Асуух", pattern: "Were you going to + V? · Did he say he would + V?", example: "Were you going to leave without me?" },
  ],
  signals: ["but", "said that", "thought that", "knew that", "promised"],
  pitfalls: [
    {
      wrong: "She said she will call me.",
      right: "She said she would call me.",
      note: "Өнгөрсөнд хэлсэн үгийг дамжуулахад will нь would болно.",
    },
    {
      wrong: "I was going to calling you.",
      right: "I was going to call you.",
      note: "going to-гийн дараа үйл үг үндсэн хэлбэрээрээ байна.",
    },
    {
      wrong: "I would go to the party, but I felt sick.",
      right: "I was going to go to the party, but I felt sick.",
      note: "Биелээгүй төлөвлөгөөг was going to-гоор хэлнэ.",
    },
  ],
  exercises: [
    {
      kind: "choice",
      sentence: "I ___ visit my aunt yesterday, but it snowed heavily.",
      options: ["was going to", "am going to", "will", "would have"],
      answer: "was going to",
      explain: "Төлөвлөж байсан ч цас орсон тул биелээгүй: was going to.",
    },
    {
      kind: "choice",
      sentence: "He promised that he ___ be late again.",
      options: ["won't", "wouldn't", "doesn't", "isn't"],
      answer: "wouldn't",
      explain: "promised гэж өнгөрсөнд амласан тул won't нь wouldn't болно.",
    },
    {
      kind: "type",
      sentence: "We ___ a new car, but then prices went up.",
      hint: "buy",
      answers: ["were going to buy"],
      explain: "Биелээгүй төлөвлөгөө: were going to buy.",
    },
    {
      kind: "pick",
      prompt: "Аль өгүүлбэр зөв бэ?",
      options: ["She told me she will help.", "She told me she would help.", "She told me she would helps."],
      answer: "She told me she would help.",
      explain: "told гэж өнгөрсөнд хэлсэн тул would + V.",
    },
    {
      kind: "choice",
      sentence: "I knew you ___ this gift. You always wanted one!",
      options: ["will love", "would love", "love", "are loving"],
      answer: "would love",
      explain: "knew гэж өнгөрсөнд бодож байсан ирээдүй тул would love.",
    },
    {
      kind: "type",
      sentence: "They ___ to the concert, but the tickets sold out.",
      hint: "go",
      answers: ["were going to go"],
      explain: "Тасалбар дууссан тул биелээгүй: were going to go.",
    },
    {
      kind: "choice",
      sentence: "The clouds were very dark. It ___ rain.",
      options: ["is going to", "was going to", "will", "would to"],
      answer: "was going to",
      explain: "Өнгөрсөнд харагдаж байсан нотолгоонд тулгуурласан таамаглал.",
    },
    {
      kind: "pick",
      prompt: "\"Би чамд хэлэх гэж байсан, гэхдээ мартчихсан\" гэдгийг аль нь зөв хэлсэн бэ?",
      options: ["I will tell you, but I forgot.", "I was going to tell you, but I forgot.", "I would told you, but I forgot."],
      answer: "I was going to tell you, but I forgot.",
      explain: "Биелээгүй санаа тул was going to tell.",
    },
  ],
};
