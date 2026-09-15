# Listening module content sourcing (YouTube embeds, transcripts, licensed media) — research notes

Date: 2026-09-15
Scope: what YouTube's terms allow for a freemium, mobile-first Listening module (embed + our own interactive transcript below the player, word taps, sentence replay, 0.75x, dictation, shadowing, time auto-logged to the tracker), plus which openly licensed sources we can clip, annotate, transcribe and translate. Primary sources only. **This is not legal advice.**

Legend: **[V]** = verified in the cited primary source (quotes are verbatim or near-verbatim). **[I]** = our inference or interpretation; check it before relying on it.

Access notes: bbc.co.uk blocked the research fetcher, but the BBC "Can I share things from the BBC?" page was read through a direct HTTP download. The BBC Learning English site's own terms were **not** reached. librivox.org and the LibriVox wiki returned 403 to the fetcher; the wiki page was read through a direct download. The Common Voice terms page was only partly readable.

## 1. YouTube embed rules

Three documents apply together: the YouTube Terms of Service (ToS) [1], the YouTube API Services Terms of Service [2], and the Developer Policies [3]. The Developer Policies include Required Minimum Functionality (RMF) [4] and the IFrame Player API docs [5].

| Topic | Rule | Source |
|---|---|---|
| Embedding at all | [V] ToS: "You may also show YouTube videos through the embeddable YouTube player." Viewing is otherwise "for your personal, non-commercial use." | [1] |
| Commercial / freemium app | [V] There is no blanket ban on commercial API clients. There are specific bans on selling ads "on any page … where Content from the Service is the primary basis for such sales" [1] and on selling ads "on or within YouTube audiovisual content" without approval (Dev Policies III.G). | [1][3] |
| Paywall | [V] III.F.3.a: "must not charge users to watch content in an embedded YouTube player". III.F.3.b: "must not otherwise gate access to a video by requiring a user to take an action other than clicking the play button". The policy guide adds: "You also cannot charge people a fee for services that are offered free of charge on YouTube." | [3][6] |
| Overlays | [V] RMF: "You must not display overlays, frames, or other visual elements in front of any part of a YouTube embedded player, including player controls." The guide allows overlays "for the purposes of obtaining user consent or playback controls … so long as they do not conflict with the YouTube player UI elements." | [4][6] |
| Minimum size | [V] "Embedded players must have a viewport that is at least 200px by 200px." 16:9 players are recommended at ≥480×270. | [4][5] |
| Hiding the player / audio-only | [V] III.I.7–8: "must not … separate, isolate, or modify the audio or video components", or "promote separately the audio or video components". III.I.9: no "background player, meaning a player that is not displayed in the page, tab, or screen that the user is viewing". III.I.6: "must not … modify, build upon, or block any portion or functionality of a YouTube player". | [3] |
| Modifying the player | [V] RMF: "You must not make changes to the YouTube player that are not explicitly described by the API documentation." | [4] |
| Scripted playback (seekTo, setPlaybackRate, pause, loop) | [V] `seekTo`, `setPlaybackRate`/`getAvailablePlaybackRates` and the `loop` parameter are documented API features. Unsupported rates round down. "A playback only counts toward a video's official view count if it is initiated via a native play button." III.I.2: do not "automate or trigger views … without the user's prior specific and express consent". | [5][7][3] |
| Autoplay | [V] RMF: do not autoplay "until the player is visible and more than half of the player is visible". At most one autoplaying player per screen. Browsers may block unmuted autoplay, which fires `onAutoplayBlocked`. | [4][5] |
| Ads | [V] III.I.5: must not "modify, interfere with, replace, or block advertisements placed or served by YouTube". Ads in privacy-enhanced mode (`youtube-nocookie.com`) are non-personalized. | [3][8] |
| Caching / storing | [V] III.E.1.a: must not "download, import, backup, cache, or store copies of YouTube audiovisual content without YouTube's prior written approval". III.E.1.b: no offline playback. III.E.4.c–d: other API Data may be stored for at most 30 calendar days, then deleted or refreshed. III.E.6: must not "scrape … or obtain scraped YouTube data or content". | [3] |
| Mobile inline | [V] `playsinline=1` gives inline playback in iOS mobile browsers. | [7] |
| Branding | [V] Brand Features must follow the YouTube Branding Guidelines (III.F.2). `modestbranding` "is deprecated and has no effect". Related videos can no longer be disabled; `rel=0` limits them to the same channel. | [3][7] |
| Client identity | [V] Embedding clients "must provide identification through the `HTTP Referer` request header." | [4] |
| Privacy policy | [V] API ToS §7: each API Client "will provide and adhere to a published privacy policy". Policies III.A.2: users must agree to it "before users can access the API Client's features". | [2][3] |
| Made for Kids | [V] Turn off tracking and keep data collection lawful (III.E.4.j). | [3] |

## 2. Captions

- [V] `captions.download` needs OAuth (`youtube.force-ssl` or `youtubepartner`). The docs say it "requires the user to have permission to edit the video." Otherwise it returns 403, and each call costs 200 quota units. **We cannot use it for other people's videos.** [9]
- [V] There is no official documentation of a public `timedtext` endpoint. Pulling captions through it or by scraping falls under the ToS ban on accessing the Service "using any automated means (such as robots, botnets or scrapers)" [1] and under Dev Policy III.E.6 on scraping [3].
- [I] Storing transcripts taken from someone else's YouTube captions is therefore not a permitted path. If obtained through the API, the 30-day rule would apply anyway. The caption text is also usually the creator's copyrighted content (see §4).
- [V] We *can* ask the player to show YouTube's own captions (`cc_load_policy=1`) [7], but those captions render inside the player, not in our UI.

## 3. Downloading audio and transcribing with Whisper/AI

- [V] ToS: you may not "access, reproduce, download … any part of the Service or any Content" except as "expressly authorized by the Service" or "with prior written permission from YouTube and, if applicable, the respective rights holders". You also may not circumvent features that "prevent or restrict the copying" of Content. [1]
- [V] Dev Policies ban downloading, caching or storing audiovisual content (III.E.1.a) and separating audio (III.I.7). [3]
- **Conclusion [V]:** downloading third-party YouTube audio to run Whisper is forbidden without written permission from YouTube *and* the rights holder. Transcribing audio we obtained legitimately (licensed files, creator-supplied files, our own recordings) raises no YouTube issue.

## 4. Typing our own transcript of a third-party video

- [V] No YouTube document we read prohibits a human watching the embed and typing text shown in our UI below the player. The RMF overlay rule covers elements "in front of" the player, not beside or below it. [4]
- [I] The ToS "personal, non-commercial use" viewing clause [1] is awkward for a staff member transcribing for a freemium product. That is a gray area, not an explicit ban.
- [I] **Copyright, the bigger issue:** a verbatim transcript of a scripted talk, lecture or song reproduces the speaker's literary work. Translation is a derivative work. Many jurisdictions treat this as needing permission unless an exception applies (e.g. quotation or education, which varies by country). Mongolia's copyright law and its educational exceptions were not researched. The creator's CC license (if any) and their permission matter more than YouTube's terms here. **A lawyer is needed** before publishing full transcripts of copyrighted talks, especially behind any paid tier.
- [I] Lower-risk variants: short excerpts (single sentences for word lookups), or transcripts for content that is licensed (CC BY), public domain, or permission-granted.

## 5. How YouGlish works (from its own pages)

- [V] Terms: "YouGlish uses YouTube API Services to gather content and to play videos." Users must agree to the YouTube ToS and the Google Privacy Policy. It offers free and paid plans. [10]
- [V] About page: "Search any word or phrase to instantly hear it used in real-world YouTube videos". It offers "APIs for fast and easy integration". [11]
- [V] The widget docs say "YouGlish uses Youtube APIs. As such you must display a link to YouTube's Terms of Service…". The widget has "Caption", "All Captions" and "Dictionary support (require 'Caption')" components. For commercial use of the widget, "please contact us to get explicit permission." [12]
- [I] YouGlish clearly shows caption text synced to the embedded player and seeks to timestamps. Its public pages do **not** say how it gets caption text for videos it doesn't own, or whether it has a special arrangement with YouTube. Don't take it as proof that the same approach is allowed for us.
- [I] Option: YouGlish's widget could be embedded for "hear this word in context", but commercial use needs their permission.

## 6. Licensed content options

| Source | License / terms [V] | Commercial? | Clip / annotate / transcribe / translate? |
|---|---|---|---|
| **TED Talks** | CC BY-NC-ND 4.0 [13][14]. TED's policy: "NC: means you cannot use TED Talks in any commercial context". No editing or clipping, no unauthorized translations, no modified transcripts. For-profit educational courses "require a license" through the media-requests form (at least 2 weeks). | No (without a license) | No. A plain embed of the official video is fine under YouTube rules [I]. Our clipping, flashcard clips and translated transcripts need a TED license. |
| **YouTube "Creative Commons" (CC BY) videos** | CC BY 4.0: share and adapt "for any purpose, even commercially", with attribution (title, author, source URL, license) and "no additional restrictions" [15][16]. YouTube: a CC BY license can't be added to a video with a Content ID claim [16]. | Yes | [V] The license allows derivatives. [I] The CC license covers the *work*, but it doesn't override YouTube's ToS/API ban on downloading from YouTube. So embed from YouTube, or get the source file from the creator or another host. Also check that the uploader actually owns what they licensed. |
| **VOA Learning English** | "All text, audio and video material produced exclusively by the Voice of America is in the public domain." Credit "voanews.com, Voice of America, or VOA" is requested. Exception: third-party material "licensed for use in VOA programming only … not in the public domain" (AP named explicitly). The "Voice of America"/"voanews.com" trademarks need permission for commercial use. [17] | Yes, for VOA-produced material | Yes for VOA-produced items (PD). [I] Exclude clips with AP/Reuters/Getty footage or photos. Don't imply VOA endorsement. [I] US PD status may not carry into every country. |
| **BBC (general sharing terms; the BBC Learning English site itself was not reached)** | Embedding is allowed where there is an embed button, but don't "Change how the player works" or "Take content out of it". "You'll need to get our permission first for any business use". "Don't make shareables look like they cost money". No ads next to them, and no service "that contains only our shareables". [18] | No without permission | No clipping or extraction. [I] Treat BBC Learning English as off-limits for a freemium product unless licensed. |
| **LibriVox** | All recordings are released into the public domain. "People may use our recordings to profit; they may remix them … they do not need to give credit". PD status is checked for the US only. [19] | Yes | Yes. [I] Old literary English, good for B1+ reading-along. Check a text's PD status outside the US. |
| **Wikimedia Commons** | Each file has its own license; "no single license" applies. Commercial use depends on the file. [20] | Per file | Per file (CC BY / BY-SA / PD usually fine, noting SA obligations). |
| **NASA** | Media "generally are not subject to copyright in the United States". It must not imply endorsement. Third-party material is marked and needs the owner's permission. Logos are not PD. [21] | Yes (no endorsement) | Yes for NASA-made media. [I] Good for science/news-style B2 listening. |
| **Tatoeba** | Sentences default to CC BY 2.0 FR (some CC0). Audio carries per-contributor licenses, "some audio may carry non-commercial restrictions". [22] | Sentences yes; audio per contributor | Yes, with attribution. Filter audio by license. |
| **Mozilla Common Voice** | Contributions are CC0 [23]. The page mentions a restriction on identifying speakers, but the exact wording could not be extracted. | Yes | Yes. [I] Read-aloud single sentences with varied quality, better for accent or dictation drills than for engaging listening. |
| **Creator permission** | [V] The ToS exceptions allow uses "with prior written permission from YouTube and, if applicable, the respective rights holders" [1]. | — | [I] Creator permission covers copyright in the transcript, clips and translation. It does **not** by itself authorize downloading from YouTube, so ask the creator for the source file. |

## 7. Operational risks

- [V] Creators can turn off "Allow embedding" at any time. Age-restricted videos "can't be watched on most 3rd party websites". [8]
- [V] API ToS §24.2: YouTube may "suspend or terminate access … at any time". §6: YouTube "may monitor, review and inspect your API Client(s) … at any time and without further notice". [2]
- [V] Dev Policies III.H: you must give YouTube accounts that can reach all features for compliance review. III.D.3: quota extensions require an "API Compliance Audit". The audit form asks for organization details, business model, privacy policy and ToS screenshots, and demo credentials. [3][24]
- [I] The IFrame embed alone uses no Data API key or quota. An audit becomes relevant once we call the Data API (e.g. `videos.list` to check embeddable status or duration) beyond the default quota. Even so, YouTube may review any API Client.
- [I] Videos get deleted, made private or have embedding switched off, so stored transcripts and flashcards can break. We need a periodic health check and a fallback.

## 8. Implications for StepUp

**Safe (policy-compliant as read) [I based on V]**
- A standard IFrame embed ≥200×200 (full-width 16:9 on mobile, `playsinline=1`). Our interactive transcript sits *below* the player, never on top of it.
- User-initiated play. Our own controls outside the player call documented methods: `seekTo` for sentence replay, `setPlaybackRate(0.75)`, pause when a word is tapped, and looping a sentence through `seekTo`. Read `getAvailablePlaybackRates` first.
- Logging watch time from player state events into our tracker. That is our own data, not API Data.
- A published privacy policy that users accept, a link to the YouTube ToS and Google Privacy Policy, a correct Referer, and privacy-enhanced mode.
- Transcripts, clips and translations only for content that is PD, CC BY, CC0, or permission-granted.

**Risky (needs a license, permission or a lawyer)**
- Full typed transcripts or translations of copyrighted third-party videos (copyright, not YouTube ToS).
- Putting any *YouTube-embedded* lesson behind the paid tier. III.F.3 forbids charging to watch or gating beyond the play button. Keep every embed lesson free, and charge only for our separate AI features (writing feedback, pronunciation scoring) whose input isn't a YouTube video.
- Ads anywhere near embeds, or pages where YouTube content is the main draw for ad sales.
- The TED, BBC or YouGlish widget in a commercial context without permission.

**Forbidden (as written)**
- Downloading or extracting YouTube audio or video, including for Whisper, offline use, or "short clip" flashcards cut from YouTube.
- "Blind listening" by hiding the player, shrinking it below 200×200, covering it, or playing it in the background. [I] Alternative: collapse *our transcript* instead, or use blind mode only with non-YouTube licensed audio we host ourselves.
- Scraping captions (timedtext or otherwise), or using `captions.download` on videos we don't own.
- Blocking, skipping or covering YouTube ads, and overlays on the player.
- Charging to watch embedded YouTube videos.

**Recommended content strategy for the first ~30 clips**
1. **~15 VOA Learning English items** (A2–B1, slow-speed English): VOA-produced audio/video only, no AP or other agency material. Host the files ourselves so all features work, including the 3–8 s flashcard clips, blind mode, dictation, Whisper-aligned timestamps and translations. Credit "VOA".
2. **~5 NASA items** (B1–B2) with the same self-hosted pipeline, avoiding marked third-party material and logos.
3. **~5 CC BY YouTube videos** from channels that clearly own their content, embed-only, with attribution. Plan a later email asking the creators for source files so these can be self-hosted.
4. **~5 LibriVox / Tatoeba / Common Voice** items for graded read-alongs and dictation, filtering Tatoeba audio to commercial-OK licenses.
5. In parallel, email 3–5 English-teacher YouTubers for written permission covering transcripts, translations, clips and use in a freemium app, plus source files. Consider a TED media-licensing request only once the product is proven.
6. Build the player as an abstraction with two backends: a *self-hosted licensed audio/video* backend that supports everything, and a *YouTube embed* backend that supports embed-safe features only.

## 9. Open questions

- **Lawyer:** is publishing a human-typed transcript or translation of a copyrighted YouTube talk permitted under Mongolian law (and the law where users or servers sit)? Do educational exceptions apply to a freemium company?
- **Lawyer / YouTube:** does "gate access … other than clicking the play button" [3] cover a free login wall before lessons that include embeds? [I] Probably requiring an account is common practice, but this wasn't confirmed in a source.
- Where does the paid tier stop and "free on YouTube" begin? Can a paid plan unlock our AI features on a lesson that contains an embed? Consider an API Compliance Audit or a question to YouTube before launching freemium.
- Is looping a sentence automatically "playback modification" or permitted scripted control? The API documents `seekTo`/`loop` [5][7], but no document addresses education-style sentence loops specifically.
- BBC Learning English's own terms and the exact Common Voice speaker-identification clause were not read. Verify both manually.
- The current VOA/USAGM operating status and whether the Learning English archive stays online. Download our licensed copies early.
- What YouGlish's arrangement with YouTube is for caption data, if it has one.

## Sources

1. YouTube Terms of Service (effective Dec 15, 2023) — https://www.youtube.com/static?template=terms
2. YouTube API Services Terms of Service — https://developers.google.com/youtube/terms/api-services-terms-of-service
3. YouTube API Services Developer Policies — https://developers.google.com/youtube/terms/developer-policies
4. YouTube API Services Required Minimum Functionality — https://developers.google.com/youtube/terms/required-minimum-functionality
5. YouTube IFrame Player API reference — https://developers.google.com/youtube/iframe_api_reference
6. Developer Policies Guide — https://developers.google.com/youtube/terms/developer-policies-guide
7. YouTube embedded player parameters — https://developers.google.com/youtube/player_parameters
8. YouTube Help: Embed videos & playlists — https://support.google.com/youtube/answer/171780
9. YouTube Data API: Captions: download — https://developers.google.com/youtube/v3/docs/captions/download
10. YouGlish Terms — https://youglish.com/terms
11. YouGlish About — https://youglish.com/about
12. YouGlish widget docs — https://youglish.com/api/doc/widget
13. TED Talks Usage Policy — https://www.ted.com/about/our-organization/our-policies-terms/ted-talks-usage-policy
14. CC BY-NC-ND 4.0 deed — https://creativecommons.org/licenses/by-nc-nd/4.0/
15. CC BY 4.0 deed — https://creativecommons.org/licenses/by/4.0/
16. YouTube Help: Creative Commons — https://support.google.com/youtube/answer/2797468
17. VOA Learning English terms / copyright statement — https://learningenglish.voanews.com/p/6021.html
18. BBC: Can I share things from the BBC? — https://www.bbc.co.uk/usingthebbc/terms/can-i-share-things-from-the-bbc
19. LibriVox wiki: Copyright and Public Domain — https://wiki.librivox.org/index.php/Copyright_and_Public_Domain
20. Wikimedia Commons: Reusing content outside Wikimedia — https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
21. NASA images and media usage guidelines — https://www.nasa.gov/nasa-brand-center/images-and-media/
22. Tatoeba Terms of Use — https://tatoeba.org/en/terms_of_use
23. Mozilla Common Voice Terms — https://commonvoice.mozilla.org/en/terms
24. YouTube API Services audit and quota extension form — https://support.google.com/youtube/contact/yt_api_form
