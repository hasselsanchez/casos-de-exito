"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Article } from "@/lib/articles";
import { T1_HOME_URL } from "@/lib/constants";
import { useHeroCta } from "./HeroCtaContext";

interface ArticleHeroProps {
  article: Article;
  locale: "es" | "en";
}

function highlightCompany(text: string, company: string) {
  const idx = text.indexOf(company);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-[#E26153]">{company}</span>
      {text.slice(idx + company.length)}
    </>
  );
}

export default function ArticleHero({ article, locale }: ArticleHeroProps) {
  const t = useTranslations("article");
  const { setHeroCtaVisible } = useHeroCta();
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const summary = article.executiveSummary[locale];

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroCtaVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setHeroCtaVisible]);

  return (
    <div className="flex flex-col">
      <h1 className="font-sora text-[34px] font-semibold leading-[1.1] tracking-tight text-gray-900 tablet:text-[42px]">
        {article.title[locale]}
      </h1>
      <p className="mt-5 font-inter text-[15px] leading-[1.6] text-gray-600">
        {highlightCompany(summary, article.company)}
      </p>
      <div className="mt-6">
        <a
          ref={ctaRef}
          href={T1_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[40px] items-center gap-2 rounded-[18px] bg-[#E26153] px-5 font-inter text-2xs font-semibold text-white transition-colors hover:bg-[#DB3B2B]"
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
      </div>
    </div>
  );
}
