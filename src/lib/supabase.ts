import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http")
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : "https://placeholder.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your_supabase_anon_key_here"
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : "dummy-anon-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http") &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url_here" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your_supabase_anon_key_here"
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ContactMessage = {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
};
