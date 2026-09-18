"""Merge a reviewed batch of dictionary entries into the shared dictionary (ADR 0016, 0021).

    python scripts/reading/merge_glosses.py <batch.json> [<batch.json> ...] [--replace]

A batch has the dictionary's shape: {"lemmas": {...}, "forms": {...}, "phrases": {...}}.
New keys are added. A key that already exists with a different value is reported and skipped,
unless --replace is given (use it only for entries a review decided to correct).
The file keeps its layout: one lemma or phrase per line, lemmas sorted, forms sorted and packed.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PATH = ROOT / "src/content/dictionary/glossary.json"
POS = {"n", "v", "adj", "adv", "prep", "conj", "pron", "det", "num", "name", "phrase"}


def entry_line(key: str, entry: dict) -> str:
    fields = ", ".join(f"{json.dumps(k)}: {json.dumps(v, ensure_ascii=False)}" for k, v in entry.items())
    return f"    {json.dumps(key, ensure_ascii=False)}: {{ {fields} }}"


def dump(g: dict) -> str:
    """The dictionary in its hand-kept layout, so a merge only adds lines."""
    lemmas = sorted(g["lemmas"].items(), key=lambda kv: kv[0].replace(".", ""))
    form_items = [f"{json.dumps(f)}: {json.dumps(l)}" for f, l in sorted(g["forms"].items())]
    form_lines, line = [], ""
    for item in form_items:
        if line and len(line) + len(item) + 2 > 100:
            form_lines.append(line + ",")
            line = ""
        line = f"{line}, {item}" if line else f"    {item}"
    if line:
        form_lines.append(line)
    parts = [
        '{\n  "lemmas": {\n' + ",\n".join(entry_line(k, e) for k, e in lemmas) + "\n  },",
        '  "forms": {\n' + "\n".join(form_lines) + "\n  },",
        '  "phrases": {\n' + ",\n".join(entry_line(k, e) for k, e in g["phrases"].items()) + "\n  }\n}\n",
    ]
    return "\n".join(parts)


def main() -> None:
    args = sys.argv[1:]
    replace = "--replace" in args
    batches = [a for a in args if a != "--replace"]
    g = json.loads(PATH.read_text(encoding="utf-8"))
    added = replaced = 0
    problems = []
    for batch_path in batches:
        batch = json.loads(Path(batch_path).read_text(encoding="utf-8"))
        for section in ("lemmas", "phrases"):
            for key, entry in batch.get(section, {}).items():
                if entry.get("pos") not in POS or not str(entry.get("mn", "")).strip():
                    problems.append(f"{batch_path}: {section}.{key} needs a valid pos and mn")
                    continue
                if key != key.lower().strip():
                    problems.append(f"{batch_path}: {section}.{key} must be lowercase")
                    continue
                if section == "phrases" and " " not in key:
                    problems.append(f"{batch_path}: phrase {key!r} has one word; put it under lemmas")
                    continue
                old = g[section].get(key)
                if old == entry:
                    continue
                if old and not replace:
                    problems.append(f"{batch_path}: {section}.{key} exists ({old['mn']!r}); skipped {entry['mn']!r}")
                    continue
                replaced += bool(old)
                added += not old
                g[section][key] = entry
        for form, lemma in batch.get("forms", {}).items():
            if g["forms"].get(form) == lemma:
                continue
            if form in g["lemmas"]:
                problems.append(f"{batch_path}: form {form!r} is already a lemma; skipped")
                continue
            if form in g["forms"] and not replace:
                problems.append(f"{batch_path}: form {form!r} → {g['forms'][form]!r} exists; skipped → {lemma!r}")
                continue
            g["forms"][form] = lemma
            added += 1
    dangling = sorted(f for f, lemma in g["forms"].items() if lemma not in g["lemmas"])
    problems += [f"form {f!r} points to missing lemma {g['forms'][f]!r}" for f in dangling]
    PATH.write_text(dump(g), encoding="utf-8")
    print(f"{added} added, {replaced} replaced")
    for p in problems:
        print("  " + p)


if __name__ == "__main__":
    main()
