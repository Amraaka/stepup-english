import type { ReadingText, Sentence } from "@/lib/reading/types";
import type { ClipQuestion } from "@/lib/listening/types";
import { seeded, shuffle } from "@/lib/random";
import pearlBuck from "@/content/reading/pearl-buck.json";
import jackFrost from "@/content/reading/jack-frost.json";
import writingAGoodEmail from "@/content/reading/writing-a-good-email.json";
import gettysburg from "@/content/reading/gettysburg.json";
import reasonableLearningGoals from "@/content/reading/reasonable-learning-goals.json";

// The catalog lives in code, like listening clips (ADR 0009, 0017).
// Texts are VOA-produced (public domain; photos with agency credits are not used).
// Paragraphs come from scripts/reading/build_text.py; every word needs a dictionary entry
// (scripts/reading/coverage.ts). Headings, sign-offs and credits are left out of the text.

const VOA = "VOA Learning English";

export const TEXTS: ReadingText[] = [
  {
    slug: "pearl-buck",
    title: "Pearl S. Buck: The First American Woman to Win a Nobel Prize in Literature",
    summary: "Нобелийн шагнал хүртсэн анхны америк эмэгтэй зохиолч Перл Бакийн амьдрал.",
    level: "A2",
    source: {
      name: VOA,
      url: "https://learningenglish.voanews.com/a/pearl-s-buck-the-first-american-woman-to-win-a-nobel-prize-in-literature-/7980858.html",
      license: "public-domain",
      credit: "Jim Tedder, John Russell · VOA Learning English",
    },
    paragraphs: pearlBuck as Sentence[][],
    questions: [
      {
        prompt: "Where did Pearl Buck live for nearly 40 years?",
        options: ["In China", "In Virginia", "In New York"],
        answer: 0,
        explain: "Эхэд \"For nearly 40 years, China was her home\" гэж бичсэн.",
      },
      {
        prompt: "What is The Good Earth about?",
        options: ["A poor Chinese farmer and his wife", "An American college student", "A war in Pennsylvania"],
        answer: 0,
        explain: "The Good Earth бол Ван Лун хэмээх ядуу хятад эр, түүний эхнэр О-Ланы тухай роман.",
      },
      {
        prompt: "What did Buck win in 1938?",
        options: ["The Nobel Prize in Literature", "The Pulitzer Prize", "A farm in Pennsylvania"],
        answer: 0,
        explain: "1938 онд тэр Уран зохиолын Нобелийн шагнал хүртсэн. Пулитцерийн шагналыг 1932 онд авсан.",
      },
    ],
  },
  {
    slug: "jack-frost",
    title: "The Story of Jack Frost",
    summary: "Өвлийг хүн дүрээр төсөөлсөн Jack Frost хэллэг, өвлийн тухай ярианы хэллэгүүд.",
    level: "B1",
    source: {
      name: VOA,
      url: "https://learningenglish.voanews.com/a/the-story-of-jack-frost-/7932530.html",
      license: "public-domain",
      credit: "Anna Matteo · VOA Learning English",
    },
    paragraphs: jackFrost as Sentence[][],
    questions: [
      {
        prompt: "What does Jack Frost represent?",
        options: ["The coming of cold winter days", "A famous American poet", "A kind of warm coat"],
        answer: 0,
        explain: "Jack Frost нь хүйтэн, харанхуй өвлийн өдрүүд ирж байгааг илэрхийлдэг.",
      },
      {
        prompt: "What does “bundle up” mean?",
        options: ["Wear enough warm clothing", "Stay at home", "Call a taxi"],
        answer: 0,
        explain: "\"You should wear enough clothing to stay warm\" гэж тайлбарласан. Bundle up гэдэг нь дулаан хувцаслах.",
      },
      {
        prompt: "What happens at the end of the conversation?",
        options: [
          "The person going on a date agrees to wear the warm coat",
          "The person going on a date walks to the restaurant",
          "The taxi has an accident on the ice",
        ],
        answer: 0,
        explain: "\"You win! Give me your coat!\" гэж хэлээд дулаан хүрмийг өмсөхөөр зөвшөөрсөн.",
      },
    ],
  },
  {
    slug: "writing-a-good-email",
    title: "How to Write a Good Email",
    summary: "Имэйлийн гарчиг, мэндчилгээ, үндсэн хэсэг, төгсгөлийг хэрхэн сайн бичих вэ.",
    level: "B1",
    source: {
      name: VOA,
      url: "https://learningenglish.voanews.com/a/how-to-write-a-good-email/5649722.html",
      license: "public-domain",
      credit: "Gregory Stachel · VOA Learning English",
    },
    paragraphs: writingAGoodEmail as Sentence[][],
    questions: [
      {
        prompt: "Which part of an email does the receiver read first?",
        options: ["The subject line", "The closing", "The signature"],
        answer: 0,
        explain: "\"The subject line is what the other person, or receiver, will read first\" гэж бичсэн.",
      },
      {
        prompt: "How should you open a formal email when you know the person’s name?",
        options: ["Dear Mister Brown,", "Hello,", "Good Morning,"],
        answer: 0,
        explain: "Албан ёсны имэйлд хүний нэрийг мэдэж байвал \"Dear [title] [family name],\" гэж эхэлнэ.",
      },
      {
        prompt: "What should come first in the body of the email?",
        options: ["The most important information", "A long greeting", "Your signature"],
        answer: 0,
        explain: "\"The most important information should come first\". Чухал мэдээллээ эхэнд бичвэл хүлээн авагчийн цаг хэмнэнэ.",
      },
    ],
  },
  {
    slug: "gettysburg",
    title: "American Places – Gettysburg, Pennsylvania",
    summary: "АНУ-ын Иргэний дайны томоохон тулалдаан болсон Геттисбург хот, түүний музей.",
    level: "B1",
    source: {
      name: VOA,
      url: "https://learningenglish.voanews.com/a/american-places-gettysburg-pennsylvania/7965779.html",
      license: "public-domain",
      credit: "Nancy Steinbach, Ashley Thompson, Mario Ritter Jr. · VOA Learning English",
    },
    paragraphs: gettysburg as Sentence[][],
    questions: [
      {
        prompt: "When did the battle of Gettysburg begin?",
        options: ["July 1, 1863", "November 19, 1863", "July 3, 1865"],
        answer: 0,
        explain: "\"The battle of Gettysburg began on July 1, 1863\" гэж бичсэн.",
      },
      {
        prompt: "What is special about the cyclorama painting?",
        options: [
          "It completely surrounds the people looking at it",
          "It was painted by President Lincoln",
          "It shows a map of Washington, D.C.",
        ],
        answer: 0,
        explain: "Cyclorama бол үзэгчдийг бүх талаас нь тойрсон том зураг.",
      },
      {
        prompt: "How long did Lincoln speak at Gettysburg?",
        options: ["For just two minutes", "For two hours", "For three days"],
        answer: 0,
        explain: "\"Lincoln spoke for just two minutes\" гэж бичсэн. Энэ илтгэлийг \"The Gettysburg Address\" гэдэг.",
      },
    ],
  },
  {
    slug: "reasonable-learning-goals",
    title: "Start New Year by Setting Reasonable Learning Goals",
    summary: "Төрөлх хэлтэн шиг сонсогдох нь заавал биш: дуудлагадаа бодитой зорилго тавих нь.",
    level: "B2",
    source: {
      name: VOA,
      url: "https://learningenglish.voanews.com/a/start-the-new-year-by-setting-reasonable-learning-goals-/3637982.html",
      license: "public-domain",
      credit: "John Russell · VOA Learning English",
    },
    paragraphs: reasonableLearningGoals as Sentence[][],
    questions: [
      {
        prompt: "According to Eli Hinkel, why is it hard for adults to sound exactly like a native speaker?",
        options: [
          "The brain loses some ability to control the mouth muscles",
          "Adults do not study enough",
          "English sounds change every year",
        ],
        answer: 0,
        explain: "Хинкелийн хэлснээр бие өсөж дууссаны дараа тархи амны булчинг удирдах чадвараа хэсэгчлэн алддаг.",
      },
      {
        prompt: "What does Marla Yoshida call a reasonable goal?",
        options: ["Being understood easily", "Losing your accent in five lessons", "Sounding like a native speaker"],
        answer: 0,
        explain: "\"That's a reasonable goal: being understood easily\" гэж хэлсэн.",
      },
      {
        prompt: "What does the article suggest you do first?",
        options: [
          "Choose one or two difficult sounds and work on them",
          "Buy software that removes your accent",
          "Stop speaking your native language",
        ],
        answer: 0,
        explain: "Хэцүү нэг хоёр авиа сонгож, түүнийгээ сайжруулахаас эхлэхийг зөвлөсөн.",
      },
    ],
  },
];

export function getText(slug: string): ReadingText | null {
  return TEXTS.find((t) => t.slug === slug) ?? null;
}

/** Words in the text; a lone dash or ellipsis between words doesn't count. */
export function wordCount(text: ReadingText): number {
  return text.paragraphs.flat().reduce((n, sentence) => n + sentence.filter((t) => /[A-Za-z0-9]/.test(t)).length, 0);
}

/** The text's questions with options shuffled; the same seed gives the same order all day. */
export function shuffledQuestions(text: ReadingText, seed: string): ClipQuestion[] {
  const rand = seeded(seed);
  return text.questions.map((q) => {
    const order = shuffle(q.options.map((_, k) => k), rand);
    return { ...q, options: order.map((k) => q.options[k]), answer: order.indexOf(q.answer) };
  });
}

/** Estimated reading time at about 120 words a minute. */
export function readingMinutes(text: ReadingText): number {
  return Math.max(1, Math.round(wordCount(text) / 120));
}

/** Most seconds one tracker flush may claim for a text: three slow readings, at least 10 minutes. */
export function readingCapSec(text: ReadingText): number {
  return Math.max(600, readingMinutes(text) * 60 * 3);
}
