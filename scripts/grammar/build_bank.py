#!/usr/bin/env python3
"""Tense gap-fill items from Tatoeba English sentences (grammar plan phase 4, ADR 0014).

Two steps, with a person reviewing in between:

  python scripts/grammar/build_bank.py candidates --data DIR
      Reads DIR/eng_sentences_detailed.tsv.bz2 and DIR/eng_sentences_CC0.tsv.bz2
      (https://tatoeba.org/en/downloads), writes scripts/grammar/candidates.json.

  python scripts/grammar/build_bank.py bank
      Keeps the ids listed as accepted in scripts/grammar/reviewed.json and writes
      src/content/grammar/bank.json.

Only simple, one-clause statements are used: "<Subject> <verb phrase> ... <time signal>."
The time signal decides which tenses are right, and distractors come only from tenses
that the signal rules out, so an item has one correct option.
"""

import argparse
import bz2
import hashlib
import json
import random
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CANDIDATES = ROOT / "scripts/grammar/candidates.json"
REVIEWED = ROOT / "scripts/grammar/reviewed.json"
BANK = ROOT / "src/content/grammar/bank.json"
PER_GROUP = 25

# base, 3rd person -s, past, past participle, -ing.
# Left out on purpose: be/have/do/get (too many uses), verbs whose past equals the base
# (read, put, cut, hit, let, set, cost, hurt, shut, quit), and -ed forms that are common adjectives.
VERBS = """
work works worked worked working
live lives lived lived living
play plays played played playing
study studies studied studied studying
watch watches watched watched watching
walk walks walked walked walking
wait waits waited waited waiting
talk talks talked talked talking
cook cooks cooked cooked cooking
clean cleans cleaned cleaned cleaning
call calls called called calling
visit visits visited visited visiting
finish finishes finished finished finishing
start starts started started starting
open opens opened opened opening
help helps helped helped helping
learn learns learned learned learning
listen listens listened listened listening
move moves moved moved moving
use uses used used using
stay stays stayed stayed staying
arrive arrives arrived arrived arriving
rain rains rained rained raining
snow snows snowed snowed snowing
try tries tried tried trying
plan plans planned planned planning
stop stops stopped stopped stopping
wash washes washed washed washing
fix fixes fixed fixed fixing
ask asks asked asked asking
answer answers answered answered answering
laugh laughs laughed laughed laughing
cry cries cried cried crying
carry carries carried carried carrying
look looks looked looked looking
smoke smokes smoked smoked smoking
dance dances danced danced dancing
return returns returned returned returning
climb climbs climbed climbed climbing
paint paints painted painted painting
practice practices practiced practiced practicing
teach teaches taught taught teaching
sing sings sang sung singing
swim swims swam swum swimming
run runs ran run running
write writes wrote written writing
eat eats ate eaten eating
drink drinks drank drunk drinking
drive drives drove driven driving
ride rides rode ridden riding
speak speaks spoke spoken speaking
take takes took taken taking
give gives gave given giving
see sees saw seen seeing
go goes went gone going
come comes came come coming
leave leaves left left leaving
buy buys bought bought buying
bring brings brought brought bringing
think thinks thought thought thinking
catch catches caught caught catching
meet meets met met meeting
sleep sleeps slept slept sleeping
find finds found found finding
lose loses lost lost losing
make makes made made making
send sends sent sent sending
spend spends spent spent spending
build builds built built building
sell sells sold sold selling
tell tells told told telling
win wins won won winning
sit sits sat sat sitting
stand stands stood stood standing
begin begins began begun beginning
break breaks broke broken breaking
choose chooses chose chosen choosing
fall falls fell fallen falling
forget forgets forgot forgotten forgetting
fly flies flew flown flying
grow grows grew grown growing
hear hears heard heard hearing
keep keeps kept kept keeping
know knows knew known knowing
pay pays paid paid paying
wear wears wore worn wearing
say says said said saying
wake wakes woke woken waking
"""

SUBJECTS = {"I": "1sg", "You": "pl", "We": "pl", "They": "pl", "He": "3sg", "She": "3sg", "It": "3sg", "Tom": "3sg", "Mary": "3sg"}
SUBJECT_WORDS = {"i", "he", "she", "we", "they"}

TENSE_SLUG = {
    "present-simple": "present-simple",
    "present-continuous": "present-continuous",
    "past-simple": "past-simple",
    "past-continuous": "past-continuous",
    "present-perfect": "present-perfect",
    "present-perfect-continuous": "present-perfect-continuous",
    "past-perfect": "past-perfect",
    "will": "will-going-to",
    "going-to": "will-going-to",
    "future-continuous": "future-continuous",
}

DAYS = "monday|tuesday|wednesday|thursday|friday|saturday|sunday"
PERIODS = f"night|week|month|year|summer|winter|spring|fall|autumn|weekend|{DAYS}"
SIGNALS = {
    "past": re.compile(
        rf"\b(yesterday|last (?:{PERIODS})|(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|many|several|a few) "
        r"(?:minutes?|hours?|days?|weeks?|months?|years?) ago|long ago|in (?:18|19|20)\d\d)\b",
        re.I,
    ),
    "now": re.compile(r"\b(right now|at the moment|at present)\b", re.I),
    "since": re.compile(rf"\b(since (?:(?:18|19|20)\d\d|yesterday|last (?:{PERIODS})|this morning|{DAYS}|then|childhood))\b", re.I),
    "future": re.compile(rf"\b(tomorrow|next (?:{PERIODS}))\b", re.I),
}

# Which tenses a signal allows as the answer, and which forms may serve as wrong options.
RULES = {
    "past": {"answers": ["past-simple", "past-continuous"], "wrong": ["present-simple", "present-perfect", "will"]},
    "now": {"answers": ["present-continuous"], "wrong": ["present-simple", "past-simple", "past-perfect"]},
    "since": {
        "answers": ["present-perfect", "present-perfect-continuous"],
        "wrong": ["present-simple", "present-continuous", "past-simple"],
    },
    # Not past-continuous: "We were going to a dance tomorrow" is a correct future in the past.
    "future": {
        "answers": ["will", "going-to", "future-continuous", "present-continuous"],
        "wrong": ["past-simple", "present-perfect", "past-perfect"],
    },
}

# Why the answer fits, per (signal, answer tense).
EXPLAIN = {
    ("past", "past-simple"): '"{sig}" нь өнгөрсөнд болж дууссан үйлийг заана: V2 (өнгөрсөн энгийн цаг).',
    ("past", "past-continuous"): '"{sig}" нь өнгөрсөн цагийг заана. Тэр үед үргэлжилж байсан үйлийг was / were + V-ing-ээр хэлнэ.',
    ("now", "present-continuous"): '"{sig}" нь яг одоо болж байгааг заана: am / is / are + V-ing.',
    ("since", "present-perfect"): '"{sig}" нь эхэлсэн цэгийг хэлж, одоо хүртэл үргэлжилж байгааг заана: have / has + V3.',
    ("since", "present-perfect-continuous"): '"{sig}" нь эхэлсэн цэгийг хэлж, одоо хүртэл үргэлжилж байгааг заана: have / has + been + V-ing.',
    ("future", "will"): '"{sig}" нь ирээдүйг заана. Сонголтуудаас ирээдүйн хэлбэр нь зөвхөн will + V1.',
    ("future", "going-to"): '"{sig}" нь ирээдүйг заана. Сонголтуудаас ирээдүйн хэлбэр нь зөвхөн am / is / are going to + V1.',
    ("future", "future-continuous"): '"{sig}" нь ирээдүйг заана. Ирээдүйн тодорхой үед үргэлжилж байх үйлийг will be + V-ing-ээр хэлнэ.',
    ("future", "present-continuous"): '"{sig}" нь ирээдүйг заана. Товлосон, тохиролцсон төлөвлөгөөг am / is / are + V-ing-ээр хэлнэ.',
}

# Words that mean a second clause, a negative or a question-like shape: skip those sentences.
BLOCK = re.compile(
    r"\b(and|but|or|so|that|because|when|while|if|who|which|what|where|how|why|than|as|before|after|until|"
    r"not|never|am|is|are|was|were|has|have|had|will|would|can|could|should|must|may|might|do|does|did|been|being)\b",
    re.I,
)
SHAPE = re.compile(r"^[A-Z][A-Za-z0-9 ,]*[a-z0-9]\.$")


def verb_table():
    return [tuple(line.split()) for line in VERBS.strip().splitlines()]


def form(tense, cls, v):
    base, s, past, pp, ing = v
    be_now = {"1sg": "am", "3sg": "is", "pl": "are"}[cls]
    be_past = "were" if cls == "pl" else "was"
    have = "has" if cls == "3sg" else "have"
    return {
        "present-simple": s if cls == "3sg" else base,
        "present-continuous": f"{be_now} {ing}",
        "past-simple": past,
        "past-continuous": f"{be_past} {ing}",
        "present-perfect": f"{have} {pp}",
        "present-perfect-continuous": f"{have} been {ing}",
        "past-perfect": f"had {pp}",
        "will": f"will {base}",
        "going-to": f"{be_now} going to {base}",
        "future-continuous": f"will be {ing}",
    }[tense]


def phrase_index(verbs):
    """phrase -> (verb, tense) per agreement class; phrases with two readings are dropped."""
    index = {}
    for cls in ("1sg", "3sg", "pl"):
        seen = defaultdict(set)
        for v in verbs:
            for tense in TENSE_SLUG:
                seen[form(tense, cls, v)].add((v, tense))
        index[cls] = {p: next(iter(r)) for p, r in seen.items() if len(r) == 1}
    return index


def stable(sid):
    return int(hashlib.sha1(str(sid).encode()).hexdigest()[:8], 16)


def load(data):
    cc0 = set()
    with bz2.open(data / "eng_sentences_CC0.tsv.bz2", "rt", encoding="utf-8") as f:
        for line in f:
            cc0.add(line.split("\t", 1)[0])
    with bz2.open(data / "eng_sentences_detailed.tsv.bz2", "rt", encoding="utf-8") as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 4:
                sid, _, text, user = parts[:4]
                yield sid, text, user, "CC0 1.0" if sid in cc0 else "CC BY 2.0 FR"


def match(text, index):
    if not SHAPE.match(text) or not (4 <= len(text.split()) <= 11):
        return None
    subj, _, rest = text.partition(" ")
    cls = SUBJECTS.get(subj)
    if not cls:
        return None
    words = rest[:-1].replace(",", "").split()
    for n in (4, 3, 2, 1):
        phrase = " ".join(words[:n])
        if phrase in index[cls]:
            verb, tense = index[cls][phrase]
            tail = " ".join(words[n:])
            if BLOCK.search(tail) or not tail:
                return None
            return cls, verb, tense, phrase, tail
    return None


class Builder:
    def __init__(self):
        verbs = verb_table()
        self.index = phrase_index(verbs)
        self.bases = {v[0] for v in verbs} | {"be", "get", "have", "do"}

    def item(self, sid, text, user, license_):
        """A gap-fill for one sentence, or None. Pure, so the bank step can rebuild reviewed items."""
        m = match(text, self.index)
        if not m:
            return None
        cls, verb, tense, phrase, tail = m
        words = tail.lower().split()
        # "is going to get married" is going to + verb, not the continuous of go.
        if verb[0] == "go" and tense.endswith("continuous") and words[:1] == ["to"] and words[1:2] and words[1] in self.bases:
            return None
        # A subject pronoun in the tail means a second clause ("She said she slept well").
        if SUBJECT_WORDS & set(words):
            return None
        hits = [(name, rx.search(tail)) for name, rx in SIGNALS.items()]
        hits = [(name, h) for name, h in hits if h]
        if len(hits) != 1:
            return None
        signal, h = hits[0]
        rule = RULES[signal]
        if tense not in rule["answers"]:
            return None
        options = [phrase] + [form(t, cls, verb) for t in rule["wrong"]]
        if len(set(options)) != 4:
            return None
        random.Random(stable(sid)).shuffle(options)
        subj = text.split(" ", 1)[0]
        if not text[len(subj) + 1 :].startswith(phrase + " "):
            return None
        return {
            "id": f"tatoeba-{sid}",
            "slug": TENSE_SLUG[tense],
            "signal": signal,
            "text": text,
            "sentence": f"{subj} ___ {text[len(subj) + 1 + len(phrase) + 1:]}",
            "answer": phrase,
            "options": options,
            "explain": EXPLAIN[(signal, tense)].format(sig=h.group(1)),
            "source": {"tatoebaId": int(sid), "author": user, "license": license_},
        }


def candidates(data):
    builder = Builder()
    groups = defaultdict(list)
    for sid, text, user, license_ in load(data):
        c = builder.item(sid, text, user, license_)
        if c:
            groups[(c["slug"], c["signal"])].append(c)

    out = []
    for key in sorted(groups):
        items = sorted(groups[key], key=lambda c: (len(c["text"].split()) > 9, stable(c["id"])))
        out.extend(items[:PER_GROUP])
        print(f"{key[0]:<28} {key[1]:<7} {len(groups[key]):>5} found, {min(len(items), PER_GROUP)} kept")
    CANDIDATES.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {len(out)} candidates to {CANDIDATES.relative_to(ROOT)}")


def bank():
    cands = {c["id"]: c for c in json.loads(CANDIDATES.read_text(encoding="utf-8"))}
    reviewed = json.loads(REVIEWED.read_text(encoding="utf-8"))
    missing = [i for i in reviewed["accepted"] if i not in cands]
    if missing:
        raise SystemExit(f"accepted ids not in candidates: {missing}")
    # Rebuild each accepted item from its sentence, so rule and template changes apply
    # without downloading Tatoeba again.
    builder = Builder()
    items = []
    for i in reviewed["accepted"]:
        s = cands[i]["source"]
        c = builder.item(str(s["tatoebaId"]), cands[i]["text"], s["author"], s["license"])
        if not c:
            raise SystemExit(f"{i} no longer passes the rules; review it again")
        items.append({k: c[k] for k in ("id", "slug", "signal", "sentence", "answer", "options", "explain", "source")})
    BANK.write_text(json.dumps(items, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {len(items)} items to {BANK.relative_to(ROOT)}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("step", choices=["candidates", "bank"])
    ap.add_argument("--data", type=Path)
    args = ap.parse_args()
    if args.step == "candidates":
        if not args.data:
            ap.error("--data is required for candidates")
        candidates(args.data)
    else:
        bank()
