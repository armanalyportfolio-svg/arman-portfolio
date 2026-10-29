// next/image only optimizes local files and hosts allowed in next.config.ts.
// Any other URL pasted in the admin panel is rendered as-is instead of erroring.
const OPTIMIZED_HOSTS = [/\.supabase\.co$/, /^res\.cloudinary\.com$/];

export function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const { hostname } = new URL(src);
    return OPTIMIZED_HOSTS.some((re) => re.test(hostname));
  } catch {
    return false;
  }
}
