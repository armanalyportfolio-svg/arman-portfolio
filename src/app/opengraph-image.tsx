import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { getSiteContent } from "@/lib/content/get-content";
import { getSiteUrl } from "@/lib/site-url";

// Share preview for WhatsApp, Facebook, LinkedIn, X, etc. Uses the image
// uploaded in Admin → SEO when there is one; otherwise draws a branded card.

export const alt = "Arman Ali – Graphic Designer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MIME: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

// Returns the image as a data URI, or null if it can't be used (missing file,
// unsupported format such as WebP, network error).
async function loadImage(src: string): Promise<string | null> {
  if (!src) return null;
  const mimeFromPath = MIME[extname(src.split("?")[0]).toLowerCase()];

  if (src.startsWith("/") && mimeFromPath) {
    try {
      const buf = await readFile(join(process.cwd(), "public", src));
      return `data:${mimeFromPath};base64,${buf.toString("base64")}`;
    } catch {
      // Not on disk (e.g. serverless runtime) — try over HTTP below
    }
  }

  try {
    const url = src.startsWith("/") ? `${getSiteUrl()}${src}` : src;
    const res = await fetch(url);
    if (!res.ok) return null;
    const type = res.headers.get("content-type")?.split(";")[0] ?? "";
    if (!Object.values(MIME).includes(type)) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const { seo, general, hero } = await getSiteContent();

  const custom = await loadImage(seo.ogImage);
  if (custom) {
    return new ImageResponse(
      (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={custom} alt="" width={size.width} height={size.height} style={{ objectFit: "cover" }} />
      ),
      size
    );
  }

  const portrait = await loadImage(hero.portraitImage);
  const host = getSiteUrl().replace(/^https?:\/\//, "");
  const skills = hero.keySkills.slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #F6F5F9 0%, #EDE8F5 55%, #DBD8E3 100%)",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Faded name in the background, like the hero */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 210,
            display: "flex",
            justifyContent: "center",
            fontSize: 190,
            fontWeight: 900,
            letterSpacing: -8,
            color: "rgba(42, 36, 56, 0.06)",
          }}
        >
          {general.name.toUpperCase()}
        </div>

        {/* Text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 72px",
            width: portrait ? 640 : "100%",
            alignItems: portrait ? "flex-start" : "center",
          }}
        >
          {general.availableForWork && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 18px",
                borderRadius: 999,
                background: "white",
                border: "1px solid rgba(92, 84, 112, 0.2)",
                fontSize: 20,
                color: "#1D1826",
                marginBottom: 28,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 999, background: "#10B981" }} />
              {general.availabilityText} · {general.location}
            </div>
          )}
          <div style={{ fontSize: 84, fontWeight: 900, color: "#1D1826", letterSpacing: -2, lineHeight: 1 }}>
            {general.name}
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#5C5470", marginTop: 18 }}>{general.role}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 30 }}>
            {skills.map((skill) => (
              <div
                key={skill}
                style={{
                  padding: "8px 16px",
                  borderRadius: 12,
                  background: "white",
                  border: "1px solid rgba(92, 84, 112, 0.2)",
                  fontSize: 20,
                  color: "#1D1826",
                }}
              >
                {skill}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 22, color: "#5C5470", marginTop: 40 }}>{host}</div>
        </div>

        {/* Portrait anchored to the bottom right */}
        {portrait && (
          <div style={{ position: "absolute", right: -170, bottom: -10, width: 820, height: 640, display: "flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt="" width={820} height={640} style={{ objectFit: "contain", objectPosition: "bottom" }} />
          </div>
        )}
      </div>
    ),
    size
  );
}
