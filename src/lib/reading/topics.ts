// Reading topics (ADR 0021). Keep the ids in step with scripts/reading/build_text.py.

export const TOPICS = [
  { id: "daily-life", name: "Өдөр тутам", english: "Daily life" },
  { id: "food", name: "Хоол хүнс", english: "Food" },
  { id: "health", name: "Эрүүл мэнд", english: "Health" },
  { id: "work-money", name: "Ажил, мөнгө", english: "Work & money" },
  { id: "school", name: "Сургууль, суралцах", english: "School & learning" },
  { id: "travel", name: "Аялал, газар орон", english: "Travel & places" },
  { id: "nature", name: "Байгаль, амьтан", english: "Nature" },
  { id: "science", name: "Шинжлэх ухаан", english: "Science" },
  { id: "technology", name: "Технологи", english: "Technology" },
  { id: "history-people", name: "Түүх, хүмүүс", english: "History & people" },
  { id: "culture", name: "Соёл, урлаг", english: "Culture" },
  { id: "stories", name: "Өгүүллэг", english: "Stories" },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];

export function getTopic(id: string) {
  return TOPICS.find((t) => t.id === id) ?? null;
}
