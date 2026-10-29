import { supabase } from "@/lib/supabase";

export const MEDIA_BUCKET = "media";
const MAX_SIZE_MB = 10;

// Uploads a file to the public Supabase Storage bucket and returns its URL.
export async function uploadMedia(file: File, folder: string): Promise<string> {
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File is larger than ${MAX_SIZE_MB} MB.`);
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
