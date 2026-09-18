"""Build the reading catalog from the published sources (reading module, ADR 0017, 0021).

    python scripts/reading/build_text.py

Reads  scripts/reading/sources/<slug>.txt        (one paragraph per line, as published)
       scripts/reading/sources/<slug>.meta.json  (title, summary, level, topic, source, questions)
Writes src/content/reading/catalog.json          [{...meta, "paragraphs": [[["The", "year", "was", "1931."], ...], ...]}]

Sentences are split the same way as listening transcripts (scripts/listening/align.py),
so a reading text and a clip of the same story tokenize alike. Metadata is checked before anything is
written; check the sentences too before publishing.
"""

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


LEVELS = ["A1", "A2", "B1", "B2", "C1"]
# Keep in step with src/lib/reading/topics.ts.
TOPICS = [
    "daily-life", "food", "health", "work-money", "school", "travel",
    "nature", "science", "technology", "history-people", "culture", "stories",
]
LICENSES = {"public-domain", "cc-by"}


def check(slug: str, meta: dict) -> list[str]:
    """Problems with one text's metadata; empty when it can be published."""
    errors = []
    if meta.get("slug") != slug:
        errors.append(f"slug {meta.get('slug')!r} doesn't match the file name")
    for key in ("title", "summary"):
        if not str(meta.get(key, "")).strip():
            errors.append(f"missing {key}")
    if meta.get("level") not in LEVELS:
        errors.append(f"level {meta.get('level')!r} is not one of {LEVELS}")
    if meta.get("topic") not in TOPICS:
        errors.append(f"topic {meta.get('topic')!r} is not one of {TOPICS}")
    source = meta.get("source") or {}
    for key in ("name", "url", "credit"):
        if not source.get(key):
            errors.append(f"source.{key} missing")
    if source.get("license") not in LICENSES:
        errors.append(f"source.license {source.get('license')!r} is not one of {sorted(LICENSES)}")
    if source.get("license") == "cc-by" and not (source.get("licenseUrl") and meta.get("changes")):
        errors.append("CC BY texts need source.licenseUrl and changes")
    questions = meta.get("questions") or []
    if len(questions) != 3:
        errors.append(f"{len(questions)} questions, expected 3")
    for i, q in enumerate(questions):
        options = q.get("options") or []
        if not q.get("prompt") or not q.get("explain") or len(options) < 2:
            errors.append(f"question {i + 1} is incomplete")
        elif not 0 <= q.get("answer", -1) < len(options):
            errors.append(f"question {i + 1}: answer out of range")
        elif len(set(options)) != len(options):
            errors.append(f"question {i + 1}: repeated option")
    return errors


def main() -> None:
    sources = ROOT / "scripts/reading/sources"
    catalog, failed = [], False
    for meta_path in sorted(sources.glob("*.meta.json")):
        slug = meta_path.name.removesuffix(".meta.json")
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        text = (sources / f"{slug}.txt").read_text(encoding="utf-8")
        paragraphs = [sentences_of(line.strip()) for line in text.splitlines() if line.strip()]
        errors = check(slug, meta)
        if errors:
            failed = True
            print(f"{slug}: " + "; ".join(errors), file=sys.stderr)
            continue
        entry = {k: meta[k] for k in ("slug", "title", "summary", "level", "topic", "source", "questions")}
        if meta.get("changes"):
            entry["changes"] = meta["changes"]
        entry["paragraphs"] = paragraphs
        catalog.append(entry)
        words = sum(1 for p in paragraphs for s in p for t in s if any(c.isalnum() for c in t))
        print(f"{slug}: {meta['level']} {meta['topic']}, {len(paragraphs)} paragraphs, {words} words")
    if failed:
        sys.exit("Nothing written: fix the metadata above.")
    catalog.sort(key=lambda t: (LEVELS.index(t["level"]), t["title"].lower()))
    out = ROOT / "src/content/reading/catalog.json"
    out.write_text(json.dumps(catalog, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(catalog)} texts -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
