"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Article } from "@/lib/articles";
import { SOLUTION_META } from "@/lib/constants";

interface ArticleSidebarProps {
  article: Article;
  locale: "es" | "en";
}

const SIZE_LABELS: Record<Article["size"], { es: string; en: string }> = {
  startup: { es: "Startup", en: "Startup" },
  growth: { es: "Growth", en: "Growth" },
  enterprise: { es: "Enterprise", en: "Enterprise" },
};

export default function ArticleSidebar({ article, locale }: ArticleSidebarProps) {
  const t = useTranslations("article");
  const sizeLabel = SIZE_LABELS[article.size][locale];

  return (
    <aside className="flex flex-col gap-5 tablet:sticky tablet:top-24">
      {/* Logo */}
      <div className="relative h-9 w-full">
        <Image
          src={article.logoSrc}
          alt={article.company}
          fill
          className="object-contain object-left"
          sizes="200px"
        />
      </div>

        <MetaSection label={t("productsUsed")}>
          <ul className="space-y-2">
            {article.solutions.map((sol) => {
              const meta = SOLUTION_META[sol];
              if (!meta) {
                return (
                  <li key={sol} className="font-inter text-2xs text-gray-700">
                    {sol}
                  </li>
                );
              }
              return (
                <li key={sol}>
                  <a
                    href={meta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-inter text-2xs text-gray-700 transition-colors hover:text-[#E26153]"
                  >
                    <Image
                      src={meta.logoSrc}
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                    />
                    {sol}
                  </a>
                </li>
              );
            })}
          </ul>
        </MetaSection>

        <MetaSection label={t("industry")}>
          <p className="inline-flex items-center gap-2 font-inter text-2xs text-gray-700">
            <IndustryIcon />
            {article.industry[locale]}
          </p>
        </MetaSection>

        <MetaSection label={t("size")}>
          <p className="inline-flex items-center gap-2 font-inter text-2xs text-gray-700">
            <SizeIcon size={article.size} />
            {sizeLabel}
          </p>
        </MetaSection>

        <MetaSection label={t("keyMetrics")}>
          <ul className="space-y-3">
            {article.metrics.map((m, i) => (
              <li key={i} className="flex items-stretch gap-2.5">
                <div className="w-[2px] rounded-full bg-[#E26153]" />
                <div>
                  <p className="font-sora text-[18px] font-bold leading-none text-gray-900">
                    {m.value[locale]}
                  </p>
                  <p className="mt-1 font-inter text-[10px] leading-tight text-gray-500">
                    {m.label[locale]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </MetaSection>
    </aside>
  );
}

function MetaSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-gray-100 pt-4">
      <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

/** Generic industry icon — building / sector */
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
      className="shrink-0 text-gray-400"
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

/** Size icon varies by tier value */
function SizeIcon({ size }: { size: Article["size"] }) {
  if (size === "startup") {
    // Lightning / flash — disruptive, fast-moving
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
        className="shrink-0 text-gray-400"
        aria-hidden="true"
      >
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  }
  if (size === "growth") {
    // Trending-up — scaling / growing
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
        className="shrink-0 text-gray-400"
        aria-hidden="true"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    );
  }
  // Enterprise — building / established
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
      className="shrink-0 text-gray-400"
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
