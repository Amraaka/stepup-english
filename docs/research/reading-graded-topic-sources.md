# Graded, topic-organised reading texts from open sources — research notes

Date: 2026-09-18
Scope: where the Reading module (ADR 0017) can get **short** English texts (about 100–800 words), organised **by topic** and **by level (CEFR A1–C1)**, that we can legally **edit, split into sentences, gloss and translate into Mongolian, add questions to and turn into TTS audio**, in a product that will become **freemium (commercial)**. Covers Hugging Face, Kaggle, GitHub, publishers' own open content, wordlists and classifiers for levelling texts ourselves. Primary sources only (dataset cards, licence files, publisher terms pages, papers). **This is not legal advice.** Mongolian copyright law was not researched.

Legend: **[V]** = verified in the cited primary source (quotes are verbatim or near-verbatim). **[I]** = our inference or interpretation; check it before relying on it.

Access notes: British Council LearnEnglish terms returned 403 to both the fetcher and curl, so they were **not read**. StoryWeaver's terms and reading-levels pages are a JavaScript app and returned no text; the licence was read on the publisher's own page (prathambooks.org/cc) and the level/category taxonomy through StoryWeaver's public JSON API. ReadWorks' terms page is also JavaScript-only and was **not read**. The Oxford 3000/5000 and English Vocabulary Profile terms pages were not reached (403/404). Kaggle metadata was read through Kaggle's public API; Hugging Face cards through `huggingface.co/datasets/<id>/raw/main/README.md` and the datasets API. Counts marked "API" are live counts on 2026-09-18.

---

## 1. TL;DR recommendation

Almost every **ready-made CEFR-labelled corpus** on Hugging Face, Kaggle and GitHub is either **non-commercial** (CC BY-NC / BY-NC-SA / research-only licence), **scraped** from copyrighted ESL sites, or **synthetic**. None of them is a safe base for a freemium product. The usable material is **publisher open content** that we level ourselves.

Use these, in this order:

1. **VOA Learning English, VOA-written pieces only** — public domain, adult-oriented, topic sections, 300–800 words. **Filter out wire-service adaptations**: in a sample of 12 recent Science & Technology items, 8 said "The Associated Press/AFP reported this story … adapted it" [V][4]. Those are derivatives of AP/AFP copyrighted text and fall under VOA's own warning that AP material "may not be copied, published or redistributed" [V][1]. Keep items credited "wrote this story for VOA Learning English" and VOA's own series (American Stories, Words and Their Stories, Education Tips, U.S. History, American Presidents/Inventors/Places, Everyday Grammar). Covers B1–B2, some A2. Note: VOA Learning English sections stopped publishing in March 2025 [V][4]; the archive is still online but should be copied now.
2. **LIDA Stories (UK)** — the only open, **adult-learner** graded set we found: 30 stories, 5 levels, everyday adult topics (finding a job, getting medicine, eating out, buying clothes), English audio. **18 of 30 are CC BY 4.0** (commercial OK); 12 are CC BY-NC-SA 4.0 and must be skipped [V][10]. Very short (≤450 words), covers A1–A2.
3. **StoryWeaver (Pratham Books)** — CC BY 4.0, commercial use and remixing allowed with credits [V][7]. Large (API: ~5,300 English books at Level 1, ~2,400 at Level 4), with category tags [V][8]. Children's picture books, so pick non-fiction and the "Lifeskills / STEM / Science & Nature / History and Culture" categories and choose items that read well for teens and adults. Covers A1–A2 (Levels 1–2) and some B1 (Levels 3–4).
4. **Self-levelled public-domain and CC BY texts for B1–C1**: Frontiers for Young Minds (CC BY, science written for 8–15-year-olds) [V][13], Simple English Wikipedia (CC BY-SA 4.0) [V][15], Wikinews archive (CC BY 2.5/4.0; project now closed, read-only) [V][17][18], Standard Ebooks / Project Gutenberg short fiction (public domain in the US) [V][19][20]. We cut excerpts to 300–800 words and assign CEFR ourselves.

**Levelling pipeline (for everything above):** the **CEFR-J Vocabulary Profile 1.5** ("can be used for research and commercial purposes with no charge, provided that you cite the dataset") [V][22] plus the public-domain **VOA Learning English Word Book** [V][5] for word-level coverage. Add sentence length and a readability formula, then teacher review. Open CEFR classifiers are only a second opinion (§5.3).

**Fallback:** LLM-written texts per topic × level, reviewed by a teacher, to fill empty cells (typically A1–A2 adult topics and C1). See §5.4.

---

## 2. Comparison table

"Commercial" and "Derivatives" mean: does the licence let a freemium app publish edited, glossed, translated text? ✅ yes · ⚠️ yes with conditions · ❌ no.

| Source | Licence | Commercial | Derivatives | Levels | Topics | Size | Typical length | Fit (teens/adults) |
|---|---|---|---|---|---|---|---|---|
| **VOA Learning English** (VOA-written items) | Public domain; credit VOA [V][1] | ✅ | ✅ | Beginning/Intermediate/Advanced site sections; no per-article CEFR [V][3] | Health & Lifestyle, Science & Technology, Arts & Culture, Education, U.S. History, As It Is (news), American Stories, Words & Their Stories [V][2] | Thousands of items (Health & Lifestyle alone has 100+ archive pages back to 2015) [V][4]; **VOA-written subset unknown** | 300–800 | Very good (adult news/features) |
| VOA items "adapted" from AP/AFP/Reuters | AP material: "may not be copied, published or redistributed" [V][1] | ❌ | ❌ | — | — | Majority of recent news items in sample [V][4] | — | Skip |
| **LIDA Stories (UK)** | Per story: CC BY 4.0 (18) or CC BY-NC-SA 4.0 (12) [V][10] | ✅ for CC BY only | ✅ for CC BY only | 5 levels by words/tense [V][9] | Everyday adult life (work, food, health, family, weather, shopping, migration) [V][9] | 30 stories (18 usable) | 50–450 | **Best** for adult A1–A2 |
| **StoryWeaver** | CC BY 4.0 (Pratham Books) [V][7] | ✅ | ✅ | Level 1–4 (+ "Level 1 Emergent") [V][8] | 38 categories (STEM, Science & Nature, Lifeskills, History and Culture, Biographies…) [V][8] | ~5,300 / 5,500 / 3,700 / 2,400 English books at L1–L4 (API) [V][8] | 50–1,500 [I] | Children's; pick carefully |
| **African Storybook / Global Storybooks** | Mixed CC BY and CC BY-NC per story [V][11][12] | ⚠️ per story | ⚠️ per story | ASb Levels 1–5; GSB 5 levels by word count [V][12] | Children's stories; few informational | ASb 5,473 storybooks (site count) [V][11]; GSB 40 | ≤75 to 800+ | Children's |
| **Frontiers for Young Minds** | CC BY [V][13] | ✅ | ✅ | None (written for 8–15-year-olds) | 8 science sections [V][14] | Hundreds [I] | 1,500–2,500, needs excerpting [I] | Good for teens, science only |
| **Simple English Wikipedia** | CC BY-SA 4.0 (+GFDL) [V][15][16] | ✅ | ⚠️ ShareAlike | None | Wikipedia categories | 285,073 articles (API) [V][15] | Varies; many stubs | OK, dry; needs editing |
| **Wikinews** (archive, closed 2026) | Public domain (<2005-09-25), CC BY 2.5, CC BY 4.0 (after 2024-12-16) [V][18] | ✅ | ✅ | None | News categories | 22,237 articles (API) [V][17] | 200–600 [I] | OK; dated, native-level |
| **Standard Ebooks / Project Gutenberg** | CC0 (SE's work) on US-public-domain texts [V][19]; PG trademark licence unless stripped [V][20] | ✅ (strip PG header) | ✅ | None | Fiction, essays | Tens of thousands of books | Must excerpt | Good for B2–C1 literature |
| **CEFR-J Vocabulary Profile** (wordlist, not texts) | "research and commercial purposes with no charge", cite [V][22] | ✅ | ✅ | A1–B2 word levels | — | ~7,800 entries [I] | — | Levelling tool |
| OneStopEnglish corpus | CC BY-SA 4.0 on GitHub, but permission from Macmillan & Guardian was "for research use" [V][24][25] | ❌ (risky) | ❌ (risky) | Ele/Int/Adv | None (news) | 189 × 3 | 533 / 677 / 820 avg [V][25] | Would be ideal; not safe |
| CLEAR corpus (CommonLit) | CC BY-NC-SA 4.0 [V][26] | ❌ | ❌ | US grade/BT easiness | Lit/Info; Science/Tech/History subcat [V][26] | 4,724 | 129–205 words [V][26] | Use only as a pointer to original sources |
| Cambridge English Readability Dataset | Licence: "non-commercial research and educational purposes only"; no redistribution [V][28] | ❌ | ❌ | A2–C2 (exam level) | None | — | — | Not usable |
| CEFR-SP (sentences) | Wiki-Auto part CC BY-SA 3.0; SCoRE part CC BY-NC-SA 4.0; Newsela part by agreement [V][29] | ⚠️/❌ | ⚠️/❌ | A1–C2 per sentence | None | 17k sentences | Sentences | Not texts; classifier training only |
| UniversalCEFR (HF org) | Mostly CC BY-NC / BY-NC-SA per sub-dataset [V][30] | ❌ | ❌ | CEFR | None | 25 datasets | Varies | Not usable |
| Newsela | ToS: no scraping, no public posting, no resale [V][32] | ❌ | ❌ | Grade levels | Topics | — | — | Not usable |
| TinyStories | CDLA-Sharing-1.0 [V][34] | ✅ | ⚠️ sharing | None (toddler vocabulary) | None | ~2M+ synthetic stories [I] | 100–300 | Poor (synthetic, for 3–4-year-olds) |
| Kaggle "CEFR Levelled English Texts" | Labelled CC0, but texts "taken from … The British Council, ESLFast, and the cnn-dailymail dataset" [V][35] | ❌ | ❌ | A1–C2 | None | ~1,500 | Short | **Scraped — do not use** |
| Breaking News English / News in Levels / ESL-Lounge / Lingua.com / ESLFast / British Council / CommonLit | All rights reserved; explicit bans on reuse in apps or on commercial use (§4) | ❌ | ❌ | Levels | Topics | — | — | Not usable |

---

## 3. Per-source details (recommended and conditional)

### 3.1 VOA Learning English

- **URL:** https://learningenglish.voanews.com/ · terms https://learningenglish.voanews.com/p/6021.html
- **Licence [V][1]:** "All text, audio and video material produced exclusively by the Voice of America is in the public domain." "Credit for any use of VOA material should be given to voanews.com, Voice of America, or VOA." Also: "VOA has a license from Associated Press to use AP photos and graphics. All AP material is copyrighted and the property of Associated Press, and may not be copied, published or redistributed without the written permission of Associated Press." And: "voanews.com content may also contain text … and other copyrighted material that is licensed for use in VOA programming only." Trademark: "'Voice of America' and 'voanews.com' are trademarks which may not be used for commercial purposes without express permission."
- **Wire-service adaptations (important) [V][4]:** credit lines on recent Science & Technology items include "The Associated Press reported this story. Bryan Lynn adapted the report for VOA Learning English", "Issam Ahmed wrote this story for Agence-France Presse. Andrew Smith adapted it for VOA Learning English", "Laura Ungar reported this story for the Associated Press. Jill Robbins adapted it for Learning English". 8 of 12 sampled items were adaptations of AP or AFP reports. [I] An adaptation of an AP/AFP article is not "produced exclusively by" VOA; treat it as copyrighted. **Rule for our pipeline:** accept an item only if its credit line names VOA writers alone ("wrote this story for VOA Learning English", "reported this story for VOA", series features). Reject "adapted … from/based on AP/AFP/Reuters". Record the credit line in `scripts/reading/sources/`. [I] The five current texts (ADR 0017) appear to be VOA-written series pieces, but re-check their credit lines against this rule.
- **American Stories [I]:** these are VOA adaptations of literary works. Adaptation text is VOA's, but the underlying story must itself be public domain (most are 19th/early-20th-century US authors). Check the original author's dates.
- **Levels [V][3]:** the site has Beginning / Intermediate / Advanced pages. Beginning holds *Let's Learn English* Levels 1–2, *Ask a Teacher*, *News Words*. The About page says audio and video programs "are written using vocabulary at the upper-beginner and intermediate level", and the Word Book says lessons are "written for English learners at the intermediate and upper-beginner level" [V][5]. Advanced points to American Stories, Words and Their Stories, Everyday Grammar and Education. **No per-article CEFR label.** [I] Rough mapping: Let's Learn English ≈ A1–A2; As It Is / Health & Lifestyle / Science & Technology ≈ B1 (some A2+); American Stories, Words and Their Stories, Education Tips ≈ B1–B2. Level each text ourselves.
- **Topics [V][2]:** section IDs Health & Lifestyle (`/z/955`), Science & Technology (`/z/1579`), Arts & Culture (`/z/986`), As It Is (`/z/3521`), American Stories (`/z/1581`), Words & Their Stories (`/z/987`), Education Tips (`/z/7468`), Everyday Grammar (`/z/4456`), U.S. History, America's Presidents, America's National Parks. Articles also carry a `keywords` meta tag (e.g. "Lessons of the Day, As It Is") [V][4].
- **Size/length:** Health & Lifestyle archive pages run back to 2015 at page ~100 [V][4] → [I] roughly a thousand-plus items per big section. Articles are typically 300–800 words and come with a "Words in This Story" glossary and MP3 [I].
- **Status [V][4]:** the newest items in Health & Lifestyle, Science & Technology, Arts & Culture, As It Is and American Stories are dated January–March 2025. Nothing newer was found on 2026-09-18. [I] The service appears to have stopped publishing (consistent with the March 2025 USAGM cuts). The archive could disappear, so copy the source text into `scripts/reading/sources/` now, as ADR 0017 already does.
- **Bonus:** the *VOA Learning English Word Book* (PDF, 112 pages, "A dictionary of the most useful words for learning American English", first edition 1962) is VOA-produced and so public domain [V][5]. It is useful as an A2–B1 core vocabulary list.
- **Fit:** adult, news/feature register, American English, fits "Mongolian teens/adults". Best single source for B1.

### 3.2 LIDA Stories (Learning Inclusion in a Digital Age)

- **URL:** https://lidastories.net/uk/ (portal https://lidastories.net/)
- **Audience [V][9]:** "a free open educational resource developed by LIDA for youth and adult language learners. It provides 30 stories with text and audio in English and the most widely spoken immigrant and refugee languages in the UK." About page: "particularly targets recent immigrants and refugees and immigrants with little schooling".
- **Licence [V][9]:** "The story texts and images are openly licensed (either CC BY or CC BY-NC-SA — see the information provided on each story page)". Per-story check [V][10]: **CC BY 4.0**: 0001 Finding a job, 0014 Malik's story, 0015 Agostino's story, 0016 Giving birth, 0017 Getting medicine, 0018 Food, 0019 My family, 0020 I can do many things, 0021 Buying clothes, 0022 What are they doing?, 0023 The weather, 0024 What sort of music do you like?, 0025 Talking about family, 0026 Talking about the weather, 0027 Standing out for the right reason, 0028 The sound of birds in the morning, 0029 Coming to Norway, 0030 An old man as a husband. **CC BY-NC-SA 4.0 (skip):** 0002–0013 (Feelings, Asking and answering, Meeting people, Helping and understanding, Eating out, Going to bed, Going to a café, Accident, Clean and ready, Going to the cinema, Going to work, Cleaning).
- **Levels [V][9]:** Level 1 "Very short sentences in present tense", up to 50 words; Level 2 "Short sentences in present and future tense", 51–100; Level 3 "Short sentences in past, present, and future tense", 101–200; Level 4 "A couple of sentences per page", 201–300; Level 5 "Multiple sentences per page", 301–450. [I] ≈ A1 (L1–2), A2 (L3–4), A2+/B1 (L5).
- **Attribution:** CC BY 4.0 → credit author/illustrator, LIDA, licence link, and note changes. [I] The per-story audio is presumably under the story's licence (as in Global Storybooks), but that was not verified; we would generate our own TTS anyway.
- **Caveats:** small set; a few topics (giving birth, migration, "An old man as a husband") need a sensitivity check for teens.

### 3.3 StoryWeaver (Pratham Books)

- **URL:** https://storyweaver.org.in/ · licence page https://prathambooks.org/cc/
- **Licence [V][7]:** "ATTRIBUTION | CC BY": you may "distribute, remix, tweak, and build upon our work, even commercially, as long as you credit us, Pratham Books, the donor/funder of the book, and the original author, illustrator and translator, where applicable." A CC BY-SA variant is also listed. [I] StoryWeaver hosts books from 60+ partner publishers (the API lists African Storybook Initiative, Book Dash, Bloom Library, Google, etc.) [V][8]. Check each book's licence and credit block, especially African Storybook re-uploads, which can be CC BY-NC (see 3.4).
- **Credit text:** each story has a `copyrightNotice` field in the API [V][8] (e.g. "This book has been published on StoryWeaver by Pratham Books … supported by HDFC Asset Management …"). Keep it verbatim with the author/illustrator names.
- **Levels [V][8]:** API filter values: "Level 1 (Emergent Readers)", "Level 1", "Level 2", "Level 3", "Level 4". StoryWeaver says levels "are not representative of a child's age or grade" but based on "length of the book, complexity of vocabulary and the storyline" (search snippet of the reading-levels page; the page itself did not render, **not verified**). [I] ≈ L1 A1, L2 A1–A2, L3 A2, L4 A2–B1.
- **Topics [V][8]:** 38 categories, including Science & Nature, STEM, Lifeskills, History and Culture, Place & Culture, Biographies, Hobbies & Interests, Me and My Daily Life, Family & Friends, Growing Up, Math, Funny, Folktales & Myths, Adventure & Mystery, Animal Stories, Non-fiction.
- **Size [V][8]:** English search hits by level (API): L1 5,294 · L2 5,460 · L3 3,689 · L4 2,369. (The API caps `hits` at 10,000 overall.)
- **Fit [I]:** written for children; illustrations carry much of the meaning. Choose non-fiction (STEM, Lifeskills, Biographies, History and Culture) and neutral folktales, and don't use illustrations unless we credit the illustrator. The API exposes `showStoryGatingForm`; [I] bulk scraping may be unwelcome even though the licence is open, so prefer hand-picking or contacting Pratham.

### 3.4 African Storybook and Global Storybooks

- **African Storybook** https://www.africanstorybook.org/ — site footer "© 2015-2026 Saide - Creative Commons Licence CC-BY-4.0"; 5,473 storybooks, 260 languages [V][11]. **But individual stories vary:** the Global Storybooks audio repo lists African Storybook stories under CC BY 3.0, CC BY 4.0 **and CC BY-NC 3.0** (e.g. "Look at the animals", "School clothes", "Where is my cat?", "Feelings", "Cooking" are CC BY-NC) [V][12]. Check each story.
- **Global Storybooks** https://globalstorybooks.net/ — 40 stories chosen from African Storybook, with human translations and studio audio. "Different licenses (either CC BY or CC BY-NC)" per story [V][12]. Levels [V][6]: Level 1 up to 75 words; Level 2 76–250; Level 3 251–500; Level 4 501–799; Level 5 800+. On adults, the FAQ says "Adult learners can certainly benefit from reading children's stories as well, but we also have a collection of stories aimed specifically at adult readers" and points to LIDA Stories [V][6].
- **Fit:** children's picture books; LIDA (3.2) is the better adult option from the same team.

### 3.5 Frontiers for Young Minds

- **URL:** https://kids.frontiersin.org/
- **Licence [V][13]:** "All Frontiers for Young Minds articles are published using a Creative Commons CC-BY license … the content of our articles – both text and images – are free to access, download, and reproduce in your educational materials. The only requirement is that you provide a clear citation that references the Frontiers for Young Minds publication as the original." [I] CC BY 4.0 itself allows commercial use and adaptation. The per-article licence line did not render for our fetcher, so check it on each article.
- **Topics [V][14]:** Astronomy and Physics, Biodiversity, Chemistry and Materials, Earth Sciences, Engineering and Technology, Human Health, Mathematics and Economics, Neuroscience and Psychology. Reviewed by "Kids and teens between the ages of 8-15".
- **Level/length [I]:** native-speaker middle-school register → roughly B2–C1 for EFL learners. Articles run about 1,500–2,500 words, so use one section as a 400–800-word excerpt. The CLEAR corpus used 455 FYM excerpts [V][26], which shows they excerpt well.

### 3.6 Simple English Wikipedia (and Wikibooks)

- **Licence [V][15][16]:** site rights "Creative Commons Attribution-Share Alike 4.0". Wikimedia Terms of Use: text is under "CC BY-SA 4.0, and GFDL"; reusers credit via "hyperlink … or URL to the article", a stable copy, or "a list of all authors".
- **Size [V][15]:** 285,073 articles.
- **Levels/topics:** no level labels; topics via categories. [I] Written for "simple" English (≈B1–B2) but uneven; many stubs.
- **ShareAlike implication [I]:** our edited and Mongolian-glossed version of a Simple Wikipedia text is an adaptation and must be released under CC BY-SA 4.0. That is compatible with a freemium app (CC licences don't forbid charging), but CC 4.0 §2(a)(5)(B) [23] bars "effective technological measures" that restrict re-users, and the adapted text itself can't be "ours". Keep SA texts clearly separated and labelled. Wikibooks has the same licence.

### 3.7 Wikinews archive

- **Status [V][17]:** Main Page: "Wikinews is closed. Wikinews has been made read-only." The WMF Board announced the closure "on March 30".
- **Licence [V][18]:** "All material published on Wikinews after December 16, 2024 is licensed under … Creative Commons Attribution 4.0 … Material published prior December 16, 2024 but after September 25, 2005 is licensed under … Creative Commons Attribution 2.5 … This work may be attributed to 'Wikinews'. All material published prior to September 25, 2005, is in the public domain."
- **Size [V][17]:** 22,237 articles. [I] Short news (200–600 words), native register (B2–C1), dated. No ShareAlike, so it's easier than Wikipedia. Topics via categories (Science and technology, Health, Sports, Economy…). Quality varies; prefer "Original reporting" and featured pieces.

### 3.8 Project Gutenberg / Standard Ebooks

- **Standard Ebooks [V][19]:** "Content produced by or for Standard Ebooks L³C is dedicated to the public domain via the CC0 1.0 Universal Public Domain Dedication." "The text and cover art in our ebooks are already believed to be in the U.S. public domain."
- **Project Gutenberg [V][20]:** without the PG licence and trademark, "you are left with a text unrestricted by U.S. intellectual property law". Keeping the trademark and charging means "a royalty fee of 20% of the gross profits". Also: "check the laws of your country" (public domain is US-specific). → Strip PG headers and don't use the name as a brand.
- **Graded readers on PG [V][21]:** McGuffey's Eclectic Primer and First to Sixth Readers (IDs 14642, 14640, 14668, 14766, 14880, 15040, 16751), *Graded Literature Readers* (49339). [I] These are 19th-century US school readers with moralising, dated content. They are useful as short A1–A2 passages only after editing; they are not modern graded readers.
- **Fit [I]:** short stories and essays (O. Henry, Chekhov translations in PD, Jack London, Mark Twain sketches) are good B2–C1 material once excerpted. [I] The US public-domain cutoff moves each 1 January (works published in 1930 entered on 2026-01-01). Translations are separate copyrights.

---

## 4. Not usable (and why)

| Source | Why not | Evidence |
|---|---|---|
| **OneStopEnglish corpus** (Vajjala & Lučić 2018; HF `iastate/onestop_english`, `SetFit/onestop_english`) | Repo says CC BY-SA 4.0, but the texts are Macmillan's onestopenglish.com rewrites of *Guardian* articles. The paper says "We acquired permission both from Onestopenglish.com and The Guardian to release this plain-text version" and thanks them "for allowing us to release the corpus for research use". [I] The CC BY-SA label may exceed what the rights holders granted; don't rely on it commercially. Also 2013–2016 news, no topic labels. | [V][24][25] |
| **CLEAR corpus** (CommonLit) | "CC BY-NC-SA 4.0". [I] It is useful as a **finder**, though: each of the 4,724 excerpts has URL and licence columns (2,907 from gutenberg.org, 455 from kids.frontiersin.org, 275 Simple Wikipedia, 250 African Storybook; 694 marked CC BY 4.0). Fetch the original text from that source instead of copying CLEAR's excerpt or scores. | [V][26][27] |
| **Cambridge English Readability Dataset** (Xia et al. 2016) | "non-commercial research and educational purposes only"; "Do not provide the corpus … to others"; "Do not release items (e.g. models, data statistics) derived from the corpus without prior approval". The HF copy `UniversalCEFR/cambridge_exams_en` is tagged CC BY-NC-SA. | [V][28][30] |
| **CEFR-SP** (Arase et al. 2022) | Sentences, not texts. The SCoRE part is CC BY-NC-SA 4.0; the Newsela part needs a Newsela licence; only the Wiki-Auto part is CC BY-SA 3.0. HF `edesaras/CEFR-Sentence-Level-Annotations` relabels it "MIT", which is wrong. | [V][29][31] |
| **UniversalCEFR** HF org (25 datasets incl. `readme_en`, `elg_cefr_en`, `icle500_en`, `cefr_asag_en`) | English sets are CC BY-NC or CC BY-NC-SA; ELG/ICLE/ASAG are learner writing, not reading texts. | [V][30] |
| **Newsela** | ToS: must not "sell, resell, sublicense, distribute …", must not "screen scrape … or copy the Newsela Content", may not "post or otherwise disclose Newsela Content publicly without approval". The research corpus needs a separate grant (see CEFR-SP README). | [V][32][29] |
| **WeeBit** (Vajjala & Meurers 2012) | [I] Built from WeeklyReader and BBC Bitesize, both copyrighted, and shared on request for research. HF copies (`deru35/*`) carry MIT/Apache tags with no provenance — red flag. **Not verified in a primary source.** | — |
| **Kaggle `amontgomerie/cefr-levelled-english-texts`** | Tagged "CC0: Public Domain", but its own description says texts "are taken from free resources found online including: The British Council, ESLFast, and the cnn-dailymail dataset" and unlabelled ones were auto-labelled with Text Inspector. The uploader can't place others' copyrighted text in CC0. | [V][35] |
| **Kaggle `ismaelfi/melolingua-cefr-graded-multilingual-stories`** | CC BY-NC 4.0; target languages are not English (English only as translation). | [V][36] |
| **HF `pinialt/cefr-texts-10languages`** | CC BY 4.0, but synthetic (GPT-4o-mini), ~100–150-word paragraphs, a validation set. [I] Low value; our own LLM drafts (§5.4) would be better controlled. | [V][37] |
| **Other HF community CEFR sets** (`Mr-FineTuner/*`, `DioBot2000/*`, `CarlosPov/*`, `hafidikhsan/*`, `Alex123321/english_cefr_dataset`) | No provenance on cards. Samples: single sentences, Reuters/AG News tokens (`DioBot2000`), or a CEFR word list with no stated source (`Alex123321`, tagged Apache-2.0) [I] likely copied from EVP/Oxford lists. | [V][38] |
| **TinyStories** | CDLA-Sharing-1.0 allows commercial use, but the stories are GPT-3.5/4 synthetic and "only use a small vocabulary" aimed at 3–4-year-olds. Poor fit for teens/adults. | [V][34] |
| **Breaking News English** | "NONE OF THE MATERIALS ON THIS WEBSITE CAN BE SOLD OR MONETIZED IN ANY FORM." "Permission is not granted to reproduce the Article … on any other website, … app …". | [V][39] |
| **News in Levels** | Terms: "It is forbidden to copy anything from this app." | [V][40] |
| **CommonLit** | "solely for your own personal, noncommercial use"; must not "commercially exploit"; no scraping; bans AI tools that "scrape, train on, and/or use any content". Some content CC BY-NC-SA. | [V][41] |
| **ESL-Lounge** | "displayed, reformatted, and printed for your personal, noncommercial use only. You may not reproduce or retransmit the materials". | [V][42] |
| **Lingua.com** | "exclusively for private purposes. Digital distribution or dissemination is not permitted. Publication is not permitted. Commercial use is not permitted." | [V][43] |
| **ESLFast** | Footer "Copyright © 2006-2026. All rights reserved. rong-chang ESL, Inc." | [V][44] |
| **British Council LearnEnglish** | Terms page blocked (403); **not read**. [I] Assume all rights reserved. | — |
| **ReadWorks** | Terms page JS-only; **not read**. [I] Assume non-commercial classroom use only. | — |
| **Easy Stories in English, "Short Stories for ESL" sites** | [I] No open licence found; assume all rights reserved. | — |
| **Oxford 3000/5000, English Vocabulary Profile** (as levelling lists) | Terms not reached. [I] Proprietary publisher lists; use CEFR-J instead. | — |

---

## 5. Levelling texts ourselves

### 5.1 Wordlists
- **CEFR-J Vocabulary Profile 1.5** (A1–B2) and **CEFR-J Grammar Profile** — https://github.com/openlanguageprofiles/olp-en-cefrj — "can be used for research and commercial purposes with no charge, provided that you cite the dataset properly. The copyright belongs to Tono Laboratory at TUFS" [V][22].
- **Octanove Vocabulary Profile C1/C2** (same repo) — "Creative Commons Attribution-ShareAlike 4.0" [V][22]. [I] Using it only as an internal lookup to score texts is not distributing an adaptation, so ShareAlike shouldn't be triggered. Don't ship the list itself in the app without CC BY-SA.
- **VOA Learning English Word Book** — public domain core list [V][5].

### 5.2 Suggested rule-based pipeline [I]
Tokenise with the existing `build_text.py` → lemmatise → % of tokens at or below each CEFR-J level + mean sentence length + a readability formula. Proposed first-pass thresholds (to be calibrated on the five existing texts and teacher judgement): assign the lowest level at which ≥95% of tokens (excluding names) are covered and mean sentence length fits (A1 ≤ 8, A2 ≤ 12, B1 ≤ 16, B2 ≤ 22 words). Then teacher review. This also feeds the dictionary coverage check (`scripts/reading/coverage.ts`).

### 5.3 Open CEFR classifiers (second opinion only)
- `UniversalCEFR/ModernBERT-base-cefr-all-classifier` — Apache-2.0, but the card says it was trained "on an unknown dataset" [V][45]. [I] Probably UniversalCEFR data, which is mostly NC. Using the model internally to *suggest* a label is low risk, but don't build a product feature on it without clarifying.
- `AMontgomerie/CEFR-English-Level-Predictor` (MIT code) — [I] trained on the scraped Kaggle set above; same caution.
- `dksysd/cefr-classifier` — CC BY-NC-SA 4.0 [V][45]; not for commercial use.

### 5.4 Fallback: LLM-drafted texts
[I] For empty topic × level cells (especially A1–A2 adult topics and C1 opinion pieces), draft 150–600-word texts with an LLM constrained to the CEFR-J list for that level, on Mongolia-relevant themes. Then a teacher reviews and edits and we fact-check. We own the output, subject to the model provider's terms. Mark such texts as "StepUp original".

---

## 6. Proposed topic taxonomy (12 topics) and source mapping

Topics are chosen for Mongolian teens and adults (school/university, first jobs, city life in Ulaanbaatar, herding/nature, travel abroad, study-abroad goals). Mongolian labels are drafts for the copy skill to polish.

| # | Topic (EN / MN draft) | A1–A2 sources | B1 sources | B2–C1 sources |
|---|---|---|---|---|
| 1 | Daily life & home / Өдөр тутмын амьдрал | LIDA (My family, I can do many things, The weather, What are they doing?); StoryWeaver "Me and My Daily Life" | VOA Health & Lifestyle features | Simple Wikipedia (edited) |
| 2 | Food & cooking / Хоол хүнс | LIDA (Food); StoryWeaver food stories | VOA Health & Lifestyle (nutrition) | Wikinews; Frontiers (nutrition, Human Health) |
| 3 | Health & body / Эрүүл мэнд | LIDA (Getting medicine, Giving birth — check suitability); StoryWeaver Lifeskills | VOA Health & Lifestyle | Frontiers Human Health; Neuroscience & Psychology |
| 4 | Work & money / Ажил, мөнгө | LIDA (Finding a job, Standing out for the right reason) | VOA As It Is (VOA-written items only), Education Tips (careers) | Wikinews Economy; Frontiers Mathematics & Economics |
| 5 | School & learning / Сургууль, суралцах | StoryWeaver "School Stories" | VOA Education Tips, Ask a Teacher | VOA Education; Simple Wikipedia |
| 6 | Travel & places / Аялал, газар орон | StoryWeaver "Place & Culture" | VOA American Places, National Parks | Wikinews; Simple Wikipedia (countries/cities) |
| 7 | Nature & animals / Байгаль, амьтан | StoryWeaver "Science & Nature", "Animal Stories" (non-fiction) | VOA Science & Technology (VOA-written) | Frontiers Biodiversity, Earth Sciences |
| 8 | Science & space / Шинжлэх ухаан | StoryWeaver STEM | VOA Science & Technology (VOA-written), American Inventors | Frontiers Astronomy & Physics, Chemistry |
| 9 | Technology & internet / Технологи | StoryWeaver STEM | VOA Science & Technology (VOA-written) | Frontiers Engineering & Technology; Wikinews Sci-Tech |
| 10 | History & people / Түүх, хүмүүс | StoryWeaver "Biographies", "History and Culture" | VOA U.S. History, America's Presidents, people profiles (e.g. Pearl S. Buck) | Gutenberg/Standard Ebooks essays; Simple Wikipedia biographies |
| 11 | Culture, arts & language / Соёл, урлаг, хэл | LIDA (What sort of music do you like?); StoryWeaver folktales | VOA Arts & Culture, Words & Their Stories | VOA American Stories; Standard Ebooks short fiction |
| 12 | Stories & fiction / Өгүүллэг | StoryWeaver fiction L3–L4; McGuffey (edited) | VOA American Stories (PD originals) | Standard Ebooks / Gutenberg short stories (O. Henry, London, Twain) |

(Sports is thin in every open source: some Wikinews Sports and VOA items. Merge it into "Culture" or fill it with LLM-drafted texts.)

**Data model hint [I]:** add `topic` (one of the 12 slugs) and `sourceLicense` (`public-domain` | `cc-by-4.0` | `cc-by-sa-4.0` | `cc0`) to `ReadingText`, plus a free-text `credit` that keeps the exact attribution string (StoryWeaver `copyrightNotice`, LIDA author line, VOA writer line, Wikipedia URL + licence link).

---

## 7. Open questions for the owner

1. **ShareAlike:** are we willing to publish CC BY-SA adaptations (Simple Wikipedia) under CC BY-SA, with no technical restrictions on those texts? If not, drop Simple Wikipedia and keep PD/CC BY only.
2. **Children's content:** is StoryWeaver-style picture-book content acceptable for A1–A2 teens and adults, or should A1–A2 rely on LIDA + LLM-drafted adult texts?
3. **VOA filtering effort:** OK to reject every AP/AFP/Reuters-adapted item, even though they are the most topical ones? (Recommended.)
4. **LLM-drafted texts:** acceptable as a labelled "StepUp original" category, with teacher review mandatory?
5. **Contact publishers?** Pratham Books (bulk use of StoryWeaver), LIDA (whether the NC stories could be relicensed for us) and possibly Macmillan (OneStopEnglish commercial licence) are worth one email each.
6. **Local law:** Mongolian copyright rules (public-domain term, educational exceptions) were not researched. A local lawyer should confirm before the freemium launch.

Not verified in this pass: StoryWeaver reading-level definitions and per-book licence variants; British Council and ReadWorks terms; WeeBit's licence; the Oxford/EVP terms; the per-article licence line on Frontiers for Young Minds; the licence of LIDA/Global Storybooks audio.

---

## Sources

1. VOA Learning English — Terms of Use and Privacy Notice — https://learningenglish.voanews.com/p/6021.html
2. VOA Learning English home page (section navigation) — https://learningenglish.voanews.com/
3. VOA Learning English — About Us; Beginning/Intermediate/Advanced pages — https://learningenglish.voanews.com/p/5373.html, /p/5609.html, /p/5610.html, /p/5611.html
4. VOA Learning English section archives and article credit lines (e.g. `/z/955`, `/z/1579`, `/z/986`, `/z/3521`, `/z/1581`; `/a/a-short-history-of-spacecraft-landings-on-the-moon/8001341.html`, `/a/study-shows-how-earth-s-orbit-affects-ice-ages/7997495.html`, `/a/scientists-link-gene-to-human-speech/7985890.html`) — fetched 2026-09-18
5. VOA Learning English Word Book (PDF) — https://docs.voanews.eu/en-US-LEARN/2022/06/07/c4dbd6af-5f63-4f28-bc42-0bd175f4e4b4.pdf
6. Global Storybooks FAQ — https://globalstorybooks.net/faq/
7. Pratham Books — Creative Commons — https://prathambooks.org/cc/
8. StoryWeaver public API: `https://storyweaver.org.in/api/v1/books/filters`, `/api/v1/books-search?languages[]=English&levels[]=N`, `/api/v1/stories/369-the-red-raincoat`
9. LIDA Stories UK — home and About — https://lidastories.net/uk/ , https://lidastories.net/uk/about/
10. LIDA Stories UK story pages 0001–0030 (licence links) — https://lidastories.net/uk/stories/en/0001/ … /0030/
11. African Storybook — https://www.africanstorybook.org/
12. Global Storybooks audio repository README (per-story licences) — https://gitlab.com/global-asp/gsn-audio (mirror note: https://github.com/global-asp/gsn-audio)
13. Frontiers — "Using Frontiers for Young Minds articles in your classroom" (2017) — https://www.frontiersin.org/news/2017/07/05/frontiers-for-young-minds-using-frontiers-for-young-minds-articles-in-your-classroom/
14. Frontiers for Young Minds — About — https://kids.frontiersin.org/about
15. Simple English Wikipedia siteinfo API (rights, statistics) — https://simple.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=rightsinfo|statistics
16. Wikimedia Terms of Use — https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use
17. Wikinews Main Page and siteinfo API — https://en.wikinews.org/wiki/Main_Page
18. Wikinews:Copyright — https://en.wikinews.org/wiki/Wikinews:Copyright
19. Standard Ebooks — About — https://standardebooks.org/about
20. Project Gutenberg License — https://www.gutenberg.org/policy/license.html
21. Gutendex search of Project Gutenberg catalogue ("mcguffey", "graded") — https://gutendex.com/books/?search=mcguffey
22. Open Language Profiles — CEFR-J datasets README — https://github.com/openlanguageprofiles/olp-en-cefrj
23. CC BY-SA 4.0 legal code (§2(a)(5)(B), no technological measures; §3(b) ShareAlike) — https://creativecommons.org/licenses/by-sa/4.0/legalcode.en (not re-fetched in this pass; cited from the licence text)
24. OneStopEnglish corpus repository README — https://github.com/nishkalavallabhi/OneStopEnglishCorpus ; HF card https://huggingface.co/datasets/iastate/onestop_english
25. Vajjala & Lučić (2018), OneStopEnglish corpus, BEA workshop — https://aclanthology.org/W18-0535.pdf
26. CLEAR corpus repository README and `CLEAR_corpus_final.xlsx` (columns URL, License, Categ, Sub Cat) — https://github.com/scrosseye/CLEAR-Corpus
27. Crossley et al. (2022/2023), A large-scaled corpus for assessing text readability, *Behavior Research Methods* (linked from [26])
28. Cambridge English Readability Dataset — licence page — https://researchdatasets.cambridge.org/cambridge-english-readability-dataset (linked from https://ilexir.co.uk/datasets/index.html)
29. CEFR-SP corpus README — https://github.com/yukiar/CEFR-SP/tree/main/CEFR-SP
30. UniversalCEFR Hugging Face organisation and cards (e.g. `cambridge_exams_en`, `cefr_sp_en`, `readme_en`, `elg_cefr_en`) — https://huggingface.co/UniversalCEFR
31. HF `edesaras/CEFR-Sentence-Level-Annotations` card — https://huggingface.co/datasets/edesaras/CEFR-Sentence-Level-Annotations
32. Newsela Terms — https://newsela.com/terms
33. Newsela data page (no longer describes the research licence as of 2026-09-18) — https://newsela.com/data/
34. TinyStories dataset card — https://huggingface.co/datasets/roneneldan/TinyStories
35. Kaggle — CEFR Levelled English Texts (metadata via API) — https://www.kaggle.com/datasets/amontgomerie/cefr-levelled-english-texts
36. Kaggle — MeloLingua CEFR-Graded Multilingual Stories — https://www.kaggle.com/datasets/ismaelfi/melolingua-cefr-graded-multilingual-stories
37. HF `pinialt/cefr-texts-10languages` card — https://huggingface.co/datasets/pinialt/cefr-texts-10languages
38. HF datasets API search `?search=cefr` and first-rows samples for `Mr-FineTuner/CEFR_Mixed_Dataset_1`, `DioBot2000/CEFR_dataset_NEWs_3000`, `Alex123321/english_cefr_dataset`, `hafidikhsan/cefr-lexical-balance-dataset-50-50-50`
39. Breaking News English — Copyright — https://breakingnewsenglish.com/copyright.html
40. News in Levels — Terms of Use — https://www.newsinlevels.com/terms-of-use/
41. CommonLit — Terms — https://www.commonlit.org/en/terms
42. ESL-Lounge — Copyright Notice — https://www.esl-lounge.com/copyright.php
43. Lingua.com — Terms — https://lingua.com/terms/
44. ESLFast home page footer — https://www.eslfast.com/
45. HF model cards: `UniversalCEFR/ModernBERT-base-cefr-all-classifier`, `dksysd/cefr-classifier` (via `https://huggingface.co/api/models?search=cefr`)
