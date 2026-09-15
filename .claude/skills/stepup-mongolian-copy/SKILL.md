---
name: stepup-mongolian-copy
description: Writes and checks all Mongolian copy for StepUp English social content — post and poster headlines, tag pills, footers, quiz instructions, captions, Story text, bio. Use when creating or editing any StepUp post/poster/caption, or when reviewing Mongolian text that may read like a translation, like a robot, or use words Mongolians don't say.
---

# StepUp Mongolian copy

Every Mongolian line — on the image and in the caption — must be something a fluent young Ulaanbaatar person would actually say or type. The owner rejected many lines that were grammatical but sounded translated. This skill is the acceptance test for posts (`post/<date>/*.html`), posters, and `captions.md`.

## 1. The core test

Read each Mongolian line aloud. Ask: *would a Mongolian say this sentence to a friend, or write it in a normal Facebook post?* If it's a clever phrase that only makes sense once translated back to English, rewrite it plainly. **Plain and clear beats clever.**

Rejected → accepted (real corrections from the owner):

| Rejected (robotic / calque / unclear) | Accepted |
| --- | --- |
| Ингэж хэлбэл англи чинь огт өөр сонсогдоно | Аль үг нь илүү таалагдаж байна? |
| Аль нь вэ, in, on, at? Тавыг нь бөглөөд үзье | Доорх сонголтоос аль нь зөв бэ? |
| Таван хариугаа коммент дээр бичээрэй | Хариултаа коммент хэсэгт үлдээгээрэй |
| Ресторанд ороод гацахгүй найман өгүүлбэр | Ресторанд хэрэглэгддэг энгийн үгс — ресторанд орохоосоо өмнө цээжлээрэй |
| very-гээ хаяад нэг үгээр хэл | "Very"-гийн оронд эдгээр үгийг хэрэглээрэй |
| Найз чинь бичихэд Nothing гээд л байх уу? | Үргэлж "Nothing" гэж хариулсаар л байх уу? |
| Уучлалт гуйхад sorry ганцаараа биш | Sorry гэхийн оронд эдгээр үгийг хэрэглээрэй |
| Хүн чамаас өдөр бүр асуудаг 20 асуулт | Өдөр тутамд хэрэглэгддэг 20 асуулт |
| Дэлгүүрт хэрэгтэй 6 өгүүлбэр | Дэлгүүрт хэрэглэгддэг 6 өгүүлбэр |
| Сурах бичгийн англиа ярианы англи болгоё | Ярианы англи хэлээ сайжруулцгаая |
| Хамгийн жижиг үг л чамайг барьж унагадаг | Доорх өгүүлбэрт аль нь илүү тохирох вэ? |
| "I think"-ээ түр амраацгаая | "I think"-ийн оронд доорх үгсийг хэрэглэе |
| Дүрэмд ордоггүй, цээжлэх л 20 үйл үг | Дүрмийн бус 20 үйл үг |
| Мэдэхгүй ээ гэхийн 8 өөр арга | "Мэдэхгүй" гэхийн оронд хэрэглэх 8 үг |
| Тусламж гуйх 7 шат | Тусламж хүсэх 7 хэлц үг |
| Кофе захиалах яриа | Кофе хэрхэн захиалах вэ? |
| Баяртай гэхийн 8 өөр арга | "Баяртай"-г 8 өөрөөр хэлэх арга |

## 2. Rules for on-image copy

**Headlines**
- Say what the post *is*, directly: `X-ийн оронд эдгээр үгийг хэрэглээрэй`, `[газар]-т хэрэглэгддэг N өгүүлбэр`, `"X"-г N өөрөөр хэлэх арга`, `X хэрхэн [үйл] вэ?`, `Дүрмийн бус 20 үйл үг`.
- Tips are framed as friendly advice: `...оронд ...хэрэглээрэй`, `...цээжлээрэй`, `...сайжруулцгаая`.
- No metaphors that don't exist in Mongolian: шат (for formality levels), солиулга, амраах, барьж унагах, гацахгүй, "англи чинь" (drop of "хэл").
- Don't drop words Mongolian needs: `англи хэл`, not `англи`, when you mean the language.
- Prefer standard grammar terms learners know: дүрмийн бус үйл үг, хэлц үг, өгүүлбэр, үг.

**Tag pills / small labels**
- Only words a Mongolian reader understands instantly. If there is no natural Mongolian word, use a short English label (`VOCABULARY`, `QUIZ`) or drop the pill. Never invent a term (`8 СОЛИУЛГА`, `ФОРМАЛ ШАТ`).
- Don't repeat a count the headline already gives.

**Quiz / exercise instructions**
- Ask a clear question the reader can answer from the image: `Доорх сонголтоос аль нь зөв бэ?`, `Доорх өгүүлбэрт аль нь илүү тохирох вэ?`
- The answer ask is always: `Хариултаа коммент хэсэгт үлдээгээрэй` (or `Зөв өгүүлбэрийг коммент хэсэгт үлдээгээрэй`). Use **үлдээгээрэй / коммент хэсэгт**, not `коммент дээр бичээрэй`, `A B C гэж коммент`.
- Don't promise answers on Story or "tomorrow" — the owner may not post them. Remove `Хариуг маргааш Story дээр`.

**List-post footers** (vocab, phrases)
- Invite a personal choice in human words: `Чи алийг нь илүү их хэрэглэх вэ?`, `Чи алийг нь хэрэглэдэг вэ?`, `Аль нь илүү таалагдаж байна?`
- Not `Чи аль шатнаас нь эхлэх вэ?` or anything tied to a metaphor.

**Games (Wordle etc.)**
- Must be solvable and self-explanatory for someone who has never played. Verify every tile colour against the answer letter by letter (green = right letter right spot, yellow = in the word elsewhere, grey = not in the word; handle repeated letters like real Wordle). Show a one-line rule and a legend in plain Mongolian, and make the hint actually point to the answer.

**Content choices**
- Prefer knowledge/vocabulary posts over challenges, countdowns or promises the account must keep (no "30 хоногийн challenge", "маргааш эхэлнэ").
- Every English line must be something a native speaker actually says.

**Layout checks tied to copy**
- Nothing may overlap the header logo/handle or the footer (watch coloured banners/components pushed up into `.hd`).
- Headline ≤ 2 lines; Cyrillic sets wide.

## 3. Captions (voice)

The voice is a fluent young UB person talking to a friend about English (calibrated on @rinco_ed and @colorenglish.mn).

- **Register — ярианы хэл.** Converbs (гэчихээд, хэлчихдэг), particles (шүү, шүү дээ, биз, л даа), soft imperatives (-цгаая, -аарай, -ъё).
- **Address: чи / чамайг / чинь / найз минь.** `Та` only in announcements to everyone.
- **Shape:** one paragraph, 3–6 sentences. (1) hook the reader recognises; (2) why the mistake happens — usually `монголоор ингэж хэлдэг болохоор тэр`; (3) the English inside the sentence; (4) one ask (коммент хэсэгт үлдээгээрэй / хадгал / найздаа явуул); (5) hashtags on the last line, 4–7, mixed.
- **Punctuation:** keyboard only — . , ? : and plain `"`. No bullets, em-dashes, «», arrows. Lists become running sentences (`... гэхэд you're welcome, ... гэхэд no worries гэнэ`).
- **Emoji:** one or two, at sentence ends, carrying a feeling (😅 👀 ✨ 👇).
- The caption's ask must match the image's ask (quiz → answers in comments; list → which one you'd use). No Story-answer promises.

Before (machine) → after (person):

> «Зүгээр» гэчихээд англиар гацаж байсан уу? Тэр мөчид тархи хоосорч байгаа юм биш — ... • Талархахад → You're welcome ... Та өнөөдөр аль нь хамгийн их хэрэгтэй байсан бэ?

> Зүгээр гэчихээд англиар нь юу гэхээ мэдэхгүй гацаж байсан уу? 😅 Монголоор нэг үгээр л шийдчихдэг юмыг англиар нөхцөл бүрд өөр өөрөөр хэлдэг болохоор тэр. Баярлалаа гэхэд you're welcome, уучлаарай гэхэд no worries гэнэ. Чи алийг нь илүү их хэрэглэдэг вэ, коммент хэсэгт үлдээгээрэй 👇

## 4. Self-check before shipping

For every post, go line by line through the image text and the caption:

1. Would a Mongolian say this? Any calque, invented term, or metaphor from §1–2? → rewrite plainly.
2. Headline states what the post is; tag pill is instantly understood or removed.
3. Quiz: clear question + `коммент хэсэгт үлдээгээрэй`; no Story/tomorrow promises.
4. List: footer invites a personal choice.
5. Game: every tile verified, rule explained.
6. Caption: чи, one paragraph, one ask matching the image, ≤2 emoji, keyboard punctuation, hashtags last.
7. Rendered PNG: nothing overlaps logo/footer, headline ≤ 2 lines, nothing clipped.
