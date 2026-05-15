import type { ReactNode } from "react";
import type { Article } from "@/lib/articles";

interface CalloutBlockProps {
  callout: NonNullable<Article["callout"]>;
  locale: "es" | "en";
}

function renderCallout(text: string, highlight?: string): ReactNode {
  if (!highlight) return text;
  const idx = text.indexOf(highlight);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-medium text-[#E26153]">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  );
}

export default function CalloutBlock({ callout, locale }: CalloutBlockProps) {
  const text = callout.text[locale];
  const highlight = callout.highlight?.[locale];

  return (
    <aside
      className="rounded-[14px] border border-gray-200 border-l-[3px] border-l-[#E26153] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] tablet:p-10"
      data-animate
    >
      <p className="font-sora text-[22px] font-light leading-[1.45] text-gray-800 tablet:text-[24px]">
        {renderCallout(text, highlight)}
      </p>
    </aside>
  );
}
