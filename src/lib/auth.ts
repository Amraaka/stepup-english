import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** The signed-in user for this request (deduped across layout and page). */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
