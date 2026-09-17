# StepUp video

Vertical 1080×1920 English quiz Reels, rendered with Remotion. Separate from the Next app: own `package.json` and `tsconfig`, excluded from the root build and lint.

The only paid step is the voice (OpenAI `gpt-4o-mini-tts`, roughly $0.002 per video). Pictures are hand-drawn SVGs, and eight of the eleven formats need no pictures at all.

## Setup

```bash
cd video
npm install
cp .env.example .env        # add OPENAI_API_KEY
```

## Text in, video out

```bash
npm run new fix-mistake my-mistakes     # start from a template → quizzes/my-mistakes.json
# …replace the example text…
npm run check my-mistakes               # free: catches mistakes before anything is bought
npm run preview my-mistakes             # free: two stills in out/preview/ to eyeball the layout
npm run make my-mistakes                # check → buy voice → render → out/my-mistakes.mp4
```

`make` also takes a JSON file from anywhere (`npm run make ~/Desktop/quiz.json` copies it into `quizzes/`), several quizzes at once (bundled once), `-- --all`, and `-- --force` to re-render a video that is already up to date.

What `make` does for you:

- **Stops before spending** if any quiz has an error (missing field, answer not among the options, a sentence that doesn't match its blank, IPA the font can't draw, the answer sitting in the same spot on every card…).
- **Never buys a clip twice.** A word or sentence already voiced in any quiz is copied, not bought. Up to 4 clips are bought at once; rate limits and server errors are retried. The quiz file is saved after every clip, so an interrupted run keeps what it paid for.
- **Skips videos that are already current.** A video is re-rendered only when its text, voice, pictures or the layout code are newer than the MP4. Note that any edit under `src/` makes every video count as changed.

**Rendering many at once.** All videos share one Chrome. On machines with 8 GB of RAM or less, only 2 frames render in parallel; set `RENDER_CONCURRENCY=4` for more. For long runs, render in batches (for example 6 per command) so each process frees its memory. A 100-video run in a single process was killed on an 8 GB Mac. An interrupted run is safe to repeat, because finished videos are skipped.

Lower-level steps: `npm run generate [slug…]` (voice only) and `npm run render [slug…]` (video only). `npm run studio` opens the live preview.

## Posting to Instagram + Facebook

Videos are published as Reels with the Meta Graph API. Meta Business Suite has no CLI.

### One-time setup

1. The Instagram account must be **professional** (business or creator) and linked to the Facebook Page (Business Suite → Settings → Linked accounts).
2. On developers.facebook.com, **create an app** of type *Business*, then in *App settings → Basic* copy the **App ID** and **App Secret**.
3. Open **Graph API Explorer**, choose the app, then *Get User Access Token* with these permissions: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`, `business_management`. Copy the token.
4. Add to `video/.env` (never commit it):
   ```
   META_APP_ID=…
   META_APP_SECRET=…
   META_USER_TOKEN=…
   ```
5. Run `npm run meta-setup`. It swaps the one-hour token for a Page token that doesn't expire, finds the Page and the Instagram account, and saves `META_PAGE_ID`, `META_IG_USER_ID` and `META_PAGE_TOKEN`. If you manage several Pages, it lists them; run it again with `-- --page="Name"`.

While the app stays in development mode, it can publish to accounts whose owner has a role on the app, which covers your own Page.

### Every day

```bash
npm run captions                 # caption for any new video + the posting order (posts/queue.txt)
npm run post -- --next=4         # dry run: shows the next 4 videos and their captions
npm run post -- --next=4 --yes   # publishes them to Instagram and Facebook
```

- Captions live in `captions/<slug>.txt`. Edit them freely; `captions` never overwrites an existing one. Their voice follows the `stepup-mongolian-copy` skill, and the ask matches the video's end card.
- `posts/queue.txt` alternates formats so the feed keeps changing. Reorder it however you like.
- `posts/log.json` records every post (id, time, link). A video is never posted twice to the same platform, so an interrupted run can be repeated.
- `post` refuses to go past Meta's 24-hour limits (Facebook Reels: 30, Instagram: 100).
- Post to one platform only with `--ig` or `--fb`, or post specific videos by name: `npm run post -- opposites-money --yes`.
- The Instagram API can't schedule posts, so run the daily command yourself (or from cron / launchd). Instagram needs up to a few minutes to process each video before it can be published.

## Formats

Set `"format"` in the quiz; `templates/<format>.json` has a working example of each. Every item needs `en` (what the voice says) and `mn` (Mongolian). `ipa` is optional. Leave `audio` as `null`.

| format | question on screen | per-item fields |
| --- | --- | --- |
| `picture` | Үүнийг англиар юу гэдэг вэ? | `en` word; picture at `public/img/<slug>/<word>.svg` |
| `fix-mistake` | Зөв нь аль нь вэ? | `en` correct sentence, `wrong` the mistake |
| `gap-fill` | Аль нь зөв бэ? | `sentence` with one `___`, `options` (correct first), `en` full sentence |
| `silent-letter` | Аль үсэг нь дуудагдахгүй вэ? | `en` word, `silentIndex` (0-based) |
| `word-stress` | Өргөлт хаана байна вэ? | `en`, `syllables` (must join to `en`), `stressIndex` |
| `opposites` | Эсрэг утгатай үг нь юу вэ? | `prompt` word shown, `en` its opposite |
| `odd-one-out` | Аль нь илүүц вэ? | `options` (3–4 words), `en` the odd one, `mn` why |
| `sound-pair` | Аль үгийг хэлсэн бэ? | `options` (2 words), `en` the one spoken, `hints` IPA per option |
| `unscramble` | Энэ ямар үг вэ? | `en` one word (3–10 letters); optional `image` to use as the clue |
| `where-is-it` | Бөмбөг хаана байна вэ? | `en` sentence, `answer` (on, under, above, next to, behind, in front of, in, between), `options` |
| `mini-dialogue` | Юу гэж хариулах вэ? | `prompt` what they say, `en` your reply |

Options are shown in a stable shuffled order, so the answer is never in the same slot on every card. Override the question with `"question"`. Pick colour with `"accent"` (`coral`, `sky`, `mint`, `sun`, `violet`) and style with `"look"` (`card`, `bold`, `night`, `editorial` — editorial applies to `picture` only).

For `picture`, draw one continuous outline per object and look at every drawing before rendering (`rsvg-convert -w 560 file.svg -o x.png`). If an object has no clear silhouette at icon size, pick a different word.

Mongolian text should read the way people actually write it — see the `stepup-mongolian-copy` skill.

## Layout

- `src/QuizCard.tsx` — one card: enter, 3-2-1 countdown, reveal, voice
- `src/formats.tsx`, `src/formats-more.tsx` — the card body for each format; `src/bodies.ts` maps format → body
- `src/order.ts` — shuffling rules shared with the checker
- `src/EndCard.tsx` — closing ask; `src/theme.ts` — colours, fonts, timing
- `scripts/lib.ts` — shared helpers and the checker
- `scripts/make.ts`, `generate.ts`, `render.ts`, `preview.ts`, `check.ts`, `new.ts`

Remotion is free for individuals and companies of up to 3 people; check its license before that changes.
