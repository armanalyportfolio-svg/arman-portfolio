"use server";

import { updateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase";
import { CONTENT_TAG } from "@/lib/content/get-content";
import { SECTION_KEYS, type SectionKey } from "@/lib/content/types";

type Result = { ok: true } | { ok: false; error: string };

// Saves one section. The write runs as the signed-in user (their access token),
// so the Supabase RLS policy decides whether they are allowed to edit.
export async function saveSection(
  key: SectionKey,
  data: unknown,
  accessToken: string
): Promise<Result> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: "Supabase is not configured. Add your keys to .env.local." };
  }
  if (!SECTION_KEYS.includes(key)) {
    return { ok: false, error: `Unknown section: ${key}` };
  }
  if (!data || typeof data !== "object") {
    return { ok: false, error: "Invalid data." };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    }
  );

  const { data: saved, error } = await supabase
    .from("site_content")
    .upsert({ key, data, updated_at: new Date().toISOString() })
    .select("key");

  if (error) return { ok: false, error: error.message };
  if (!saved?.length) return { ok: false, error: "Not allowed. Is your email in admin_users?" };

  updateTag(CONTENT_TAG);
  return { ok: true };
}
