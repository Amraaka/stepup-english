import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Mirrors supabase/migrations/*_init_core.sql (Supabase CLI owns migrations;
// Drizzle is used for typed queries only).

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  displayName: text("display_name").notNull().default(""),
  timezone: text("timezone").notNull().default("Asia/Ulaanbaatar"),
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
