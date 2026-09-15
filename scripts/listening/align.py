"""Align a published transcript to its audio and write segment timings.

The published text is the ground truth; Whisper only supplies timestamps.

    python scripts/listening/align.py <slug> [--model small.en]

Reads  scripts/listening/sources/<slug>.txt  (one paragraph per line)
       public/listening/<slug>.mp3
Writes src/content/listening/timings/<slug>.json
       [{ "start": s, "end": s, "tokens": ["George", "Washington", ...] }]

Needs: pip install faster-whisper. Review the output by listening before publishing.
"""

import argparse
import difflib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ABBREVIATIONS = {"u.s.", "mr.", "mrs.", "ms.", "dr.", "st.", "jr.", "sr."}
# After an abbreviation, these words almost always start a new sentence ("…in the U.S. It takes…").
SENTENCE_STARTERS = {"it", "he", "she", "they", "we", "i", "the", "this", "that", "there", "but", "and", "a"}


def norm(word: str) -> str:
    return re.sub(r"[^a-z0-9]", "", word.lower().replace("’", "'"))


def split_sentences(paragraph: str) -> list[list[str]]:
    sentences, current = [], []
    words = paragraph.split()
    for i, w in enumerate(words):
        current.append(w)
        bare = w.rstrip("”\"'’)")
        nxt = words[i + 1].lstrip("“\"'(") if i + 1 < len(words) else ""
        ends = bare.endswith((".", "?", "!")) and (
            w.lower() not in ABBREVIATIONS or nxt.lower() in SENTENCE_STARTERS
        )
        next_upper = nxt[:1].isupper()
        if ends and (next_upper or i + 1 == len(words)):
            sentences.append(current)
            current = []
    if current:
        sentences.append(current)
    return sentences


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--model", default="small.en")
    args = ap.parse_args()

    from faster_whisper import WhisperModel

    text = (ROOT / "scripts/listening/sources" / f"{args.slug}.txt").read_text(encoding="utf-8")
    sentences = [s for line in text.splitlines() if line.strip() for s in split_sentences(line.strip())]
    ref = [(si, w) for si, s in enumerate(sentences) for w in s]

    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    segs, _ = model.transcribe(
        str(ROOT / "public/listening" / f"{args.slug}.mp3"), word_timestamps=True, language="en"
    )
    heard = [(w.start, w.end, w.word) for seg in segs for w in seg.words]

    # Numbers and hyphenated words can differ between text and speech; unmatched
    # reference words get times interpolated from their matched neighbours.
    a = [norm(w) for _, w in ref]
    b = [norm(w) for _, _, w in heard]
    times: list[tuple[float, float] | None] = [None] * len(ref)
    for block in difflib.SequenceMatcher(a=a, b=b, autojunk=False).get_matching_blocks():
        for k in range(block.size):
            s, e, _ = heard[block.b + k]
            times[block.a + k] = (s, e)

    matched = sum(t is not None for t in times)
    # Sentences with guessed timings are the ones to check by ear.
    for i, t in enumerate(times):
        if t is None:
            si, w = ref[i]
            print(f"  check sentence {si + 1}: '{w}' was not heard, timing interpolated")
    for i, t in enumerate(times):
        if t is None:
            prev = next((times[j] for j in range(i - 1, -1, -1) if times[j]), (0.0, 0.0))
            nxt = next((times[j] for j in range(i + 1, len(times)) if times[j]), prev)
            times[i] = (prev[1], max(prev[1], nxt[0]))

    out = []
    for si, s in enumerate(sentences):
        idx = [i for i, (sj, _) in enumerate(ref) if sj == si]
        out.append({"start": round(times[idx[0]][0], 2), "end": round(times[idx[-1]][1], 2), "tokens": s})

    dest = ROOT / "src/content/listening/timings" / f"{args.slug}.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{args.slug}: {len(out)} sentences, {matched}/{len(ref)} words matched -> {dest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
