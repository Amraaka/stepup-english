"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string };

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: "И-мэйл эсвэл нууц үг буруу байна." };
  redirect("/");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const displayName = String(formData.get("displayName") ?? "").slice(0, 60);
  const { error } = await supabase.auth.signUp({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    options: { data: { display_name: displayName } },
  });
  if (error) {
    return {
      error:
        error.code === "user_already_exists"
          ? "Энэ и-мэйл бүртгэлтэй байна — нэвтэрч орно уу."
          : "Бүртгэл амжилтгүй боллоо. Нууц үг 6+ тэмдэгт байх ёстой.",
    };
  }
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
