import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content/get-content";
import { getSiteUrl } from "@/lib/site-url";

// One-page site: a single URL, with the portfolio and portrait images listed so
// they can show up in Google Images.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const { hero, about, portfolio } = await getSiteContent();

  const images = [hero.portraitImage, about.image, ...portfolio.items.map((item) => item.image)]
    .filter(Boolean)
    .map((src) => (src.startsWith("http") ? src : `${siteUrl}${src}`));

  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
      images: [...new Set(images)],
    },
  ];
}
