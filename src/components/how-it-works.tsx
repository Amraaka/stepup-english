// A real sequence — the numbers carry the order a newcomer follows.
const STEPS: [string, string][] = [
  ["Өдөр бүр жаахан хичээллэ", "5 минут ч хангалттай"],
  ["Явцаа бүртгэ", "Суусан цаг чинь оноо болно"],
  ["Streak-ээ хадгал", "Дараалсан өдөр бүр урам нэмнэ"],
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-h">
      <h2 id="how-h" className="sr-only">
        Хэрхэн ажилладаг вэ
      </h2>
      <ol className="flex flex-col gap-2.5">
        {STEPS.map(([title, body], i) => (
          <li key={title} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-a/12 text-[13px] font-extrabold text-coral-a-text">
              {i + 1}
            </span>
            <p className="text-sm leading-snug">
              <span className="font-bold">{title}.</span>{" "}
              <span className="text-muted">{body}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
