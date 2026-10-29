const PRODUCTION_URL = "https://arman-aly-portfolio.vercel.app";

// Absolute site URL for canonical links, Open Graph, sitemap and structured data.
// A localhost value in NEXT_PUBLIC_SITE_URL is ignored in production builds, so a
// copied .env.local can't leak "http://localhost:3000" into share previews.
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isLocal = !fromEnv || /localhost|127\.0\.0\.1/.test(fromEnv);

  if (fromEnv && (!isLocal || process.env.NODE_ENV !== "production")) {
    return fromEnv.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000";
}
