import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase";
import { defaultContent } from "./defaults";
import { mergeContent } from "./merge";
import type { SiteContent } from "./types";

export const CONTENT_TAG = "site-content";

export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");

  if (!isSupabaseConfigured) return defaultContent;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    const { data, error } = await supabase.from("site_content").select("key, data");
    if (error) throw error;
    return mergeContent(data);
  } catch (err) {
    console.error("Failed to load site content, using defaults:", err);
    return defaultContent;
  }
}
