"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Article } from "@/lib/articles";
import { SOLUTION_META } from "@/lib/constants";

interface ArticleMetaCardProps {
  article: Article;
  locale: "es" | "en";
}

const SIZE_LABELS: Record<Article["size"], { es: string; en: string }> = {
  startup: { es: "Startup", en: "Startup" },
  growth: { es: "Growth", en: "Growth" },
  enterprise: { es: "Enterprise", en: "Enterprise" },
};

export default function ArticleMetaCard({
  article,
  locale,
}: ArticleMetaCardProps) {
  const t = useTranslations("article");
  const sizeLabel = SIZE_LABELS[article.size][locale];

  return (
    <aside className="rounded-[14px] bg-gray-50 p-6">
      {/* Brand logo — centered, large enough to read */}
      <div className="relative h-12 w-full">
        <Image
          src={article.logoSrc}
          alt={article.company}
          fill
          className="object-contain object-center"
          sizes="280px"
        />
      </div>

      {/* Single divider below logo */}
      <hr className="my-5 border-t border-gray-200" />

      {/* SOLUCIONES — only product logos, no text */}
      <div>
        <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
          {t("solutions")}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
          {article.solutions.map((sol) => {
            const meta = SOLUTION_META[sol];
            if (!meta) {
              return (
                <span
                  key={sol}
                  className="font-inter text-2xs font-medium text-gray-700"
                >
                  {sol}
                </span>
              );
            }
            return (
              <a
                key={sol}
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer"
                title={sol}
                aria-label={sol}
                className="block transition-opacity hover:opacity-70"
              >
                <Image
                  src={meta.logoSrc}
                  alt={sol}
                  width={120}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </a>
            );
          })}
        </div>
      </div>

      {/* INDUSTRIA — no divider, red icon, smaller text */}
      <div className="mt-5">
        <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
          {t("industry")}
        </p>
        <p className="mt-2 inline-flex items-center gap-2 font-inter text-[13px] text-gray-700">
          <IndustryIcon />
          {article.industry[locale]}
        </p>
      </div>

      {/* TAMAÑO — no divider, red icon, smaller text */}
      <div className="mt-5">
        <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
          {t("size")}
        </p>
        <p className="mt-2 inline-flex items-center gap-2 font-inter text-[13px] text-gray-700">
          <SizeIcon size={article.size} />
          {sizeLabel}
        </p>
      </div>
    </aside>
  );
}

function IndustryIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[#E26153]"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9h.01" />
      <path d="M9 12h.01" />
      <path d="M9 15h.01" />
      <path d="M9 18h.01" />
    </svg>
  );
}

function SizeIcon({ size }: { size: Article["size"] }) {
  if (size === "startup") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-[#E26153]"
        aria-hidden="true"
      >
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  }
  if (size === "growth") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-[#E26153]"
        aria-hidden="true"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[#E26153]"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
