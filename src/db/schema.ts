import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
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

export type SavedWordSource = { clip?: string; seg?: number };

/** A learner's saved word and its review state (ADR 0010). Meanings come from the glossary. */
export const savedWords = pgTable(
  "saved_words",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    lemma: text("lemma").notNull(),
    surface: text("surface").notNull(),
    sentence: text("sentence").notNull().default(""),
    source: jsonb("source").$type<SavedWordSource>().notNull().default({}),
    box: smallint("box").notNull().default(0),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull().defaultNow(),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.userId, t.lemma), index("saved_words_user_due_idx").on(t.userId, t.dueAt)],
);
