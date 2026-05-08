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

const SOLUTION_DISPLAY: Record<string, string> = {
  "T1 Tienda": "T1tienda",
  "T1 Envíos": "T1envíos",
  "T1 Pagos": "T1pagos",
  T1Score: "T1score",
};

export default function ArticleMetaCard({
  article,
  locale,
}: ArticleMetaCardProps) {
  const t = useTranslations("article");
  const sizeLabel = SIZE_LABELS[article.size][locale];

  return (
    <aside className="flex flex-col">
      {/* Brand logo — capped width, natural aspect ratio */}
      <Image
        src={article.logoSrc}
        alt={article.company}
        width={160}
        height={24}
        className="h-6 w-auto max-w-[110px] object-contain object-left"
      />

      <MetaRow label={t("solutions")}>
        <ul className="space-y-1">
          {article.solutions.map((sol) => {
            const meta = SOLUTION_META[sol];
            const display = SOLUTION_DISPLAY[sol] ?? sol;
            if (!meta) {
              return (
                <li key={sol} className="font-inter text-[13px] text-gray-900">
                  {display}
                </li>
              );
            }
            return (
              <li key={sol}>
                <a
                  href={meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-[13px] text-gray-900 transition-colors hover:text-[#E26153]"
                >
                  {display}
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

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5 border-t border-gray-100 pt-4">
      <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
