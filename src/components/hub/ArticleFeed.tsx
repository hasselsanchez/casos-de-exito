"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { articles, type Article } from "@/lib/articles";

type SizeKey = "all" | "startup" | "growth" | "enterprise";

const SIZE_FILTERS: SizeKey[] = ["all", "startup", "growth", "enterprise"];

/* Per-logo placement on the card image (white overlay, no pill).
   Widths tuned so every brand renders at ~22px visual height for consistent
   editorial weight across the grid. */
const PARTNER_LOGO: Record<
  string,
  { w: string; h?: string; size?: string; pos?: string }
> = {
  "Sears México": { w: "w-[88px]", h: "h-[22px]" },
  Doto: { w: "w-[56px]", h: "h-[22px]" },
  Makora: { w: "w-[64px]", h: "h-[22px]", size: "auto 155%", pos: "left bottom" },
  PASE: { w: "w-[48px]", h: "h-[22px]" },
  Sesen: { w: "w-[72px]", h: "h-[22px]" },
  "Círculo de Crédito": {
    w: "w-[88px]",
    h: "h-[24px]",
    size: "100% auto",
    pos: "left 45%",
  },
};

/**
 * "Todos los casos" — own section. Filterable grid of every article.
 * White cards with hairline borders, image-on-top with white-logo overlay,
 * brand-color metric below.
 */
export default function ArticleFeed() {
  const t = useTranslations("filters");
  const tExplore = useTranslations("explore");
  const tCustomers = useTranslations("customers");
  const locale = useLocale() as "es" | "en";
  const [activeSize, setActiveSize] = useState<SizeKey>("all");

  const filtered = useMemo(
    () =>
      activeSize === "all"
        ? articles
        : articles.filter((a) => a.size === activeSize),
    [activeSize]
  );

  const labelFor = (k: SizeKey) => {
    if (k === "all") return locale === "es" ? "Todos" : "All";
    if (k === "startup") return tCustomers("segmentStartup");
    if (k === "growth") return tCustomers("segmentGrowth");
    return tCustomers("segmentEnterprise");
  };

  return (
    <section id="explorar" className="bg-white py-16 tablet:py-20">
      <div className="mx-auto max-w-[1100px] px-5 tablet:px-8">
        {/* ── Section header ── */}
        <div data-animate className="max-w-[600px]">
          <h2 className="font-sora text-[22px] leading-[1.2] font-light tracking-[-0.01em] text-[#0A0B10] tablet:text-[26px]">
            {tExplore("title")}
            <span className="text-[#E26153]">{tExplore("titleAccent")}</span>
          </h2>
        </div>

        {/* ── Filter pills + count ── */}
        <div
          data-animate
          className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <div className="flex flex-wrap gap-1.5">
            {SIZE_FILTERS.map((k) => {
              const isActive = activeSize === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setActiveSize(k)}
                  className={`rounded-full px-3.5 py-1.5 font-inter text-[12px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-[#0A0B10] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-[#0A0B10]"
                  }`}
                >
                  {labelFor(k)}
                </button>
              );
            })}
          </div>
          <span className="ml-auto font-inter text-[11px] tabular-nums text-gray-400">
            {filtered.length}{" "}
            {filtered.length === 1
              ? tCustomers("caseSingular")
              : tCustomers("casePlural")}
          </span>
        </div>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div
            key={activeSize}
            className="mt-8 grid grid-cols-1 gap-5 tablet:mt-10 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-3"
          >
            {filtered.map((article, i) => (
              <FeedCard
                key={article.slug}
                article={article}
                locale={locale}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="font-inter text-[13px] text-gray-500">
              {t("noResults")}
            </p>
            <button
              onClick={() => setActiveSize("all")}
              className="mt-3 font-inter text-[12px] font-medium text-[#E26153] hover:underline"
            >
              {t("clear")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  White card — hairline border, image with white-logo overlay */
/* ─────────────────────────────────────────────────────────── */
function FeedCard({
  article,
  locale,
  index = 0,
}: {
  article: Article;
  locale: "es" | "en";
  index?: number;
}) {
  const slug = locale === "en" ? article.slugEn : article.slug;
  const href = `/${locale}/casos-de-exito/${slug}`;
  const cfg = PARTNER_LOGO[article.company] ?? { w: "w-[64px]" };
  const headlineMetric = article.metrics[0];

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-[14px] border border-gray-200 bg-white opacity-0 transition-all duration-500 hover:-translate-y-1 hover:border-[#0A0B10]/55 hover:shadow-[0_24px_48px_-20px_rgba(10,11,16,0.18)]"
      style={{
        animation: `fade-in-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index * 70}ms forwards`,
      }}
    >
      {/* ── Image with white logo overlay (no pill) ── */}
      <div className="relative aspect-[5/4] overflow-hidden bg-gray-100">
        <Image
          src={article.heroImage}
          alt={article.company}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ objectPosition: article.heroImageFocal ?? "center" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {/* Top + bottom gradients for white-on-photo legibility.
           heroPreviewDarken bumps the top gradient when the photo's environment
           has competing white branding (e.g. Makora wall). */}
        <div
          className={
            article.heroPreviewDarken
              ? "absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 via-black/30 to-transparent"
              : "absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/45 via-black/12 to-transparent"
          }
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 via-black/8 to-transparent" />

        {/* Logo — white, INSIDE image, no pill, top-left */}
        <div className="absolute top-5 left-5 tablet:top-6 tablet:left-6">
          <span
            role="img"
            aria-label={article.company}
            className={`block ${cfg.h ?? "h-5"} ${cfg.w} bg-no-repeat brightness-0 invert`}
            style={{
              backgroundImage: `url(${article.logoSrc})`,
              backgroundSize: cfg.size ?? "contain",
              backgroundPosition: cfg.pos ?? "left center",
            }}
          />
        </div>

        {/* Industry kicker — bottom-left */}
        <div className="absolute right-5 bottom-4 left-5 tablet:right-6 tablet:bottom-5 tablet:left-6">
          <span className="font-inter text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/85">
            {article.industry[locale]}
          </span>
        </div>

        {/* Video badge — top-right */}
        {article.contentType === "video" && (
          <span className="absolute top-5 right-5 inline-flex h-5 items-center gap-1 rounded-full bg-white/90 px-2 font-inter text-[8.5px] font-semibold uppercase tracking-[0.18em] text-[#0A0B10] backdrop-blur-sm tablet:top-6 tablet:right-6">
            <svg width="5" height="5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,4 20,12 6,20" />
            </svg>
            {locale === "es" ? "Video" : "Watch"}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-4 p-5 tablet:p-6">
        {/* Headline */}
        <h3 className="font-sora text-[14px] leading-[1.35] font-light tracking-[-0.005em] text-[#0A0B10] tablet:text-[15px]">
          {article.title[locale]}
        </h3>

        {/* Footer: metric + arrow */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
          {headlineMetric && (
            <div>
              <p className="font-inter text-[20px] leading-[1] font-bold tracking-[-0.015em] text-[#E26153]">
                {headlineMetric.value[locale]}
              </p>
              <p className="mt-1.5 max-w-[180px] font-inter text-[10.5px] leading-[1.4] text-gray-500">
                {headlineMetric.label[locale]}
              </p>
            </div>
          )}
          <span
            aria-hidden
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all duration-300 group-hover:border-[#0A0B10] group-hover:bg-[#0A0B10] group-hover:text-white"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
