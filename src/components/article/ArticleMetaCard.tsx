"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
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
    <aside className="flex flex-col gap-5">
      {/* Brand logo — small, left-aligned, editorial */}
      <div className="relative h-7 w-full">
        <Image
          src={article.logoSrc}
          alt={article.company}
          fill
          className="object-contain object-left"
          sizes="160px"
        />
      </div>

      {/* SOLUCIONES — product names as text */}
      <MetaRow label={t("solutions")}>
        <ul className="space-y-1">
          {article.solutions.map((sol) => {
            const meta = SOLUTION_META[sol];
            if (!meta) {
              return (
                <li
                  key={sol}
                  className="font-sora text-[13px] font-semibold text-gray-900"
                >
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
                  className="font-sora text-[13px] font-semibold text-[#E26153] transition-opacity hover:opacity-70"
                >
                  {sol}
                </a>
              </li>
            );
          })}
        </ul>
      </MetaRow>

      <MetaRow label={t("industry")}>
        <p className="font-inter text-[13px] text-gray-700">
          {article.industry[locale]}
        </p>
      </MetaRow>

      <MetaRow label={t("size")}>
        <p className="font-inter text-[13px] text-gray-700">{sizeLabel}</p>
      </MetaRow>
    </aside>
  );
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="font-inter text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
        {label}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
