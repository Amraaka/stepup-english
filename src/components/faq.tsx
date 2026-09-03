const FAQS: [string, string][] = [
  [
    "Үнэгүй юу?",
    "Тийм — одоогоор бүх боломж үнэгүй. Хожим зарим AI боломжууд төлбөртэй болно.",
  ],
  [
    "Бүртгэлгүй ашиглаж болох уу?",
    "Болно. Гэхдээ түүх тань зөвхөн тухайн төхөөрөмжид хадгалагдана — бүртгүүлбэл хаанаас ч үргэлжилнэ.",
  ],
  [
    "Ямар түвшинд зориулагдсан бэ?",
    "Бүх түвшинд. Эхлээд түвшин тогтоох тест өгөөд, өөрт тохирсон агуулгаар хичээллэнэ.",
  ],
  [
    "Ямар төхөөрөмж дээр ажиллах вэ?",
    "Утас, компьютер аль алинд нь — ямар ч суулгалтгүйгээр browser дээрээ ашиглана.",
  ],
];

export function Faq() {
  return (
    <section aria-labelledby="faq-h" className="mx-auto w-full max-w-2xl">
      <h2 id="faq-h" className="text-lg font-extrabold tracking-tight">
        Түгээмэл асуулт
      </h2>
      <div className="mt-3 flex flex-col gap-2">
        {FAQS.map(([q, a]) => (
          <details
            key={q}
            className="group rounded-2xl border border-ink-400/15 px-4 open:border-coral-a/30 open:bg-coral-a/4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
              {q}
              <span
                aria-hidden
                className="text-lg font-medium text-muted transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-4 text-sm leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
