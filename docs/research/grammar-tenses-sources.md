# Grammar module: tense lessons, sources and licenses — research notes

Date: 2026-09-15
Scope: sources for structured tense lessons, from A1 to C1. That covers the 12 tense/aspect combinations, future forms (will, going to, present continuous for future), and past habits (used to / would). For each source: what it offers, and whether a freemium product may adapt it, translate it into Mongolian and host it. Primary sources only. **This is not legal advice.**

Legend: **[V]** = verified in the cited primary source (quotes are verbatim or near-verbatim). **[S]** = seen only in a search-engine snippet of the primary page, because the page itself blocked the fetcher (403 or timeout). Re-check before relying on it. **[I]** = our inference or interpretation.

Access notes: britishcouncil.org/terms timed out three times. learnenglish.britishcouncil.org/terms-of-use returned 403, and its /legal page only showed the privacy notice. cambridge.org/legal and /legal/copyright, the Cambridge Grammar in Use catalogue page and the Cambridge EGP blog post all returned 403. englishprofile.org rendered only a header. The eCampusOntario Pressbooks pages, the Benjamins journal page and openstax.org/general/faq returned 403 or 404. The old state.gov copyright page returned an error. Several PDFs were downloaded and their text extracted locally: the Core Inventory, the NUCLE license, the CoEdIT paper, the Mongolian papers and the Brosig thesis.

## 1. Hugging Face datasets and GEC corpora

| Dataset | What it is | License / terms | Commercial use? |
|---|---|---|---|
| **W&I+LOCNESS (BEA-2019)** `bea2019st/wi_locness` | Learner essays (A–C levels) plus native essays, annotated with corrections | [V] License field "other". W&I grants use "for non-commercial research and educational purposes". Non-commercial "exclude[s] … any use of the licensed dataset or information derived from the dataset for or as part of a product or service which is sold, offered for sale, licensed, leased or rented". Excerpts "of less than 100 words" may be published. LOCNESS: "non-commercial purposes only", and "No part of the corpus is to be distributed to a third party without specific authorization". [1] The BEA-2019 page adds: "All corpora are subject to similar licences and may only be used for non-commercial purposes." [2] | **No.** [I] Even "information derived" from it inside a paid product is excluded, so use it for private evaluation during research only, and check that even this counts as "research". |
| **FCE** (same BEA page) | Cambridge FCE learner scripts with error annotation | [V] Non-commercial, same as above [2] | No |
| **Lang-8 (NAIST)** | Learner sentences with corrections, scraped from Lang-8 | [V] "available only for research and educational purposes". For commercial products, "contact Lang-8 support desk" [3] | No |
| **NUCLE** `nusnlp/NUCLE` | About 1,400 NUS student essays with error tags | [V] "NUS Non-commercial research/trial corpus license". Allowed purposes are "testing and evaluation purposes" or "non Commercial Use including for academic or internal non profit research". No distribution to third parties. Other purposes "including any Commercial Use" need "a separate licensing" agreement [4][5] | No, without a separate NUS license |
| **JFLEG** `jhu-clsp/jfleg` | Learner sentences with fluency-oriented corrections (GEC benchmark) | [V] "cc-by-nc-sa-4.0". The card lists the data source as "[More Information Needed]" [6] | No |
| **CoEdIT** `grammarly/coedit` | 82K text-editing instructions, including "Fix grammar" | [V] The card says `apache-2.0`, and the release includes "only the instances that were acquired and curated from publicly available datasets" [7]. [V] The paper lists the GEC/fluency training data as "NUCLE-14, Lang-8, BEA-19" [8]. | **Unclear, treat as no.** [I] The Apache label on the card does not remove the non-commercial terms of its NUCLE, Lang-8 and W&I sources. Don't ship its GEC rows or train a commercial model on them without legal review. |
| **C4_200M** (Google) | 185M synthetic sentence pairs with errors inserted | [V] "The corruption edits in this dataset are licensed under CC BY 4.0". The base C4 text must be obtained separately [9]. [V] C4 is "ODC-BY", and "you are also bound by the Common Crawl terms of use" [10]. | [I] Probably yes with attribution. But the sentences are web text of mixed quality with no CEFR level. Better for training or evaluating an error detector than as learner-facing content. |
| `agentlans/grammar-correction` | A filtered subset of C4_200M | [V] No license field. The card says "Please check the licenses of those datasets" [11] | Unclear, so avoid; use the C4_200M upstream directly |
| `Abhilash-AI-Lab/english-5k` | About 5K template-generated grammar exercises, e.g. "Rewrite this sentence in the past tense" | [V] Apache-2.0. "hand-authored templates, rule tables, and solvers". "no third-party language model was used". Difficulty is easy/medium, with no CEFR labels [12] | Yes. [I] Small and simple. Useful as a reference for exercise templates, not as a syllabus. |

Grammar explanation datasets: we found **no** Hugging Face dataset of learner-quality tense explanations with a clear commercial license.

## 2. Kaggle and other tense-labelled sets

| Dataset | License field | Upstream / notes | Verdict |
|---|---|---|---|
| `hafizflow/english-tense-classification` | [V] Apache 2.0 [13] | [V] Labels are only present/past/future (about 1 MB). **No upstream source is stated** [13] | [I] The origin is unknown, so the Apache label can't be trusted. Only 3 coarse labels. Don't use it for content. |
| `leewanhung/tense-dataset` | [V] "Unknown" [14] | [V] "created by generating example sentences". It has 11 labels (no future perfect continuous) [14]. The generation method is not stated. | No: no license |
| Mendeley "EnglishTense" (jnb2xp9m4r v2) | [V] CC BY 4.0 [15] | [V] 13,316 sentences with present/past/future labels. **The page does not say where the sentences came from** [15] | [I] OK for an internal classifier test. The CC BY label is only as good as the uploader's rights. Don't show these sentences to learners. |

[I] None of these tells simple, continuous, perfect and perfect continuous apart in a trustworthy way. Tagging Tatoeba sentences ourselves (§5) is cleaner.

## 3. Open textbooks, OER and publisher terms

| Source | License / terms | Commercial use? | Notes |
|---|---|---|---|
| **Wikibooks: English Grammar** | [V] "Creative Commons Attribution-ShareAlike License" [16] | Yes, but ShareAlike | [V] Chapter 1 (parts of speech) is 75% developed, Chapter 2 is 25% and Chapter 3 is 0%. It has no real tense coverage [16]. [I] Not worth adapting. |
| **LibreTexts: High-Intermediate Academic Grammar for ESL Students** (Al Haider) | [V] Pages are "shared under a CC BY 4.0 license". The book says a "detailed breakdown" of licensing is in its back matter, so check each page [17] | Yes, with attribution | Covers simple present, simple past and present perfect inside themed academic units. [I] It is aimed at US college readers, not A1–B1 adults. |
| **Open Textbook Library: Advanced Academic Grammar for ESL Students** (Al Haider) | [V] "Creative Commons Attribution 4.0" [18] | Yes | [V] Tense content is spread through the content chapters (e.g. "Consistent verb tense") [18] |
| **LibreTexts: ESL Worksheets** (Borhan) / **ESOL Advanced Grammar** (Marceau) | [S] CC BY-NC 4.0 / CC BY-SA [19] | BY-NC: no. BY-SA: yes with ShareAlike | Check the per-page licenses |
| **eCampusOntario: Verb Tenses for English for Academic Purposes** (Martin & McHardy) | [S] CC BY-NC-SA 4.0 [20] (pages returned 403) | **No** | [S] One chapter per tense, plus review chapters (e.g. "Review of Future Tenses"). [I] A good structural reference; don't copy its text. |
| **OpenStax** | The FAQ URL returned 404. **We found no OpenStax English grammar/ESL book.** | — | — |
| **US government (American English / State Dept)** | [V] USA.gov: a government work is "created by a U.S. government officer or employee as part of their official duties". "Not everything that appears on a federal government website is a government work". Logos need permission. "U.S. copyright laws may not protect U.S. government works outside the country." [21] americanenglish.state.gov links to a State Dept "Copyright Info" page that we **could not read** [22]. | [I] Staff-authored text is probably PD. Many teaching resources are by outside authors, so check each item. | [S] Teacher's Corner has tense games and grammar-in-context ideas [23] |
| **British Council LearnEnglish / TeachingEnglish** | [S] British Council terms: must not use content "for commercial purposes without prior written approval", and "must not republish any British Council Content on another website" [24]. [S] LearnEnglish: a licence "for study and research purposes only, but not for commercial purposes" [25]. **Neither page was read directly.** | **No** | Don't copy explanations, exercises or examples |
| **Cambridge (Dictionary grammar pages, Grammar in Use)** | [S] cambridge.org: material "may be downloaded and printed solely for personal reference, but not otherwise copied, distributed, adapted or altered" without written permission [26]. [V] Cambridge Dictionary Learning Pathways terms: "You must not reproduce, distribute, modify, create derivative works of … republish … without our prior written consent". "You agree not to use … our materials for the purposes of training AI Technology" [27] | **No** | [S] The Dictionary accepts permission requests and "API development kit" applications [26] |
| **Perfect English Grammar** | [V] Sold as annual teacher/school licences ($39 / $249 / $499). "One licence covers unlimited students". "Download our PDFs, then print, email or upload to your LMS" [28]. It grants no right to republish in another product. The terms page returned 404. | **No** | Classroom licence only |
| **EF (English Live)** | [S] "limited, non-exclusive, revocable permission to make personal, non-commercial use". "You may not post, distribute, sublicense, translate or reproduce" without "prior express written consent" [29] | **No** | — |

## 4. CEFR grammar inventories (syllabus order)

**British Council–EAQUALS Core Inventory for General English, 2nd ed. 2015** (North, Ortega, Sheehan) [30]
- [V] "Copyright British Council/EAQUALS … except where otherwise stated". ISBN 978-086355-653-1. It is a free PDF on TeachingEnglish [30][31]. No open license is stated.
- [V] Its purpose is to document good practice: the book calls itself "a documentation of good practice" and describes "broad agreement on … when different aspects of the future should be introduced into the classroom" [30].
- [V] Tense-related grammar items per level, from the level lists (item names only) [30]:

| Level | Tense / future / past-habit items |
|---|---|
| A1 | Present simple · Present continuous · Past simple of "to be" · Past simple · Going to |
| A2 | Present continuous for future · Future time (will and going to) · Past continuous · Present perfect (plus review of A1 items) |
| B1 | Present perfect continuous · Present perfect/past simple · Past perfect · Future continuous · Will and going to, for prediction · Reported speech (range of tenses) |
| B2 | Future perfect · Future perfect continuous · Past perfect continuous · Narrative tenses · Would expressing habits, in the past (plus review of future continuous, past perfect, will/going to) |
| C1 | Futures (revision) · Narrative tenses for experience, incl. passive |

- [V] "Used to" appears in the appendix matrix under "Narrative". We did not find it in the level lists we extracted, so check its level in the PDF [30].
- [I] **What we can use:** the *ordering* (which form at which level) is a set of facts or ideas, and copyright generally protects expression, not ideas. Building our own syllabus that follows this level mapping, citing the Core Inventory as the basis, is low risk. **What we can't:** copying its text, example sentences or poster layouts. Confirm with a lawyer if the syllabus ends up matching item for item.

**English Grammar Profile (EGP), Cambridge / English Profile**
- [S] A free online tool on englishprofile.org giving grammar "can-do" statements per CEFR level, compiled by Anne O'Keeffe and Geraldine Mark [32]. Learner examples "come from the Cambridge Learner Corpus" (quoted in the ninja33/EGP README) [33].
- **Terms of use were not reached** (englishprofile.org rendered empty, the Cambridge blog and Benjamins pages returned 403). Treat it as all rights reserved.
- [V] The GitHub repo `ninja33/EGP` redistributes "a copy of" the EGP spreadsheet with **no LICENSE file** [33]. [I] Don't use that copy.
- [I] Use EGP only to cross-check level placement, reading it on the site. Don't copy statements or learner examples (Cambridge Learner Corpus data is proprietary).

## 5. Open example sentences and morphology data

| Source | License [V] | Tense info | Use |
|---|---|---|---|
| **Tatoeba** | "released under CC BY 2.0 FR", with some CC0 [34][35]. CC BY requires crediting the author, and "it is your responsibility to circulate it with its license" [34]. The Detailed Sentences export includes "Username". Audio exports include "License" and "Attribution URL" per file [35]. | None (we would tag it ourselves) | **Yes.** It's the main learner-facing example pool. Store `sentence_id`, `username` and license per sentence, and show "Sentence #id by username, Tatoeba, CC BY 2.0 FR". Filter audio by license. |
| **UD English-EWT** | Annotations "Creative Commons Attribution-ShareAlike 4.0". Source text "© 2012 Google Inc., © 2011 Yahoo! Inc., © 2012 Trustees of the University of Pennsylvania and/or © other original authors" (from LDC2012T13 web genres) [36] | English UD uses only `Tense=Pres/Past`. Perfect/progressive/future are not features: "we mark (verbs) only with the tense feature". They show up through the auxiliary + `VerbForm=Part` structure [37] | [I] The raw web text has third-party copyright beyond the SA license, and it's messy. Use it internally to build or test our tense tagger (aux + participle rules), not as display content. |
| **UD English-GUM** | "CC BY-NC-SA 4.0" [38] | Tense, VerbForm in FEATS [38] | **Internal evaluation only** (NC) |
| **UniMorph eng** | Repo lists "Source: Wikipedia", license CC BY-SA 3.0 [39] | Verb paradigms (V;PST, V;V.PTCP;PST, …) | [I] Useful for irregular-verb tables. Individual inflection facts ("go–went–gone") are not creative expression, but a copied *dataset* should carry CC BY-SA. Simplest route: build our own irregular-verb list and cross-check it against UniMorph/Wiktionary. |
| **Wiktionary** | "CC-BY-SA" 4.0 and GFDL. Reuse must "license your materials under the same, similar, or compatible license" [40] | Conjugation tables | Same as UniMorph |

## 6. How strong products structure tense teaching (structure only)

- **English Grammar in Use (Murphy, Cambridge):** [S] 136 two-page units, with "explanations and examples on the left and exercises on the right" [41]. [I] Typical unit parts: form table, uses with situational examples, contrast units (e.g. present perfect vs past simple as separate units), and appendices for irregular verbs and future forms. The book is all rights reserved, so we copy the *shape* only.
- **Duolingo:** [V] English B1/B2 sections 5–8 are CEFR-aligned. "Lessons and exercises draw learners' attention to exactly what they need to notice". It mixes definition exercises, dialogue exercises and image-cued fill-in-the-blank, with native-language hints available [42]. [V] "Grammar Skills" clarify "the rules around tenses, verb usage, sentence structure" without new vocabulary. "Smart Tips" explain why an answer was wrong, and "learners who saw these explanations made fewer subsequent errors" [43]. [I] Takeaway: short explicit notes plus lots of contextual practice, with error-specific feedback.
- **Grammarly verb-tenses article:** [V] It goes from definition, to the 4 aspects, to one chart of all 12 tenses, to per-time sections, to an FAQ. It uses formula notation like "[had] + [past participle]" and bold verb forms in examples [44].
- **eCampusOntario Verb Tenses for EAP:** [S] one chapter per tense plus "Review of …" chapters [20].
- [I] **Unit template for StepUp**, synthesised from the above: (1) short situational hook, (2) form table (+ / − / ?), including contractions, (3) 2–3 uses, each with a timeline diagram, (4) signal words (e.g. *already, yet, since, for* / *yesterday, ago*), (5) contrast pair with the neighbouring tense, (6) Mongolian note on the typical L1 mistake, (7) graded practice: recognise → choose → gap-fill → transform → free sentence (AI feedback later), (8) spaced review in the tracker.

## 7. Mongolian L1 learners and English tense/aspect

**Little direct research exists, and most of it is on Inner Mongolian (China) learners who are bilingual in Chinese.**

- [V] **Bao (2015), English Language and Literature Studies 5(1), CC BY 3.0:** 50 Mongolian English majors at Inner Mongolia University for Nationalities, "bilingual, they can speak both Mongolian and Chinese". Verb errors numbered 180 (14.65% of all errors), and "41 students make errors on use 'tense'". Examples include "I go to Beijing last month" and misuse of the present perfect with a duration. The paper notes that Mongolian has tense too, but "verbs always appear at the end of the sentences", which causes adverb-placement errors such as "My brother hard study…". Some errors are attributed to Chinese as the learners' L2 [45].
- [V] **Qian (2015), English Language Teaching 8(7):** Chinese vs Mongolian college students (120 cloze passages, 20 compositions). "lexical aspect significantly influenced tense-aspect marking use". There is evidence of L1 transfer, including "overextending progressive markings to States" (e.g. *I am knowing*) [46].
- [V] **Byambasaikhan et al. (2024), IAFOR ACAH proceedings:** 560 entrance-exam essays in Mongolia (GMIT). Misuse of "the" and omission of articles make up "83.7% of total errors", because of "the absence of definite and indefinite article grammar in the Mongolian language" [47]. This is about articles, not tense, but it is the only Mongolia-based study we found.
- [V] **How Mongolian marks tense and aspect (Brosig 2014, PhD thesis, Stockholm):** Khalkha has a habitual/generic present suffix (-dag), a converb-based progressive construction, a resultative construction, a participle + copula construction that "expresses perfect meaning" (while the participle alone "expresses past semantics"), and past forms that encode evidentiality (firsthand vs non-firsthand) [48]. Our reading of what this means for teaching:
  - Mongolian has a progressive of its own, and it applies to more verb types than English's. This may help explain progressive overuse with state verbs (Qian [46]).
  - Mongolian marks evidential and "resulting state" meanings where English uses the present perfect or past simple. A careful contrast note is needed.
  - The -dag habitual maps onto English present simple, used to and would. It's a good anchor for a Mongolian explanation.
  - SOV order (verb last) affects where learners put auxiliaries and adverbs [45].
- **Gaps:** we found no corpus study of Khalkha-speaking adults in Mongolia making English tense errors, no Mongolian material in the English Profile/CLC and no Mongolian-L1 GEC dataset. [I] Our own learner data (with consent) could fill this later.

## 8. Recommended content pipeline

1. **Syllabus and level order: Core Inventory for General English** [30], cross-checked against EGP [32] and Grammar in Use unit order. We write our own item names and descriptions and cite the Core Inventory as the level basis. Suggested order (following [30]): A1 present simple, present continuous, past simple (be, then regular/irregular), going to → A2 past continuous, present perfect (experience), will vs going to, present continuous for future → B1 present perfect vs past simple, present perfect continuous, past perfect, future continuous, used to (level to confirm) → B2 past perfect continuous, future perfect (+ continuous), narrative tenses, would for past habits → C1 future forms in review, narrative tenses in passive, tense in reported speech.
2. **Explanations, timelines, signal words, contrast pairs: written by hand** in English and Mongolian. No text copied from Cambridge, British Council, EF, Perfect English Grammar or BY-NC OER. CC BY OER (Al Haider [17][18]) may be adapted with attribution. We avoid ShareAlike text in core lessons so the lessons don't have to become BY-SA themselves.
3. **Example sentences: Tatoeba** (CC BY 2.0 FR / CC0) [34][35], tagged automatically by tense/aspect. The tagger is rule-based: aux + VerbForm patterns, following UD conventions [37], tested on UD EWT [36]. A human checks each sentence for level and naturalness. Store `tatoeba_id`, `username`, `license` and display a credit line. Add our own hand-written sentences for gaps, e.g. future perfect continuous, which is rare in Tatoeba [I].
4. **Auto-generated exercises**: gap-fill with a verb in brackets, choose the tense, transform (e.g. to negative or question), spot the error. These are built from Tatoeba sentences plus our own irregular-verb table, cross-checked against UniMorph/Wiktionary [39][40]. Template ideas from `english-5k` (Apache-2.0) [12]. Generated items inherit the credit of their source sentence.
5. **Internal evaluation only, never shown to learners or used to train a shipped model**: W&I+LOCNESS [1], FCE [2], NUCLE [4], Lang-8 [3], JFLEG [6], GUM [38], CoEdIT's GEC rows [7][8] (until legal review), Kaggle/Mendeley tense sets [13][14][15]. [I] Even internal use of W&I, NUCLE and Lang-8 by a company is doubtful under their "research/educational" wording. Ask the licensors or a lawyer before running them.
6. **Possible commercial training data for a later AI error checker**: C4_200M edits (CC BY 4.0) plus C4 (ODC-BY + Common Crawl terms) [9][10], with attribution. Needs a check before launching the paid tier.
7. **Mongolian L1 notes (hand-written, informed by [45]–[48])**: progressive with state verbs, present perfect vs past simple, -dag vs present simple / used to / would, verb-final order and auxiliary placement, missing third-person -s and past -ed, and articles as a cross-module note.

## Compact license table

| Source | License | Adapt + translate + host commercially? |
|---|---|---|
| Core Inventory (BC/EAQUALS) | © British Council/EAQUALS | Level mapping as idea: yes [I]. Text: no |
| English Grammar Profile | Terms not found; assume © Cambridge | Cross-check only |
| British Council, Cambridge, EF, Perfect English Grammar | All rights reserved / personal or classroom only | No |
| Wikibooks English Grammar | CC BY-SA | Yes (SA), but thin |
| LibreTexts / OTL Al Haider books | CC BY 4.0 (per page) | Yes, with attribution |
| eCampusOntario Verb Tenses EAP; LibreTexts ESL Worksheets | CC BY-NC-SA / CC BY-NC [S] | No |
| US gov staff-authored works | Not copyrighted in US [V] | Yes, per item; not outside US by default [I] |
| Tatoeba | CC BY 2.0 FR / CC0 | Yes, per-sentence credit |
| UD EWT | CC BY-SA 4.0 + source-text © | Internal tagger work |
| UD GUM | CC BY-NC-SA 4.0 | Internal only |
| UniMorph eng / Wiktionary | CC BY-SA 3.0 / CC BY-SA 4.0 + GFDL | Cross-check; own list |
| W&I+LOCNESS, FCE, NUCLE, Lang-8 | Non-commercial research licenses | No |
| JFLEG | CC BY-NC-SA 4.0 | No |
| CoEdIT | Card Apache-2.0, but GEC rows from NC sources | Unclear, so no for GEC rows |
| C4_200M / C4 | CC BY 4.0 edits / ODC-BY + CC terms | Yes for model training, with attribution [I] |
| english-5k | Apache-2.0 | Yes |
| Kaggle hafizflow | Apache 2.0, no upstream stated | No (origin unknown) |
| Kaggle leewanhung | Unknown | No |
| Mendeley EnglishTense | CC BY 4.0, source unstated | Internal only |

## Open questions

- Read the British Council, LearnEnglish, Cambridge and EGP terms pages directly (they blocked the fetcher).
- Confirm the Core Inventory level for "used to", and whether a syllabus matching it item for item is fine (lawyer).
- Does internal company evaluation count as "research" under the W&I, NUCLE and Lang-8 licenses? Ask the licensors.
- Tatoeba coverage per tense, especially B2 and C1 forms. Measure after tagging.
- Mongolian (Khalkha, Mongolia-based) learner error data: consider a small consented study with early users.

## Sources

1. W&I+LOCNESS dataset card and licenses — https://huggingface.co/datasets/bea2019st/wi_locness
2. BEA-2019 Shared Task data page — https://www.cl.cam.ac.uk/research/nl/bea2019st/
3. NAIST Lang-8 Learner Corpora — https://sites.google.com/site/naistlang8corpora/
4. NUS Non-commercial research/trial corpus license (NUCLE) — https://www.comp.nus.edu.sg/~nlp/conll14st/nucle_license.pdf
5. NUCLE dataset card — https://huggingface.co/datasets/nusnlp/NUCLE
6. JFLEG dataset card — https://huggingface.co/datasets/jhu-clsp/jfleg
7. CoEdIT dataset card — https://huggingface.co/datasets/grammarly/coedit
8. Raheja et al., CoEdIT: Text Editing by Task-Specific Instruction Tuning (Findings of EMNLP 2023) — https://arxiv.org/abs/2305.09857
9. C4_200M repository — https://github.com/google-research-datasets/C4_200M-synthetic-dataset-for-grammatical-error-correction
10. allenai/c4 dataset card — https://huggingface.co/datasets/allenai/c4
11. agentlans/grammar-correction — https://huggingface.co/datasets/agentlans/grammar-correction
12. Abhilash-AI-Lab/english-5k — https://huggingface.co/datasets/Abhilash-AI-Lab/english-5k
13. Kaggle hafizflow/english-tense-classification (API metadata) — https://www.kaggle.com/datasets/hafizflow/english-tense-classification
14. Kaggle leewanhung/tense-dataset (API metadata) — https://www.kaggle.com/datasets/leewanhung/tense-dataset
15. Mendeley Data EnglishTense v2 — https://data.mendeley.com/datasets/jnb2xp9m4r/2
16. Wikibooks English Grammar — https://en.wikibooks.org/wiki/English_Grammar
17. Al Haider, High-Intermediate Academic Grammar for ESL Students (LibreTexts PDF) — https://batch.libretexts.org/print/Letter/Finished/human-308196/Full.pdf
18. Open Textbook Library: Advanced Academic Grammar for ESL Students — https://open.umn.edu/opentextbooks/textbooks/1074
19. LibreTexts ESL Worksheets / ESOL Advanced Grammar PDFs — https://batch.libretexts.org/print/Letter/Finished/human-101489/Full.pdf ; https://batch.libretexts.org/print/Letter/Finished/human-273114/Full.pdf
20. Martin & McHardy, Verb Tenses for English for Academic Purposes — https://ecampusontario.pressbooks.pub/verbtenses/
21. USA.gov: Learn about copyright and federal government materials — https://www.usa.gov/government-copyright
22. American English: About Us (footer copyright link) — https://americanenglish.state.gov/about-us
23. American English: Teacher's Corner: Grammar Games — https://americanenglish.state.gov/resources/teachers-corner-grammar-games
24. British Council Terms of use — https://www.britishcouncil.org/terms
25. LearnEnglish Terms and Conditions — https://learnenglish.britishcouncil.org/legal
26. Cambridge University Press & Assessment: Legal – Copyright — https://www.cambridge.org/legal/copyright
27. Cambridge Dictionary Learning Pathways: Terms of use — https://learningpathways.cambridgebeta.org/policies/terms-of-service
28. Perfect English Grammar: For teachers and schools — https://www.perfect-english-grammar.com/schools.html
29. EF English Live Terms & Conditions — https://englishlive.ef.com/en/terms-and-conditions/
30. North, Ortega, Sheehan, British Council–EAQUALS Core Inventory for General English, 2nd ed. (2015) — https://www.teachingenglish.org.uk/sites/teacheng/files/pub-british-council-eaquals-core-inventoryv2.pdf
31. TeachingEnglish: Core Inventory publication page — https://www.teachingenglish.org.uk/publications/case-studies-insights-and-research/british-council-eaquals-core-inventory-general
32. English Profile: English Grammar Profile — https://englishprofile.org/?menu=english-grammar-profile ; Cambridge blog — https://www.cambridge.org/elt/blog/2017/03/09/iatefl-talk-english-grammar-profile/
33. ninja33/EGP GitHub repository — https://github.com/ninja33/EGP
34. Tatoeba Terms of Use — https://tatoeba.org/en/terms_of_use
35. Tatoeba Downloads — https://tatoeba.org/en/downloads
36. UD English-EWT README — https://github.com/UniversalDependencies/UD_English-EWT
37. UD English feature: Tense — https://universaldependencies.org/en/feat/Tense.html
38. UD English-GUM README — https://github.com/UniversalDependencies/UD_English-GUM
39. UniMorph English — https://github.com/unimorph/eng
40. Wiktionary: Copyrights — https://en.wiktionary.org/wiki/Wiktionary:Copyrights
41. Cambridge: English Grammar in Use 5th ed. catalogue — https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-grammar-use-5th-edition
42. Duolingo blog: Duolingo's new method for teaching English — https://blog.duolingo.com/how-duolingo-teaches-english/
43. Duolingo blog: All of the ways Duolingo improved its grammar skills — https://blog.duolingo.com/duolingo-grammar-skills-improvements-2021/
44. Grammarly: Verb tenses — https://www.grammarly.com/blog/grammar/verb-tenses/
45. Bao, X. (2015). Empirical Study on Morphological Errors of Mongolian Learners in English Writing. ELLS 5(1), doi:10.5539/ells.v5n1p62 — https://ccsenet.org/journal/index.php/ells/article/download/45798/24724
46. Qian, C. (2015). A Cross-Sectional Study on the Roles of Lexical Aspect and L1 Transfer in Tense-Aspect Acquisition. English Language Teaching 8(7) — https://ideas.repec.org/a/ibn/eltjnl/v8y2015i7p114.html
47. Byambasaikhan, N. et al. (2024). Analysis of the Use of English Article by Mongolian Students: On the Cases of GMIT Students. ACAH2024 Proceedings — https://papers.iafor.org/wp-content/uploads/papers/acah2024/ACAH2024_79887.pdf
48. Brosig, B. (2014). Aspect, evidentiality and tense in Mongolian: From Middle Mongol to Khalkha and Khorchin. PhD thesis, Stockholm University — https://su.diva-portal.org/smash/get/diva2:735288/FULLTEXT01.pdf
