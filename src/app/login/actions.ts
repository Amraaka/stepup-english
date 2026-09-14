"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string };

async function siteOrigin() {
  const h = await headers();
  return h.get("origin") ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) {
    return {
      error:
        error.code === "email_not_confirmed"
          ? "И-мэйлээ баталгаажуулаагүй байна. Ирсэн холбоос дээр дарна уу."
          : "И-мэйл эсвэл нууц үг буруу байна.",
    };
  }
  // The app layout sends first-time users on to /onboarding.
  redirect("/");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const displayName = String(formData.get("displayName") ?? "").trim().slice(0, 60);
  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${await siteOrigin()}/auth/callback?next=/onboarding`,
    },
  });
  if (error) {
    return {
      error:
        error.code === "user_already_exists"
          ? "Энэ и-мэйл бүртгэлтэй байна — нэвтэрч орно уу."
          : error.code === "weak_password"
            ? "Нууц үг хэт сул байна. 6-аас дээш тэмдэгт оруулна уу."
            : "Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу.",
    };
  }
  // Email confirmation on (hosted projects): no session until the link is opened.
  if (!data.session) {
    return { notice: "Бүртгэл үүслээ! И-мэйлээ шалгаж, баталгаажуулах холбоос дээр дарна уу." };
  }
  redirect("/onboarding");
}

/** Supabase still hands out an authorize URL for a disabled provider (it 400s later). */
async function googleEnabled(): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
      next: { revalidate: 60 },
    });
    const settings = (await res.json()) as { external?: { google?: boolean } };
    return settings.external?.google === true;
  } catch {
    return false;
  }
}

export async function signInWithGoogle() {
  if (!(await googleEnabled())) redirect("/login?error=google");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await siteOrigin()}/auth/callback` },
  });
  if (error || !data.url) redirect("/login?error=google");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
