import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// Mirrors supabase/migrations/*.sql (Supabase CLI owns migrations;
// Drizzle is used for typed queries only).

/** Self-assessed level until the placement test exists. */
export const ENGLISH_LEVELS = ["beginner", "elementary", "intermediate", "advanced", "unsure"] as const;
export type EnglishLevel = (typeof ENGLISH_LEVELS)[number];

export const LEARNING_GOALS = ["school", "work", "exam", "travel", "self"] as const;
export type LearningGoal = (typeof LEARNING_GOALS)[number];

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  displayName: text("display_name").notNull().default(""),
  timezone: text("timezone").notNull().default("Asia/Ulaanbaatar"),
  englishLevel: text("english_level").$type<EnglishLevel>(),
  learningGoals: text("learning_goals").array().$type<LearningGoal[]>().notNull().default(sql`'{}'::text[]`),
  onboardedAt: timestamp("onboarded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ACTIVITY_MODULES = [
  "general",
  "grammar",
  "vocabulary",
  "listening",
  "reading",
  "writing",
  "speaking",
  "books",
  "games",
  "challenges",
] as const;
export type ActivityModule = (typeof ACTIVITY_MODULES)[number];

export const activityEvents = pgTable(
  "activity_events",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    module: text("module").$type<ActivityModule>().notNull(),
    kind: text("kind").notNull().default("study"),
    durationSec: integer("duration_sec").notNull().default(0),
    points: integer("points").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    meta: jsonb("meta").notNull().default({}),
  },
  (t) => [index("activity_events_user_occurred_idx").on(t.userId, t.occurredAt.desc())],
);

/** Where a saved word came from (ADR 0016). */
export type SavedWordSource =
  | { kind: "clip"; clip: string; seg?: number }
  | { kind: "text"; text: string; para: number };

/** What the column may hold: rows saved before ADR 0016 are `{clip, seg}` without `kind`. */
export type StoredWordSource = SavedWordSource | { kind?: undefined; clip?: string; seg?: number };

/** A learner's saved word and its review state (ADR 0010). Meanings come from the glossary. */
export const savedWords = pgTable(
  "saved_words",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    lemma: text("lemma").notNull(),
    surface: text("surface").notNull(),
    sentence: text("sentence").notNull().default(""),
    source: jsonb("source").$type<StoredWordSource>().notNull().default({}),
    box: smallint("box").notNull().default(0),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull().defaultNow(),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.userId, t.lemma), index("saved_words_user_due_idx").on(t.userId, t.dueAt)],
);

export const REVIEW_ITEMS = ["word", "grammar"] as const;

/** One answer in a word or mistake review; append-only (ADR 0015). */
export const reviewLog = pgTable(
  "review_log",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    item: text("item").$type<(typeof REVIEW_ITEMS)[number]>().notNull(),
    /** word: lemma; grammar: "<slug>|<item_key>" */
    itemRef: text("item_ref").notNull(),
    correct: boolean("correct").notNull(),
    boxBefore: smallint("box_before").notNull(),
    boxAfter: smallint("box_after").notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("review_log_user_reviewed_idx").on(t.userId, t.reviewedAt.desc())],
);

export const grammarProgress = pgTable(
  "grammar_progress",
  {
    userId: uuid("user_id").notNull(),
    slug: text("slug").notNull(),
    bestScore: smallint("best_score").notNull(),
    lastScore: smallint("last_score").notNull(),
    total: smallint("total").notNull(),
    attempts: integer("attempts").notNull().default(1),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.slug] })],
);

/** Modules whose items (texts, clips) record a finished attempt (ADR 0020). */
export const CONTENT_MODULES = ["reading", "listening", "speaking"] as const;
export type ContentModule = (typeof CONTENT_MODULES)[number];

export const contentProgress = pgTable(
  "content_progress",
  {
    userId: uuid("user_id").notNull(),
    module: text("module").$type<ContentModule>().notNull(),
    ref: text("ref").notNull(),
    bestScore: smallint("best_score").notNull(),
    lastScore: smallint("last_score").notNull(),
    total: smallint("total").notNull(),
    attempts: integer("attempts").notNull().default(1),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.module, t.ref] })],
);

export const grammarReview = pgTable(
  "grammar_review",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    slug: text("slug").notNull(),
    itemKey: text("item_key").notNull(),
    box: smallint("box").notNull().default(0),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull().defaultNow(),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.userId, t.slug, t.itemKey), index("grammar_review_user_due_idx").on(t.userId, t.dueAt)],
);

/** One request to the paid pronunciation service, for the daily quota (ADR 0011). */
export const pronunciationUsage = pgTable(
  "pronunciation_usage",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("pronunciation_usage_user_created_idx").on(t.userId, t.createdAt.desc())],
);
