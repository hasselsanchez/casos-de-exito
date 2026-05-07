import type { ReactNode } from "react";

/**
 * Replaces mentions of T1 products in plain text with anchor tags pointing to
 * their respective landing pages. The first occurrence of each product within
 * a single string gets linked; subsequent mentions stay as plain text to avoid
 * over-linking (better for SEO and readability).
 */

const PRODUCT_URLS: Record<string, string> = {
  T1Score: "https://t1.com/mx/score/",
  "T1 Tienda": "https://www.t1.com/mx",
  "T1 Pagos": "https://t1.com/mx/pagos/",
  "T1 Envíos": "https://www.t1.com/mx/envios",
};

const T1_HOME = "https://www.t1.com/mx";

// Order matters — longer / more specific patterns first so "T1Score" wins
// over a bare "T1", and "T1 Pagos" wins over "T1" alone.
const PATTERN = /(T1Score|T1\s+Tienda|T1\s+Pagos|T1\s+Env[íi]os|T1)\b/g;

const LINK_CLASSES =
  "font-medium text-[#E26153] underline decoration-[#E26153]/30 underline-offset-[3px] transition-colors hover:decoration-[#E26153]";

export function linkifyT1(text: string): ReactNode[] {
  const linked = new Set<string>();
  const result: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(PATTERN)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      result.push(text.slice(lastIndex, idx));
    }
    const matched = match[1];
    const normalized = matched.replace(/\s+/g, " ");

    if (linked.has(normalized)) {
      result.push(matched);
    } else {
      const url = PRODUCT_URLS[normalized] ?? T1_HOME;
      linked.add(normalized);
      result.push(
        <a
          key={`t1link-${idx}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASSES}
        >
          {matched}
        </a>,
      );
    }
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}
