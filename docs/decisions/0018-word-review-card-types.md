# 0018 — Word review card types and the keyboard helper

Date: 2026-09-16
Status: Accepted. Step 3 of `docs/plans/skill-modules-integration.md` (V2, V4).

## Context

The word review (ADR 0010) had one card type: see the word, reveal the meaning, rate yourself "Санасан" or "Мартсан". Self-rating is easy to be generous with, and it never checks spelling or recognising the word by ear. The competitor study recommends typed answers (Duolingo, Clozemaster, Anki "type in the answer") and listen-and-pick cards, and names a daily annoyance for Mongolian learners: answering in English while the phone keyboard is still Cyrillic.

## Decision

### Card type follows the Leitner box
- `modeForBox` (`src/lib/vocab/review.ts`): box 0 → **flip** (unchanged, self-rated); box 1 → **listen**; box 2 and up → **type**. A new or forgotten word is always a flip card, and a word gets harder to answer as it moves up.
- Scheduling is unchanged: a correct listen or typed answer counts as "Санасан", a wrong one as "Мартсан" (`nextReview`, box 0 and due now). A card missed in a session comes back at the end of that session as a flip card.
- A word whose lemma has left the dictionary stays a flip card (listen and typed cards need the meaning).

### Listen card
- TTS says the word (it plays when the card appears and on the big button); the learner picks its Mongolian meaning from 4.
- Options are the first sense of each meaning (`shortMeaning`: text before ";"). Wrong options come from the learner's other saved words with the same part of speech first, then the dictionary, with no duplicate meanings. They are chosen on the server in `reviewQueue`, seeded by card id and local day, so a reload shows the same options.
- If three different wrong meanings can't be found, the card becomes a typed card.
- After answering, the card shows the word, its sentence (with clip audio when available) and the English note.

### Typed card
- Shows the part of speech, the Mongolian meaning and the saved sentence with the word blanked; the learner types the English word. "Сануулга" shows the first letter; "Мэдэхгүй байна" counts as wrong.
- `checkTypedWord` (`src/lib/vocab/answer.ts`) accepts the saved surface form or the lemma, using the grammar module's normalising (case, apostrophes, trailing punctuation, contractions). **Almost**: one edit (insert, delete, substitute or swap neighbours) in an answer of 5+ letters counts as remembered and shows the right spelling.

### Keyboard helper
- If the typed answer contains Cyrillic, it isn't graded. The card says the keyboard is on Cyrillic and offers what the input spells on an English keyboard ("«preside» гэж бичих гэсэн үү?"), which fills the box.
- `src/lib/text/keyboard.ts` converts with the Windows Mongolian Cyrillic layout (KBDMON), taken from its KLC file on kbdlayout.info, then the standard Russian ЙЦУКЕН layout. The guess that matches an accepted answer is offered first.
- A first reading of the layout through a page summary had the top row wrong (it put е on Q); the KLC file shows ф ц у ж э н г ш ү з к ъ on Q…], е and щ on the − and = keys.

### Amendments (2026-09-16)
- **Other layouts checked:** Unicode CLDR (release-42) publishes Mongolian layouts for Android (`keyboards/android/mn-t-k0-android.xml`) and ChromeOS (`keyboards/chromeos/mn-t-k0-chromeos.xml`). Their letter keys match the Windows mapping in `keyboard.ts` exactly. CLDR has no iOS or macOS Mongolian layout, so iOS is still unverified.
- **Audio on iOS:** iOS Safari only lets speech start inside a user tap. The listen card no longer speaks from an effect; `ReviewSession.answer` says the next listen card's word inside the tap that moves to it. A listen card that opens a session has no preceding tap, so the learner presses the big speaker button.

## Consequences

- Box 1 now means "heard and matched" and box 2+ "spelled from the meaning", so box labels on `/vocabulary` still read as progress.
- Phone keyboards: Android (Gboard-style) and ChromeOS match the helper; iOS layout not verified; the Russian fallback covers the other common layout.
- Cloze cards from Tatoeba (V3) can join as another mode for high boxes later.
