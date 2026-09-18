"""Print a text and its questions without the answers, for a blind check (ADR 0021).

    python scripts/reading/quiz_view.py <slug>

A reviewer answers from the text alone, then compares with the metadata. A question the reviewer
gets "wrong" is ambiguous or its answer isn't in the text, and needs rewriting.
Options are shuffled with a fixed seed, so the correct one isn't always first.
"""

import json
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
slug = sys.argv[1]
sources = ROOT / "scripts/reading/sources"
print((sources / f"{slug}.txt").read_text(encoding="utf-8"))
meta = json.loads((sources / f"{slug}.meta.json").read_text(encoding="utf-8"))
rand = random.Random(slug)
for i, q in enumerate(meta["questions"], 1):
    options = q["options"][:]
    rand.shuffle(options)
    print(f"\nQ{i}. {q['prompt']}")
    for letter, option in zip("abcd", options):
        print(f"   {letter}) {option}")
