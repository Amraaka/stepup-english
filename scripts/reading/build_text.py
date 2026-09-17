"""Build a reading text's paragraphs from its published source (reading module, ADR 0017).

    python scripts/reading/build_text.py <slug> [<slug> ...]

Reads  scripts/reading/sources/<slug>.txt  (one paragraph per line, as published)
Writes src/content/reading/<slug>.json    [[["The", "year", "was", "1931."], ...], ...]

Sentences are split the same way as listening transcripts (scripts/listening/align.py),
so a reading text and a clip of the same story tokenize alike. Check the output before publishing.
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts/listening"))
from align import split_sentences  # noqa: E402

INITIAL = re.compile(r"^[A-Z]\.$")


# Split only before a letter: a closing quote after an ellipsis ("speaker..." or) stays on its word.
GLUED = re.compile(r"(…|\.\.\.|—|/)(?=[A-Za-z])")
# An ellipsis after a space ("my ride …", "courses …So") joins the word before it instead of standing alone.
LONE_ELLIPSIS = re.compile(r"\s+(…|\.\.\.)")


def sentences_of(paragraph: str) -> list[list[str]]:
    """Split like align.py, then rejoin splits after a middle initial ("Pearl S. Buck", "Robert E. Lee").

    Words glued by an ellipsis, dash or slash ("gloves…a", "date...not", "lessons'—or", "Morning/Afternoon") are
    separated first, so each word can be tapped on its own.
    """
    out: list[list[str]] = []
    for s in split_sentences(GLUED.sub(r"\1 ", LONE_ELLIPSIS.sub(r"\1", paragraph))):
        if out and INITIAL.match(out[-1][-1]):
            out[-1].extend(s)
        else:
            out.append(s)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slugs", nargs="+")
    args = ap.parse_args()
    for slug in args.slugs:
        text = (ROOT / "scripts/reading/sources" / f"{slug}.txt").read_text(encoding="utf-8")
        paragraphs = [sentences_of(line.strip()) for line in text.splitlines() if line.strip()]
        out = ROOT / "src/content/reading" / f"{slug}.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(paragraphs, ensure_ascii=False) + "\n", encoding="utf-8")
        sentences = sum(len(p) for p in paragraphs)
        words = sum(len(s) for p in paragraphs for s in p)
        print(f"{slug}: {len(paragraphs)} paragraphs, {sentences} sentences, {words} words")


if __name__ == "__main__":
    main()
