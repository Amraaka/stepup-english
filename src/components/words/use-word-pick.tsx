"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SavedWordSource } from "@/db/schema";
import { makeLookup, wordKey, type Glossary } from "@/lib/dictionary/lookup";
import { saveWordAction } from "@/app/(site)/vocabulary/actions";
import { useStats } from "@/components/stats-provider";
import { WordSheet, type WordPick } from "@/components/words/word-sheet";

const EDGE_PUNCT = /^[“"'(‘\[–—]+|[.,!?;:”"')’\]…—–]+$/g;

/** A marked token range [start, end) inside one sentence. */
export type Marked = { start: number; end: number };

/**
 * Tap-a-word behaviour shared by listening transcripts and reading texts (ADR 0016):
 * lookup with phrase expansion, the word sheet, and saving to the word review.
 * `sentences` are token lists (keep the array stable); `glossary` is the page's dictionary slice
 * (`glossaryFor` on the server); `source(i)` says where sentence i came from.
 */
export function useWordPick({
  sentences,
  glossary,
  savedLemmas,
  source,
  onOpen,
  onClose,
}: {
  sentences: string[][];
  glossary: Glossary;
  savedLemmas: string[];
  source: (sentence: number) => SavedWordSource;
  onOpen?: () => void;
  onClose?: () => void;
}) {
  const keys = useMemo(() => sentences.map((tokens) => tokens.map(wordKey)), [sentences]);
  const { lookupWord, phraseAt } = useMemo(() => makeLookup(glossary), [glossary]);
  const [pick, setPick] = useState<WordPick | null>(null);
  const [marked, setMarked] = useState<(Marked & { sentence: number }) | null>(null);
  const [saved, setSaved] = useState(() => new Set(savedLemmas));
  // Per lemma, so a save still in flight doesn't block or relabel the next word opened.
  const [saving, setSaving] = useState<ReadonlySet<string>>(() => new Set());
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set());
  const { isGuest } = useStats();

  // Latest callbacks, so `close` stays stable for the sheet's Escape listener.
  const callbacks = useRef({ source, onOpen, onClose });
  useEffect(() => {
    callbacks.current = { source, onOpen, onClose };
  });

  function tap(i: number, j: number) {
    const tokens = sentences[i];
    const surface = (a: number, b: number) => tokens.slice(a, b).join(" ").replace(EDGE_PUNCT, "");
    const sentence = tokens.join(" ");
    const word = { surface: surface(j, j + 1), entry: lookupWord(keys[i][j]) };
    const phrase = phraseAt(keys[i], j);
    setPick(
      phrase ? { surface: surface(phrase.start, phrase.end), entry: phrase.entry, word, sentence } : { ...word, sentence },
    );
    setMarked({ sentence: i, start: phrase?.start ?? j, end: phrase?.end ?? j + 1 });
    callbacks.current.onOpen?.();
  }

  const close = useCallback(() => {
    setPick(null);
    setMarked(null);
    callbacks.current.onClose?.();
  }, []);

  async function save() {
    const lemma = pick?.entry?.lemma;
    if (!pick || !lemma || !marked || saving.has(lemma)) return;
    const without = (s: ReadonlySet<string>) => {
      const next = new Set(s);
      next.delete(lemma);
      return next;
    };
    setSaving((s) => new Set(s).add(lemma));
    setFailed(without);
    const ok = await saveWordAction({
      lemma,
      surface: pick.surface,
      sentence: pick.sentence,
      source: callbacks.current.source(marked.sentence),
    }).catch(() => false);
    setSaving(without);
    if (ok) setSaved((s) => new Set(s).add(lemma));
    else setFailed((s) => new Set(s).add(lemma));
  }

  const lemma = pick?.entry?.lemma;
  const sheet = pick ? (
    <WordSheet
      pick={pick}
      onClose={close}
      save={
        !lemma
          ? null
          : isGuest
            ? "guest"
            : saved.has(lemma)
              ? "saved"
              : saving.has(lemma)
                ? "saving"
                : failed.has(lemma)
                  ? "failed"
                  : "idle"
      }
      onSave={save}
    />
  ) : null;

  return {
    keys,
    tap,
    sheet,
    /** The marked range when it is in sentence `i`. */
    markedIn: (i: number): Marked | null => (marked?.sentence === i ? marked : null),
  };
}
