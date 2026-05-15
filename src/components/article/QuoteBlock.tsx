import type { ReactNode } from "react";
import type { Article } from "@/lib/articles";

interface QuoteBlockProps {
  quote: NonNullable<Article["quote"]>;
  locale: "es" | "en";
}

function renderQuote(text: string, highlight?: string): ReactNode {
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

export default function QuoteBlock({ quote, locale }: QuoteBlockProps) {
  const text = quote.text[locale];
  const highlight = quote.highlight?.[locale];

  return (
    <figure
      className="rounded-[14px] border border-gray-200 border-l-[3px] border-l-[#E26153] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] tablet:p-10"
      data-animate
    >
      <blockquote className="font-inter text-[22px] italic leading-[1.5] text-gray-800 tablet:text-[24px]">
        “{renderQuote(text, highlight)}”
      </blockquote>
      <figcaption className="mt-7">
        <p className="font-inter text-2xs font-semibold text-gray-900">
          {quote.author}
        </p>
        <p className="mt-0.5 font-inter text-micro text-gray-500">
          {quote.role[locale]}
        </p>
      </figcaption>
    </figure>
  );
}
