"use client";

import { useTranslations } from "next-intl";
import type { Article } from "@/lib/articles";
import { T1_HOME_URL } from "@/lib/constants";
import { useHeroCta } from "./HeroCtaContext";

interface ArticleMetricsProps {
  article: Article;
  locale: "es" | "en";
}

export default function ArticleMetrics({
  article,
  locale,
}: ArticleMetricsProps) {
  const t = useTranslations("article");
  const { heroCtaVisible } = useHeroCta();

  return (
    <aside>
      <div className="tablet:sticky tablet:top-24">
        {/* CTA — fades in when hero CTA leaves the viewport */}
        <a
          href={T1_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-hidden={heroCtaVisible}
          tabIndex={heroCtaVisible ? -1 : 0}
          className={`mb-7 inline-flex h-[40px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#DB3B2B] px-4 font-inter text-2xs font-semibold text-white transition-opacity duration-300 hover:bg-[#E26153] ${
            heroCtaVisible
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }`}
        >
          {t("exploreT1")}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>

        <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
          {t("keyMetrics")}
        </p>
        <ul className="mt-4 space-y-6">
          {article.metrics.map((m, i) => (
            <li key={i} className="flex items-stretch gap-3">
              <div className="w-[2px] rounded-full bg-[#E26153]" />
              <div>
                <p className="font-inter text-[24px] font-bold leading-none text-gray-900">
                  {m.value[locale]}
                </p>
                <p className="mt-1.5 font-inter text-[12px] leading-tight text-gray-500">
                  {m.label[locale]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
