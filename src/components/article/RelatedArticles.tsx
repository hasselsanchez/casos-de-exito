"use client";

import { useLocale, useTranslations } from "next-intl";
import { articles } from "@/lib/articles";
import ArticleCard from "../cards/ArticleCard";
import SectionWrapper from "../ui/SectionWrapper";

interface RelatedArticlesProps {
  currentSlug: string;
}

export default function RelatedArticles({ currentSlug }: RelatedArticlesProps) {
  const t = useTranslations("article");
  const locale = useLocale() as "es" | "en";

  const related = articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 3);

  return (
    <SectionWrapper className="bg-[#FFFAFA] py-20 tablet:py-28">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle, #D4D4D4 0.8px, transparent 0.8px)", backgroundSize: "24px 24px" }} />
      <div className="relative z-10">
        <h2
          className="font-sora text-[32px] font-light text-gray-900 tablet:text-[44px]"
          data-animate
        >
          {t("relatedTitle").split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-[#E26153]">
            {t("relatedTitle").split(" ").slice(-1)}
          </span>
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
          {related.map((article, i) => (
            <ArticleCard
              key={article.slug}
              article={article}
              locale={locale}
              index={i}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
