# Skill modules: competitor study (vocabulary, speaking, writing, reading)

Date checked: 2026-09-15
Scope: what similar products offer in their vocabulary, speaking, writing and reading modules, and what StepUp English should add to each, building on what the repo already has. Primary sources only: official product pages, help centres, pricing pages, company blogs, papers, API docs and GitHub. **Prices and features change often; re-check before quoting them. This is not legal advice.**

Legend: **[V]** = verified on the cited owner's page. **[S]** = seen only in a search-engine snippet of the owner's page, because the page blocked the fetcher (403, 404 or did not render). Re-check before relying on it. **[U]** = could not verify. **[I]** = our inference or recommendation.

Access notes: every quizlet.com page returned 403, so all Quizlet rows are [S]. The Babbel pricing and help pages, Busuu help articles, coe.int (CEFR descriptor pages), the Cambridge Dictionary licence page and MDN's `processLocally` page returned 403 or did not load. Current Duolingo Max, Memrise, ELSA, Busuu, Babbel and Write & Improve add-on prices could not be read on an owner's page.

Rating keys used in the recommendation tables:
- **Value (MN)**: High / Medium / Low value for Mongolian adult learners, with the reason.
- **Effort**: S = a few days, M = one to two weeks, L = several weeks, for one developer. [I]
- **Tier**: Free / Paid. **Needs**: AI, audio, licensed content (or none).

---

## 1. Summary: top recommendations per module

**Vocabulary** (exists: saved words from listening, Leitner review)
1. Level-based word lists from NGSL (CC BY-SA) with pre-written Mongolian meanings, so learners can study words without first finding them in a clip.
2. More ways to answer each card: type the word, cloze sentence (Tatoeba), listen and pick. Keep the two-button flow as the default.
3. One "words from everywhere" inbox: words saved from reading, grammar and writing feedback all feed the same `saved_words` review.
4. Later, swap Leitner for FSRS (ts-fsrs, MIT) behind the same two buttons, once there are enough review logs.
5. A "hard words" list built from "Мартсан" counts (like Duolingo's Mistakes tab).

**Speaking** (exists: shadowing inside listening; Azure scoring built but off)
1. A real `/speaking` page that gathers shadowing sessions and shows speaking minutes, instead of "coming soon".
2. Short phrase drills ("everyday phrases") with record, replay and compare. Free, no AI, reusing the shadowing code.
3. Turn on Azure pronunciation scoring as the first paid speaking feature, with a daily cap. It costs about $1 per audio hour and Azure does not store real-time audio.
4. Sound drills aimed at Mongolian speakers (θ/ð, w/v, r/l, iː/ɪ, word-final consonants), driven by the tips `feedback.ts` already gives.
5. AI roleplay conversation last: it is the most expensive feature (OpenAI Realtime audio output costs $64 per 1M tokens) and needs a consent decision for teens.

**Writing** (does not exist)
1. Daily short prompts by level (A1: 3 sentences; B1: 80–120 words), free, with self-check lists. No AI needed.
2. Paid AI feedback with Mongolian explanations: small edits shown next to the original, grouped by error type, capped per day. This is the product vision's first paid feature.
3. Errors shown in stages, and resubmitting to see progress on the same task (the Write & Improve model).
4. Mistakes feed the existing grammar review and the vocabulary review ("Mistake Repair" style).
5. Always label any level as an estimate; never present it as an IELTS band or official CEFR result.

**Reading** (does not exist)
1. A tap-to-translate reader built from the listening word sheet, with pre-written Mongolian glosses (not a live API call per tap).
2. A first library of levelled texts from VOA Learning English (public domain) and Standard Ebooks (CC0), plus StepUp's own simplified versions.
3. Word colours for new, saved and known words, and a known-word count that feeds the tracker (the LingQ model).
4. Short comprehension questions after each text, reusing the listening practice components.
5. A side-by-side Mongolian translation toggle for A1–A2 texts (the Beelinguapp model), hidden by default at higher levels.

---

## 2. What StepUp has today (read from the repo on 2026-09-15)

| Module | Route / code | What it does | Status |
|---|---|---|---|
| Vocabulary | `/vocabulary`, `/vocabulary/review`, `src/lib/vocab/`, `src/components/vocabulary/review-session.tsx` | Words saved from the listening word sheet go to `saved_words` (one row per learner and lemma, with the sentence and clip source). The review uses Leitner boxes 0–6 (1, 3, 7, 14, 30, 60 days) and two buttons, "Санасан" and "Мартсан". The limit is 20 cards a day. The card front shows the word, TTS (`speechSynthesis`) and the sentence; the meaning is revealed on tap. Clip audio plays when the source clip exists. Review time is logged to the tracker. See ADR 0010 and 0011. | Live |
| Vocabulary data | `src/content/listening/glossary.json` | About 300 lemmas with part of speech, a Mongolian meaning and sometimes an easy English note or phrase, plus a form→lemma map. They come from the two current clips only. | Small |
| Vocabulary gaps | — | No level or topic word lists, no way to add a word by hand, no typed or cloze answers, only words from listening. | Missing |
| Speaking | `/speaking` | Generic "coming soon" skill page. The planned items listed in `src/lib/skills.ts` are sound drills, compare your recording, and everyday phrases. | Placeholder |
| Speaking (inside listening) | `/listening/[slug]/shadowing`, `src/lib/pronunciation/`, `src/components/listening/shadowing-session.tsx`, `pronunciation-panel.tsx` | Shadowing sentence by sentence: record (capped), play the original and your own take, then listen to both one after the other. It compares loudness shape and duration and gives a pace hint without AI. Recordings stay in the browser. Time logs as `module: "speaking"`. Azure pronunciation assessment with Mongolian rule-based tips (θ/ð, w, v, r, l, iː/ɪ, æ, final consonants, fluency) is built but switched off until a key and paid access exist. See ADR 0011. | Live / AI off |
| Writing | `/writing` | "Coming soon" page. Planned items: a daily topic, AI correction explained in Mongolian, and comparing with earlier texts. | Does not exist |
| Reading | `/reading` | "Coming soon" page. Planned items: short levelled texts and books, tap a word to translate and add it to vocabulary, comprehension questions. | Does not exist |
| Reusable parts | `src/components/listening/word-sheet.tsx`, `practice-session.tsx`; `src/lib/grammar/` (progress, Leitner mistake review, Tatoeba item bank); `src/lib/activity.ts` | The word sheet (tap → meaning → save), question, gap-fill and dictation practice, a Leitner mistake review for grammar (ADR 0013), a Tatoeba sentence bank with attribution (ADR 0014), and the activity-event log that feeds points and streaks (ADR 0005). | Live |

---

## 3. Vocabulary

### 3.1 What competitors do

| Platform | Feature | How it works | Source | Tag |
|---|---|---|---|---|
| Duolingo | Half-life regression (HLR) | Predicts how long a word stays in memory. The paper reports 45%+ lower error than baselines and +12% daily engagement in a live test (Settles & Meeder, ACL 2016). | https://research.duolingo.com/papers/settles.acl16.pdf | [V] |
| Duolingo | HLR code | MIT-licensed code with baselines; 13M learning traces published. | https://github.com/duolingo/halflife-regression | [V] |
| Duolingo | Birdbrain | Models learner ability and exercise difficulty, guesses whether the learner will get an exercise right, and builds sessions "at just the right difficulty level" (2020 post). | https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain/ | [V] |
| Duolingo | Practice Hub: Words and Mistakes | "Study recommended words" and "Review previous mistakes". Free (post dated 2026-02-18). | https://blog.duolingo.com/guide-to-duolingo-practice-hub/ | [V] |
| Duolingo | Explain My Answer | AI explanation of a mistake, tailored to the native language. Free for everyone since 2026-01-01. The listed courses do not include English for speakers of other languages. | https://blog.duolingo.com/explain-my-answer-now-free/ | [V] |
| Anki | Notes, fields, cards, decks | A note holds fields and can make several cards; decks have their own daily limits. | https://docs.ankiweb.net/getting-started.html | [V] |
| Anki | Cloze note type | `{{c1::word}}` hides a word; several cloze numbers make several cards. | https://docs.ankiweb.net/editing.html | [V] |
| Anki | FSRS scheduler | Alternative to SM-2; "desired retention" defaults to 90%; an optimizer learns parameters from the user's reviews. | https://docs.ankiweb.net/deck-options.html | [V] |
| Anki | Four answer buttons and daily limits | Again, Hard, Good, Easy; separate limits for new cards and reviews. | https://docs.ankiweb.net/deck-options.html | [V] |
| Anki | Pricing | Desktop, AnkiWeb and AnkiDroid free; AnkiMobile US$24.99 one-time. | https://apps.ankiweb.net/ ; https://apps.apple.com/us/app/ankimobile-flashcards/id373493387 | [V] |
| FSRS | ts-fsrs | TypeScript FSRS v6, MIT licence; `createEmptyCard()`, `next(card, now, Rating)`. | https://github.com/open-spaced-repetition/ts-fsrs | [V] |
| FSRS | srs-benchmark | About 727M reviews from about 10k Anki users. FSRS-6 RMSE(bins) 0.0653 vs HLR 0.1275. No Leitner or SM-2 row was seen. | https://github.com/open-spaced-repetition/srs-benchmark | [V] (numbers) |
| Quizlet | Learn mode | Adaptive; "tracks what terms you struggled with and drills you until you know them". | https://quizlet.com/features/learn | [S] |
| Quizlet | Plus | Learn and Test are Plus features. A snippet gives Plus at $35.99/year with 20 Learn rounds and 3 practice tests a month. | https://help.quizlet.com/hc/en-us/articles/360030986971-Studying-with-Learn ; https://quizlet.com/upgrade | [S] |
| Quizlet | AI study tools | Upload notes to get flashcards, outlines and practice tests. | https://quizlet.com/features/ai-study-tools | [S] |
| Memrise | Native-speaker clips | Short videos of locals using a word, on word screens and in activities. | https://explore.memrise.com/help ; https://www.memrise.com/ | [V] |
| Memrise | Review schedule | Fixed intervals: 4h, 12h, 24h, 6d, 12d, 48d, 96d, 6 months. | https://explore.memrise.com/help | [V] |
| Memrise | MemBot | GPT-powered chat partner; conversations cannot be saved. | https://explore.memrise.com/help | [V] |
| Memrise | Pricing | Monthly, annual and lifetime plans exist; 2026 price not readable. | https://explore.memrise.com/help | [V] plan types, [U] price |
| Clozemaster | Cloze sentences | Real sentences with one missing word, multiple choice or typed, reviewed later; tracks word frequency. | https://www.clozemaster.com/ | [V] |
| Lingvist | Frequency first | Teaches most common words first, each with an example sentence; AI placement. | https://lingvist.com/ | [V] |
| Lingvist | Custom Decks | Turns any words or text into a course; paid plans. | https://lingvist.com/pricing/ | [V] |
| NGSL project | Open word lists | NGSL 2,809 words (about 92% coverage), plus academic (NAWL), business (BSL) and TOEIC (TSL) lists. CC BY-SA 4.0 with attribution; commercial use allowed. | https://www.newgeneralservicelist.com/new-general-service-list | [V] |
| Cambridge | English Vocabulary Profile | CEFR A1–C2 levels for about 7,000 headwords; licensing by request or API. | https://dictionary.cambridge.org/license.html | [S] |

### 3.2 Recommended features

| # | Feature | Builds on | Value (MN) | Effort | Tier | Needs |
|---|---|---|---|---|---|---|
| V1 | **NGSL level lists** (start with the top 500 words, split into sets of 20) with Mongolian meanings written ahead of time and a TTS button. "Add to my review" adds a set to `saved_words` with `source: {list, set}`. | `saved_words`, glossary format, review session | High: learners who start from zero have no clip words yet; Mongolian meanings are rare in open lists | M (mostly content: Mongolian meanings need review) | Free | Licensed content (CC BY-SA attribution) |
| V2 | **Typed answer card**: show the Mongolian meaning, the learner types the English word. Accept small typos, and detect text typed on the Mongolian Cyrillic layout (e.g. "ыщ" for "so") with a hint to switch keyboard. | Review session | High: spelling is weak when learning mainly by ear; the keyboard switch is a daily annoyance on phones | S | Free | None |
| V3 | **Cloze card from a Tatoeba sentence** (CC BY / CC0, filtered by license as in ADR 0014), showing the attribution line. | Tatoeba bank pipeline in `scripts/grammar/` | Medium–High: shows the word in a second context | M | Free | Licensed content (attribution) |
| V4 | **Listen and pick card** (TTS or clip audio → choose the word) | Clip audio on cards (ADR 0011) | Medium: trains listening for known words | S | Free | Audio (TTS) |
| V5 | **Hard words list**: words forgotten 3+ times, with a mini-session | `box`, `last_reviewed_at` (needs a lapse counter column) | Medium | S | Free | None |
| V6 | **Manual add** of a word (type the English word, pick a meaning from the glossary if present, else write your own) | `saved_words` | Medium: lets learners bring words from class or work | S | Free | None |
| V7 | **FSRS scheduling** behind the same two buttons (map "Санасан" → Good, "Мартсан" → Again), keeping the daily cap | `box` / `due_at` columns; add stability and difficulty | Medium: fewer wasted reviews; invisible to learners | M | Free | None (ts-fsrs, MIT) |
| V8 | **AI example sentences and "explain in this sentence"**, generated once per lemma and sense and cached, reviewed before they become shared content | Glossary | Medium | M | Paid (or small free quota) | AI |
| V9 | **Word challenge** ("500 words in a week", from the product vision) using NGSL sets and the tracker | V1, activity events | Medium–High: fits the competitions idea | M | Free | None |

### 3.3 Pitfalls

- **Share-alike:** a list derived from NGSL is likely CC BY-SA too. Keep Mongolian meanings as a separate dataset keyed by lemma if StepUp doesn't want them under share-alike, and credit "New General Service List by Browne, C., Culligan, B., and Phillips, J." (https://www.newgeneralservicelist.com/new-general-service-list) [V] [I].
- **Cambridge CEFR word levels** are not openly licensed, and Cambridge terms forbid using its materials to train AI (see `grammar-tenses-sources.md`, source 27). Don't copy EVP levels [S].
- **Anki shared decks** have unknown licences; don't import them [I].
- **Algorithm switch:** ADR 0010 chose Leitner for simplicity. Move to FSRS only after logging each review (rating, time, interval), which FSRS needs to fit parameters. Start logging now so the data exists [I].
- **AI cost:** generate per lemma once and cache; Duolingo ran Explain My Answer as a paid feature for about three years before making it free (https://blog.duolingo.com/explain-my-answer-now-free/) [V] [I].

---

## 4. Speaking

### 4.1 What competitors do

| Platform | Feature | How it works | Source | Tag |
|---|---|---|---|---|
| ELSA Speak | Pronunciation scoring | AI feedback with sound-by-sound detail. | https://elsaspeak.com/en/ | [V] |
| ELSA Speak | AI role-play | Workplace, interview, meeting and presentation scenarios with instant feedback. | https://elsaspeak.com/en/ | [V] |
| ELSA Speak | Bilingual tutor | Beginners can start in their native language. | https://elsaspeak.com/en/ | [V] |
| ELSA Speak | Placement and scores | Quick test; scores mapped to CEFR, IELTS and TOEIC. | https://elsaspeak.com/en/ | [V] |
| ELSA Speech Analyzer | Unscripted speech feedback | Scores pronunciation, intonation, fluency, grammar and vocabulary; flags fillers and hesitation. | https://elsaspeak.com/en/speech-analyzer | [V] |
| ELSA | Plans | ELSA Pro and ELSA Premium (adds a 1:1 AI tutor), 7-day trial. Prices only in snippets (Pro $29.99/year promo). | https://elsaspeak.com/en/elsa-shop | [V] names, [S] prices |
| ELSA | Privacy | Collects audio and video recordings; stores data in several countries; keeps it "as long as we deem it as reasonably necessary"; users must be 16+. | https://elsaspeak.com/en/privacy/ | [V] |
| Speak | AI tutor | Back-and-forth conversation with real-time feedback on pronunciation and phrasing. | https://www.speak.com/ | [V] |
| Speak | Live Roleplays | Speech-to-speech on OpenAI's Realtime API with goals, hints and difficulty from Speak's "proficiency graph". | https://www.speak.com/blog/live-roleplays | [V] |
| Speak | Speech recognition | Uses OpenAI Whisper; cites better handling of accented and mixed-language speech. | https://www.speak.com/blog/speak-openai-speech-recognition | [V] |
| Speak | Plans | Premium vs Premium Plus (unlimited custom and tutor lessons, study plan, practice on frequent mistakes); prices vary by region. | https://help.speak.com/en/articles/5358417-what-s-the-difference-between-premium-and-premium-plus | [V] |
| Speak | Privacy | Uses audio to improve speech recognition; shares audio with OpenAI and Microsoft; not for under-13s. | https://www.speak.com/privacy | [V] |
| Cake | Short clips and AI coach | Lessons from real media clips, daily expression clips; record and get accent feedback. Free with ads and "hearts"; Cake Plus $13.99/month (US App Store). | https://apps.apple.com/us/app/cake-learn-english-korean/id1350420987 | [V] |
| Duolingo Max | Video Call | Real-time AI call with a character, about 1–3 minutes by level; Max only. | https://blog.duolingo.com/video-call/ | [V] |
| Duolingo Max | Roleplay | GPT-4 scenario chat, then feedback on accuracy and complexity; scenarios written by people. | https://blog.duolingo.com/duolingo-max/ | [V] |
| Praktika | AI avatar tutors | Free conversation; can start in native language; feedback strictness is soft, balanced or strict; "approximately $8 per month"; terms require 18+. | https://praktika.ai/ ; https://praktika.ai/terms | [V] |
| Azure AI Speech | Pronunciation assessment | Scripted and unscripted modes; accuracy, fluency, completeness, prosody, miscues; per word, syllable and sound. Content and prosody scores en-US only. | https://learn.microsoft.com/en-us/azure/ai-services/speech-service/pronunciation-assessment-tool | [V] |
| Azure AI Speech | Price | Billed as standard speech to text: $1.00 per audio hour (East US retail price API); free tier 5 audio hours a month. | https://prices.azure.com/api/retail/prices ; https://azure.microsoft.com/en-us/pricing/details/speech/ | [V] |
| Azure AI Speech | Data | Real-time audio "processed only on the Azure's server memory, and no data is stored at rest"; the customer handles consent if audio counts as biometric data. | https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/speech-service/speech-to-text/data-privacy-security | [V] |
| Azure AI Speech | Mongolian | `mn-MN` speech to text and two Mongolian TTS voices. | https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support | [V] |
| SpeechSuper | Scoring API | Sentence, word and sound scores, stress, linking, IELTS speaking. Pay as you go with a $20/month minimum; sentence $0.006, unscripted $0.030–0.035 per request. | https://www.speechsuper.com/pricing.html | [V] |
| OpenAI API | Realtime and transcription | gpt-realtime audio $32 in / $64 out per 1M tokens (mini $10 / $20); gpt-4o-mini-transcribe about $0.003/min. API data not used for training by default; abuse logs up to 30 days. | https://developers.openai.com/api/docs/pricing ; https://developers.openai.com/api/docs/guides/your-data | [V] |
| Browsers | Web Speech `SpeechRecognition` | Chrome and Edge supported, Safari with prefix, Firefox behind an off-by-default setting. Returns text only. | https://github.com/mdn/browser-compat-data/blob/main/api/SpeechRecognition.json | [V] |

### 4.2 Recommended features

| # | Feature | Builds on | Value (MN) | Effort | Tier | Needs |
|---|---|---|---|---|---|---|
| S1 | **`/speaking` hub**: list of shadowing clips, speaking minutes this week, "continue shadowing" | Shadowing route, activity events | Medium: makes existing work visible; removes a "coming soon" page | S | Free | None |
| S2 | **Everyday phrase drills** (greetings, work, shopping, travel), 10 phrases per set, record / replay / listen to both, with Mongolian meaning. Audio from TTS or StepUp's own recordings. | `shadowing-session.tsx`, `use-recorder.ts` | High: adults need usable phrases first; no network cost | M (content) | Free | Audio (TTS or own recordings) |
| S3 | **Sound drills for Mongolian speakers**: minimal pairs (think/sink, vine/wine, light/right, ship/sheep, bed/bad) with listen-and-choose and record-and-compare | `feedback.ts` tip categories | High: targets the sounds the existing tips already name | M | Free | Audio |
| S4 | **Switch on Azure scoring** for shadowing and phrase drills (paid, daily cap such as 30 takes), following ADR 0011's checklist | `src/lib/pronunciation/azure.ts` | High: phoneme-level feedback in Mongolian is rare | S (code done; paid access is the work) | Paid | AI, audio |
| S5 | **"Did you say it?" check** with browser speech recognition where supported, as a free fallback, labelled as not a pronunciation score | Phrase drills | Low–Medium: patchy support; Chrome may send audio to a remote service | S | Free | None |
| S6 | **Answer a question aloud**: a short unscripted prompt ("Describe your job in 30 seconds"), learner records; free version is self-review, paid version uses Azure unscripted mode (content scores en-US only) | S4 | Medium–High for exam and job goals | M | Paid (AI) | AI, audio |
| S7 | **AI roleplay conversation** (job interview, hotel, meeting) with a written transcript and Mongolian tips afterwards | S4, S6 | Medium: attractive, but expensive and needs stable connections | L | Paid | AI, audio |

### 4.3 Pitfalls

- **Cost:** a 10-second Azure take is about $0.003 at $1/hour; SpeechSuper is $0.006 per sentence with a $20 monthly minimum [V] [I]. Real-time conversation is an order of magnitude more expensive, so it needs a paid tier and hard daily limits [I].
- **Voice privacy:** keep the current rule (recordings stay in the browser unless the learner asks for scoring). Azure real-time processing stores nothing at rest, but Azure says audio may be biometric data and the customer must handle notice, consent and deletion [V]. Speak uses recordings to improve its models and ELSA keeps data open-ended [V]; not doing so is a selling point [I].
- **Teens:** StepUp includes teens. Competitors set minimum ages of 13+ (Speak), 16+ (ELSA) and 18+ (Praktika) [V]. Decide on parental consent before sending any under-18 voice to a provider, and update the privacy policy [I].
- **Accent:** Azure content and prosody scores are en-US only; learners aiming at British English may be scored against US norms [V] [I].
- **Low bandwidth:** upload only the one take being scored (16 kHz mono WAV, as today), never a whole session [I].
- **Honesty:** never show a browser-recognition result as a pronunciation score (ADR 0007 honesty rule) [I].

---

## 5. Writing

### 5.1 What competitors do

| Platform | Feature | How it works | Source | Tag |
|---|---|---|---|---|
| Write & Improve (Cambridge) | Free tool and task library | Free without registration; "hundreds of tasks at all levels"; learners can create tasks. | https://writeandimprove.com/ | [V] |
| Write & Improve | CEFR result | Each submission gets "a result linked to the international standard, the CEFR". | https://writeandimprove.com/ | [V] |
| Write & Improve | Scoring model | Machine learning trained on 30 million words of learner essays scored by human examiners. | https://help.writeandimprove.com/en/articles/2329706-how-does-write-improve-know-my-score | [V] |
| Write & Improve | Stated limit | Cannot judge how well the essay answers the question or whether the meaning is clear. | same | [V] |
| Write & Improve | Indirect word-level feedback | Flags spelling, grammar and vocabulary issues without rewriting them; each sentence gets a qualitative assessment. | https://help.writeandimprove.com/en/articles/1104369-how-does-write-improve-work | [V] |
| Write & Improve | Errors in stages and progress graph | Common errors first; more are marked as the learner fixes them; a progress graph across resubmissions. | same | [V] |
| Write & Improve | Paid add-ons | Test Zone IELTS, Test Zone B2, Class View for teachers; prices not shown. | https://writeandimprove.com/ | [V], [U] prices |
| Busuu | Community corrections | Learner writes on a topic; native or advanced speakers correct it; learners correct others in return. Premium: unlimited and priority. | https://www.busuu.com/en/how-to/corrections | [V] |
| Busuu | Mistake Repair (2025-10-23) | Collects the learner's mistakes, explains the top error and generates custom exercises. | https://blog.busuu.com/new-mistake-repair-release/ | [V] |
| Busuu | Plans | Free, Premium, Premium Plus; AI Conversations and Mistake Repair on Plus; no prices shown. | https://www.busuu.com/en/premium-plans | [V], [U] prices |
| Babbel | Typing exercises | Type words and phrases in context; review for spelling. No free-writing feedback found. | https://support.babbel.com/hc/en-us/articles/205600228-Vocab-workout-Review | [S] |
| Grammarly | Free and Pro | Free: basic spelling and grammar, tone, 100 AI prompts a month. Pro $12/month: rewrites, "English fluency writing", 2,000 AI prompts. | https://www.grammarly.com/plans | [V] |
| Grammarly for Education | Explanations and authorship | Suggestions come with explanations; admins can turn off AI; "Authorship" shows typed vs AI text. | https://www.grammarly.com/edu | [V] |
| Grammarly | Training on user text | On by default for individual accounts (opt-out); off for education and sales accounts. | https://support.grammarly.com/hc/en-us/articles/25555503115277-Product-Improvement-and-Training-Control | [V] |
| Duolingo | Explain My Answer | Personal explanation of the error and the rule behind it; free since 2026-01-01. | https://blog.duolingo.com/explain-my-answer-now-free/ | [V] |
| Duolingo English Test | What writing is scored on | Task content, grammar accuracy and range, vocabulary, spelling and punctuation; many short tasks predict ability better than one long essay. | https://blog.englishtest.duolingo.com/how-does-duolingo-measure-writing/ | [V] |
| LanguageTool | Open source and API | Core LGPL 2.1+, self-hostable (Java 17). Free public API: 20 requests/min, 20 KB per request, backlink required. Paid API: texts not stored, servers in Germany; prices not shown. | https://github.com/languagetool-org/languagetool ; https://dev.languagetool.org/public-http-api.html ; https://languagetool.org/proofreading-api | [V] |
| IELTS | Public band descriptors | Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy (updated May 2023). | https://ielts.org/cdn/Guides/ielts-writing-band-descriptors.pdf | [V] |
| Council of Europe | CEFR written production | A2: "simple phrases and sentences linked with simple connectors like 'and', 'but' and 'because'"; B1: "straightforward connected texts on a range of familiar subjects". | https://rm.coe.int/168045b15e | [S] |
| Anthropic API | LLM cost reference | Haiku 4.5 $1 / $5 per 1M input/output tokens; Batch API 50% off; cache hits 0.1× input. | https://platform.claude.com/docs/en/about-claude/pricing | [V] |

### 5.2 Recommended features

| # | Feature | Builds on | Value (MN) | Effort | Tier | Needs |
|---|---|---|---|---|---|---|
| W1 | **Daily prompt by level** with a word target, a Mongolian hint, useful words (links to vocabulary) and a self-check list (capital letters, full stops, verb tense). Saves the text; logs writing time and word count to the tracker. | Tracker, grammar lessons | High: gives a daily habit even without AI | M | Free | None |
| W2 | **Keyboard helper**: detect Cyrillic letters in an English answer and suggest switching layout; count words correctly for mixed text | W1 | Medium: common on phones with two layouts | S | Free | None |
| W3 | **AI feedback in Mongolian**: small edits shown next to the original sentence, grouped by type (tense, articles, plural -s, prepositions, word choice), each with a short Mongolian explanation and a link to the grammar lesson. Limit per day (e.g. 3 checks) and per text (e.g. 250 words). | W1, grammar lessons | High: the product vision's first paid feature; Mongolian explanations are what global tools lack | L | Paid (1 free trial check a week is an option) | AI |
| W4 | **Errors in stages and rewrite loop**: show the 3 most important errors first; the learner fixes them and resubmits; show "errors fixed" over versions | W3 | High: learners actually learn instead of accepting rewrites | M | Paid | AI |
| W5 | **Rule-based first pass** (self-hosted LanguageTool) for spelling and simple grammar before or instead of the LLM | W1 | Medium: cuts AI cost and catches obvious errors for free users | M (hosting Java) | Free | None |
| W6 | **Mistakes feed review**: tense errors add items to `grammar_review`; misspelled or misused words go to `saved_words` | W3, ADR 0013, ADR 0010 | High: closes the loop (Busuu Mistake Repair style) | M | Paid (source) / Free (review) | AI |
| W7 | **Level estimate** based on public CEFR descriptors, clearly labelled "estimated" | W3 | Medium | S | Paid | AI |
| W8 | **Exam-style tasks** (IELTS Task 1/2 practice) using the public band descriptors as the rubric, again marked as estimates | W3 | Medium: many adult learners aim at IELTS | M | Paid | AI |

### 5.3 Pitfalls

- **Wrong corrections:** Cambridge says its own scorer cannot judge task response or clarity [V]. An LLM may "fix" correct text. Ask for minimal edits, show them next to the original, skip low-confidence edits, and have a teacher review the Mongolian explanation wording [I].
- **Fake precision:** Write & Improve's scores rest on 30 million words of examiner-scored essays [V]. StepUp has no such data, so any level is an estimate, never an IELTS band [I].
- **Training data licences:** the Write & Improve Corpus 2024 is non-commercial only and excludes derived information in a sold product (https://researchdatasets.cambridge.org/datasets/write-and-improve-corpus-2024) [V]; so are FCE, Lang-8 and NUCLE (`grammar-tenses-sources.md`). Don't fine-tune on them or use them as prompt examples [I].
- **Privacy of learner texts:** learners write about work and family. Use an API that does not train on customer data, say so in the privacy policy, and let learners delete texts. Grammarly trains on individual users' text unless they opt out [V]; LanguageTool's paid API stores nothing [V].
- **Cost:** a 250-word check with a Mongolian explanation is a few thousand tokens, well under $0.05 on Haiku 4.5 [V pricing, I arithmetic]. The rewrite loop multiplies this, so cap resubmissions and cache the fixed rubric prompt [I].
- **Community corrections** (Busuu) need many bilingual users and moderation; not realistic for a solo launch [I].

---

## 6. Reading

### 6.1 What competitors do

| Platform | Feature | How it works | Source | Tag |
|---|---|---|---|---|
| LingQ | Word colours and known words | Blue = new, yellow = saved, white = known; blue words become known when you turn the page; the known-word count grows. | https://www.lingq.com/en/ios-app-support/ | [S] |
| LingQ | Status and review | Saved words have status 1–4; review types include multiple choice, fill-in and dictation. | https://www.lingq.com/blog/lingq-review/ | [S] |
| LingQ | Free vs Premium | Free: 20 saved words total, 5 imports. Premium $8.99–14.99/month: unlimited saves and imports, sentence translation, statistics, offline. Premium Plus adds "AI-simplified lessons". | https://www.lingq.com/blog/lingq-free-vs-premium/ | [V] |
| LingQ | Mongolian | Not among LingQ's languages; users have requested it. | https://forum.lingq.com/t/mongolian-would-be-a-valuable-addition-to-lingq/34281 | [S] |
| Readlang | Tap to translate and flashcards | Click a word or phrase to translate; clicked words become spaced-repetition flashcards; browser extension works on any page. | https://readlang.com/ | [V] |
| Readlang | AI context explanations and pricing | Free: unlimited word translations, 10 phrase translations and 10 context explanations a day (GPT-4o mini). Premium $6/month; Premium Plus $15/month. | https://readlang.com/pricing | [V] |
| Beelinguapp | Side-by-side texts with audio | Target text next to a translation, read while listening; levels from kids to advanced; quizzes, flashcards, personal glossary. | https://www.beelinguapp.com/ | [V] |
| Beelinguapp | Pricing | Free with ads; Premium removes ads and unlocks all content. App Store prices vary. | https://beelinguapp.com/faq | [S] |
| News in Levels | Same story at three levels | Level 1 (1,000 words) to Level 3 (3,000 words), audio, questions, placement test, "two news articles every day". | https://www.newsinlevels.com/ | [V] |
| News in Levels | Terms | "It is forbidden to copy anything from this website"; no permission for institutions. | https://www.newsinlevels.com/conditions-of-use/ | [V] |
| Duolingo | Stories | Short dialogues with audio and in-story questions; advanced formats (articles, emails, ads) for English learners since 2022. | https://blog.duolingo.com/duolingo-advanced-stories/ | [V] |
| Duolingo | Reading approach | "Select the missing word", "read and respond"; sentences get gradually longer. | https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/ | [V] |
| VOA Learning English | Public domain | Texts and MP3s are public domain, reusable "for educational and commercial purposes, with credit"; AP, Reuters and AFP excluded. | https://learningenglish.voanews.com/p/6861.html | [V] |
| Standard Ebooks | CC0 | Public-domain books dedicated via CC0 1.0. | https://standardebooks.org/about | [V] |
| Project Gutenberg | Trademark licence | Charging for works with the Project Gutenberg name means a 20% royalty; stripped of the name, US public-domain text is unrestricted. | https://www.gutenberg.org/policy/license.html | [V] |
| Global Storybooks | Levelled stories | Five levels (up to 75 words → 800+), text plus audio; translations CC BY 4.0, some originals CC BY-NC. Children's books. | https://globalstorybooks.net/faq/ | [V] ([S] licence) |
| Wikimedia | Simple English Wikipedia | CC BY-SA 4.0; commercial use with attribution; adaptations share-alike. | https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use | [V] |
| Google Cloud Translation | Mongolian | `mn` supported by the standard model; LLM model marks it "Experimental". | https://docs.cloud.google.com/translate/docs/languages | [V] |
| DeepL | Mongolian | `MN` source and target, without glossaries. | https://developers.deepl.com/docs/getting-started/supported-languages | [V] |
| Microsoft Translator | Mongolian | `mn-Cyrl` text translation, no dictionary lookup; free tier 2M characters a month. | https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support ; https://azure.microsoft.com/en-us/pricing/details/translator/ | [V] |
| Wikidata Lexemes | Open lexical data | Lexeme namespace is CC0. Mongolian coverage not checked. | https://www.wikidata.org/wiki/Wikidata:Copyright | [V] |

### 6.2 Recommended features

| # | Feature | Builds on | Value (MN) | Effort | Tier | Needs |
|---|---|---|---|---|---|---|
| R1 | **Text reader with tap-to-translate**: paragraphs, tap a word or tagged phrase → the existing word sheet (Mongolian meaning, TTS, save). Glosses prepared per text ahead of time, like clips. | `word-sheet.tsx`, glossary, `saved_words` (`source: {text, para}`) | High: core of the module; works offline-ish and on slow connections because it is text only | M | Free | None |
| R2 | **First library of ~20 texts** at A2–B1: VOA Learning English articles (VOA's own content only) plus StepUp's own simplified versions; later Standard Ebooks classics as graded extracts | Listening content pipeline (ADR 0009) | High | M (content work) | Free | Licensed content (PD with credit) |
| R3 | **Comprehension questions** after each text (multiple choice and gap-fill) | `practice-session.tsx` | High | S | Free | None |
| R4 | **Word colours and known-word count**: new / saved / known, with a "mark all remaining as known" on finishing; the count appears on the tracker | `saved_words`; new `known_words` table | Medium–High: visible progress motivates adults | M | Free | None |
| R5 | **Mongolian translation toggle** per paragraph for A1–A2 texts; translations machine-drafted once and checked by a person | R1 | High for beginners | M | Free | AI or translation API (once, offline) |
| R6 | **Listen while reading**: TTS or VOA's own MP3 with sentence highlighting, reusing clip timings | Listening timings, player | Medium: costs bandwidth for audio; keep optional | M | Free | Audio |
| R7 | **Same story at two or three levels** (News in Levels format) written by StepUp | R2 | Medium | M per story | Free | AI draft + human review |
| R8 | **AI "explain this sentence"** in Mongolian (grammar and meaning in context), cached per sentence, small daily quota | R1 | Medium | M | Paid (free quota) | AI |
| R9 | **Paste your own text** (import), glossing unknown words with AI or a translation API | R1, R8 | Medium: useful for work documents; cost grows with users | M | Paid | AI |

### 6.3 Pitfalls

- **Copy formats, not content:** News in Levels, LingQ, Beelinguapp and Duolingo content is proprietary; News in Levels explicitly forbids copying [V].
- **Project Gutenberg:** remove all Gutenberg branding in a paid product or owe a 20% royalty; also check copyright status under Mongolian law, not only US law [V] [I].
- **VOA:** only VOA-produced material, with credit; no AP, Reuters or AFP items [V]. Download copies early, as ADR 0009 already notes [I].
- **Share-alike:** a glossary built from Wiktionary (CC BY-SA) would have to stay CC BY-SA; Wikidata Lexemes are CC0 [V] [I].
- **Machine translation for Mongolian:** Google's LLM model marks Mongolian "Experimental" and Microsoft has no dictionary lookup for Mongolian [V]. Single-word machine glosses are unreliable; keep pre-written, reviewed glosses (as ADR 0009 does) and use APIs only offline for drafts [I].
- **Cost:** translating a small library once fits inside free tiers (Google 500k characters [S], DeepL API Free 500k [S], Microsoft 2M [V] a month); live calls on every tap scale with users [I].
- **Adult tone:** storybook collections are written for children [I]; don't let them become the main A1 content for adults.

---

## 7. Cross-module ideas

1. **One review queue for words.** Every module saves into `saved_words` with a `source` (clip, text, list, writing feedback). The card shows where the word came from and plays clip audio or TTS. This is the LingQ and Readlang loop, and ADR 0010 already has the schema for it [I].
2. **One mistake queue.** Grammar practice (ADR 0013), writing feedback (W6) and cloze cards push errors into the existing Leitner reviews. The home page shows "N үг, M алдаа давтах" [I].
3. **Read → speak.** Any reading or listening sentence gets a "say it" button that opens the shadowing recorder (S2), with Azure scoring for paid users [I].
4. **Read → write.** After a text, a writing prompt asks the learner to use 3 saved words from it; the AI feedback checks they were used correctly [I].
5. **Tracker signals per skill.** Beyond minutes: words known (R4), words reviewed, texts read, speaking takes, words written. All go through `activity_events` with `meta`, so no new counters are needed (ADR 0005) [I].
6. **Placement routing.** The placement test result chooses the NGSL set, the reading level and the writing prompt level, so a new learner has something in every module on day one [I].
7. **One paid bundle.** Pronunciation scoring, writing feedback and sentence explanations share one daily "AI credit" limit, which keeps costs predictable [I].
8. **Mongolian-speaker error profile.** Articles, tense, plural -s and the sounds in `feedback.ts` are the same weak spots across grammar, writing and speaking; tag content and feedback with shared error codes so the tracker can show "your top 3 weak spots" (evidence on Mongolian learners' errors is collected in `grammar-tenses-sources.md`, sources 45–48) [I].

---

## 8. Suggested build order (small steps)

Each step ships alone and adds one visible thing. [I]

1. **Speaking hub (S1).** Replace the `/speaking` placeholder with links to shadowing and speaking minutes. Days.
2. **Reading reader, 5 texts (R1 + R3).** Reuse the word sheet and practice session with VOA texts; save words with a text source. Log reading time.
3. **Typed and listen cards (V2 + V4)** in the existing review, plus a review log table for future FSRS.
4. **NGSL starter lists (V1)** with Mongolian meanings for the first 500 words, fed by the placement level.
5. **Writing prompts without AI (W1 + W2).** Daily prompt, save text, word count, tracker event.
6. **Phrase drills (S2)**, then **sound drills (S3)**.
7. **Reading library to 20 texts (R2)**, **word colours and known-word count (R4)**, **translation toggle for A1–A2 (R5)**.
8. **Paid access and AI credits.** Payments, daily limits, privacy policy update, teen consent decision.
9. **AI writing feedback (W3), then rewrite loop (W4) and mistakes into review (W6).** The first paid feature.
10. **Switch on Azure scoring (S4)** under the same credits.
11. **FSRS (V7)** once enough review logs exist; **cloze cards (V3)**; **sentence explanations (R8)**.
12. **Later:** unscripted answers (S6), exam tasks (W8), levelled stories (R7), import (R9), AI roleplay (S7), word challenges (V9).

---

## 9. Sources

Checked 2026-09-15. Tags as in the tables above.

Vocabulary
1. Settles & Meeder (2016), A Trainable Spaced Repetition Model for Language Learning — https://research.duolingo.com/papers/settles.acl16.pdf ; https://aclanthology.org/P16-1174/
2. duolingo/halflife-regression — https://github.com/duolingo/halflife-regression
3. Duolingo blog: Introducing Birdbrain — https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain/
4. Duolingo blog: Guide to the Practice Hub — https://blog.duolingo.com/guide-to-duolingo-practice-hub/
5. Duolingo blog: Explain My Answer now free — https://blog.duolingo.com/explain-my-answer-now-free/
6. Duolingo blog: Duolingo Max — https://blog.duolingo.com/duolingo-max/
7. Anki manual: Getting started — https://docs.ankiweb.net/getting-started.html
8. Anki manual: Editing (note types, cloze, media) — https://docs.ankiweb.net/editing.html
9. Anki manual: Deck options (FSRS, buttons, limits) — https://docs.ankiweb.net/deck-options.html
10. Anki manual: Add-ons — https://docs.ankiweb.net/addons.html
11. Anki apps — https://apps.ankiweb.net/ ; AnkiMobile on the App Store — https://apps.apple.com/us/app/ankimobile-flashcards/id373493387
12. open-spaced-repetition/ts-fsrs — https://github.com/open-spaced-repetition/ts-fsrs
13. open-spaced-repetition/fsrs-rs — https://github.com/open-spaced-repetition/fsrs-rs
14. open-spaced-repetition/srs-benchmark — https://github.com/open-spaced-repetition/srs-benchmark
15. Quizlet Learn — https://quizlet.com/features/learn ; Help: Studying with Learn — https://help.quizlet.com/hc/en-us/articles/360030986971-Studying-with-Learn ; AI study tools — https://quizlet.com/features/ai-study-tools ; Upgrade — https://quizlet.com/upgrade
16. Memrise help — https://explore.memrise.com/help ; Memrise home — https://www.memrise.com/
17. Clozemaster — https://www.clozemaster.com/
18. Lingvist — https://lingvist.com/ ; pricing — https://lingvist.com/pricing/
19. New General Service List project — https://www.newgeneralservicelist.com/ ; NGSL page and licence — https://www.newgeneralservicelist.com/new-general-service-list
20. Cambridge Dictionary licensing — https://dictionary.cambridge.org/license.html

Speaking
21. ELSA Speak — https://elsaspeak.com/en/ ; Speech Analyzer — https://elsaspeak.com/en/speech-analyzer ; Shop — https://elsaspeak.com/en/elsa-shop ; Privacy — https://elsaspeak.com/en/privacy/
22. Speak — https://www.speak.com/ ; Live Roleplays — https://www.speak.com/blog/live-roleplays ; Whisper — https://www.speak.com/blog/speak-openai-speech-recognition ; Plans — https://help.speak.com/en/articles/5358417-what-s-the-difference-between-premium-and-premium-plus ; Privacy — https://www.speak.com/privacy
23. Cake on the App Store — https://apps.apple.com/us/app/cake-learn-english-korean/id1350420987
24. Duolingo blog: Video Call — https://blog.duolingo.com/video-call/
25. Praktika — https://praktika.ai/ ; Terms — https://praktika.ai/terms
26. Azure pronunciation assessment — https://learn.microsoft.com/en-us/azure/ai-services/speech-service/pronunciation-assessment-tool
27. Azure Speech language support — https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
28. Azure Speech pricing — https://azure.microsoft.com/en-us/pricing/details/speech/ ; Azure retail prices API — https://prices.azure.com/api/retail/prices
29. Azure speech to text data, privacy and security — https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/speech-service/speech-to-text/data-privacy-security
30. SpeechSuper — https://www.speechsuper.com/ ; pricing — https://www.speechsuper.com/pricing.html
31. OpenAI API pricing — https://developers.openai.com/api/docs/pricing ; Your data — https://developers.openai.com/api/docs/guides/your-data
32. MDN browser-compat-data: SpeechRecognition — https://github.com/mdn/browser-compat-data/blob/main/api/SpeechRecognition.json

Writing
33. Write & Improve — https://writeandimprove.com/ ; How it knows my score — https://help.writeandimprove.com/en/articles/2329706-how-does-write-improve-know-my-score ; How it works — https://help.writeandimprove.com/en/articles/1104369-how-does-write-improve-work
34. Write & Improve Corpus 2024 — https://researchdatasets.cambridge.org/datasets/write-and-improve-corpus-2024
35. Busuu corrections — https://www.busuu.com/en/how-to/corrections ; Mistake Repair — https://blog.busuu.com/new-mistake-repair-release/ ; Plans — https://www.busuu.com/en/premium-plans
36. Babbel Review help — https://support.babbel.com/hc/en-us/articles/205600228-Vocab-workout-Review
37. Grammarly plans — https://www.grammarly.com/plans ; Education — https://www.grammarly.com/edu ; Training control — https://support.grammarly.com/hc/en-us/articles/25555503115277-Product-Improvement-and-Training-Control
38. Duolingo English Test: How does Duolingo measure writing — https://blog.englishtest.duolingo.com/how-does-duolingo-measure-writing/
39. LanguageTool repository — https://github.com/languagetool-org/languagetool ; Public HTTP API — https://dev.languagetool.org/public-http-api.html ; Proofreading API — https://languagetool.org/proofreading-api
40. IELTS Writing band descriptors — https://ielts.org/cdn/Guides/ielts-writing-band-descriptors.pdf
41. Council of Europe CEFR (2001) — https://rm.coe.int/168045b15e ; Companion Volume chapter 3 — https://rm.coe.int/chapter-3-communicative-language-activities-and-strategies/1680a084b4
42. Anthropic API pricing — https://platform.claude.com/docs/en/about-claude/pricing

Reading
43. LingQ iOS support — https://www.lingq.com/en/ios-app-support/ ; Review — https://www.lingq.com/blog/lingq-review/ ; Free vs Premium — https://www.lingq.com/blog/lingq-free-vs-premium/ ; Mongolian request — https://forum.lingq.com/t/mongolian-would-be-a-valuable-addition-to-lingq/34281
44. Readlang — https://readlang.com/ ; pricing — https://readlang.com/pricing
45. Beelinguapp — https://www.beelinguapp.com/ ; FAQ — https://beelinguapp.com/faq
46. News in Levels — https://www.newsinlevels.com/ ; Conditions of use — https://www.newsinlevels.com/conditions-of-use/
47. Duolingo blog: Advanced Stories — https://blog.duolingo.com/duolingo-advanced-stories/ ; Reading approach — https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/
48. VOA Learning English copyright — https://learningenglish.voanews.com/p/6861.html
49. Standard Ebooks about — https://standardebooks.org/about
50. Project Gutenberg licence — https://www.gutenberg.org/policy/license.html
51. Global Storybooks FAQ — https://globalstorybooks.net/faq/ ; Translation guidelines — https://globalstorybooks.net/guidelines/translation/
52. Wikimedia Terms of Use — https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use
53. Google Cloud Translation languages — https://docs.cloud.google.com/translate/docs/languages ; pricing — https://cloud.google.com/translate/pricing
54. DeepL supported languages — https://developers.deepl.com/docs/getting-started/supported-languages ; API plans — https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans
55. Microsoft Translator language support — https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support ; pricing — https://azure.microsoft.com/en-us/pricing/details/translator/
56. Wikidata copyright — https://www.wikidata.org/wiki/Wikidata:Copyright
