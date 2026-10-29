import { defaultContent } from "./defaults";
import { SECTION_KEYS, type SectionKey, type SiteContent } from "./types";

export type ContentRow = { key: string; data: unknown };

// Saved rows override defaults per section. Fields added to the schema later
// still get their default value, because the merge is shallow per section.
export function mergeContent(rows: ContentRow[] | null | undefined): SiteContent {
  const content = structuredClone(defaultContent);
  for (const row of rows ?? []) {
    if (!SECTION_KEYS.includes(row.key as SectionKey)) continue;
    if (!row.data || typeof row.data !== "object") continue;
    const key = row.key as SectionKey;
    Object.assign(content[key], row.data);
  }
  return content;
}

// Builds the wa.me link from the number saved in Contact settings.
export function whatsappUrl(number: string, message?: string) {
  const digits = number.replace(/\D/g, "");
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}

// "923232902969" -> "+92 323 2902969"
export function formatPhone(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("92")) {
    return `+92 ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return digits ? `+${digits}` : "";
}
