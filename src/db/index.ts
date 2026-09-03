import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Server-only. Connects as the postgres role (bypasses RLS) — every query in
// this codebase must therefore filter by the authenticated user's id, which
// callers get from supabase.auth.getUser(), never from client input.
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client, { schema });
