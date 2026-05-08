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
  Makora: { w: "w-[88px]", h: "h-[22px]" },
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
  const readFullCase =
    locale === "es" ? "Leer el caso completo" : "Read the full case";

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-[14px] border border-gray-200 bg-white opacity-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(10,11,16,0.18)]"
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
        {/* Top dark gradient — subtler, only for logo legibility. heroPreviewDarken
           bumps it when the photo's environment has competing white branding. */}
        <div
          className={
            article.heroPreviewDarken
              ? "absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/55 via-black/20 to-transparent"
              : "absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/35 via-black/8 to-transparent"
          }
        />
        {/* Bottom white fade — image dissolves into the card for an editorial feel. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-white via-white/65 to-transparent" />

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

        {/* Video pill — bold editorial style: solid white, dark bold text, soft shadow. */}
        {article.contentType === "video" && (
          <span className="absolute top-4 right-4 inline-flex h-[28px] items-center gap-1.5 rounded-full bg-white px-3.5 font-inter text-[11px] font-bold text-[#0A0B10] shadow-[0_2px_8px_rgba(0,0,0,0.08)] tablet:top-5 tablet:right-5">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,4 20,12 6,20" />
            </svg>
            {locale === "es" ? "Video" : "Watch"}
          </span>
        )}

        {/* Hover overlay — soft full-image darken so the CTA reads cleanly */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30"
        />
        {/* Read more — centered on the image, reveals on hover. No pill, no border. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <span className="inline-flex items-center gap-2 font-inter text-[14px] font-semibold text-white opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
            {readFullCase}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Body — only headline; CTA lives on the image so every card stays compact ── */}
      <div className="p-5 tablet:p-6">
        <h3 className="line-clamp-2 min-h-[2.7em] font-sora text-[14px] leading-[1.35] font-light tracking-[-0.005em] text-[#0A0B10] tablet:text-[15px]">
          {article.title[locale]}
        </h3>
      </div>
    </Link>
  );
}
