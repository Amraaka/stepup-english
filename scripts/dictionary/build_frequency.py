"""Frequency ranks for the shared dictionary's words (ADR 0022).

    pip install wordfreq
    python scripts/dictionary/build_frequency.py

For every lemma in `src/content/dictionary/glossary.json` the script adds up how often the lemma and its
dictionary forms appear in English (wordfreq), then writes the rank of that total among single English
word forms to `src/content/dictionary/frequency.json`: rank 1 is "the", rank 2,000 is about as common as
the 2,000th most common word form. Lemmas wordfreq has never seen are left out (treated as rare).
The British spelling counts too ("meter" + "metre"), since wordfreq splits the two.

wordfreq's data is CC BY-SA 4.0 (https://github.com/rspeer/wordfreq). Re-run after merging new glosses.
"""

import bisect
import json
from pathlib import Path

from wordfreq import top_n_list, word_frequency

ROOT = Path(__file__).resolve().parents[2]
GLOSSARY = ROOT / "src/content/dictionary/glossary.json"
OUT = ROOT / "src/content/dictionary/frequency.json"
TOP = 100_000


BRITISH = [("er", "re"), ("or", "our"), ("ize", "ise"), ("yze", "yse"), ("og", "ogue")]


def british(lemma: str, lemmas: dict) -> list[str]:
    """British spellings of an American lemma ("center" → "centre"), skipping words of their own ("for" → "four")."""
    if len(lemma) < 5:
        return []
    out = []
    for us, uk in BRITISH:
        if lemma.endswith(us):
            variant = lemma[: -len(us)] + uk
            if variant not in lemmas:
                out.append(variant)
    return out


def main() -> None:
    g = json.loads(GLOSSARY.read_text())
    families: dict[str, list[str]] = {lemma: [lemma, *british(lemma, g["lemmas"])] for lemma in g["lemmas"]}
    for form, lemma in g["forms"].items():
        if lemma in families:
            families[lemma].append(form)

    # Frequencies of the top word forms, ascending, to rank a total by bisection.
    ladder = sorted(word_frequency(w, "en") for w in top_n_list("en", TOP))
    ranks: dict[str, int] = {}
    for lemma, words in families.items():
        total = sum(word_frequency(w, "en") for w in words)
        if total > 0:
            ranks[lemma] = len(ladder) - bisect.bisect_right(ladder, total) + 1

    body = ",\n".join(f"  {json.dumps(k)}: {v}" for k, v in sorted(ranks.items()))
    OUT.write_text("{\n" + body + "\n}\n")
    print(f"{len(ranks)} of {len(families)} lemmas ranked → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
