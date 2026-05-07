"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { HERO_FEATURED_INDEX } from "@/lib/constants";

/* logo wall lives in its own LogoStrip section */

/**
 * Hero on the inverted-red gradient bookend.
 * Compact centered editorial composition: kicker · short headline ·
 * pull-quote · CTAs. Below the text, the company photo (aspect-video,
 * original chrome). Closes with an embedded logo wall.
 */
export default function HeroSection() {
  const locale = useLocale() as "es" | "en";
  const featured = articles[HERO_FEATURED_INDEX];

  const caseHref = `/${locale}/casos-de-exito/${
    locale === "en" ? featured.slugEn : featured.slug
  }`;

  const copy = {
    kicker: locale === "es" ? "Caso destacado" : "Featured story",
    headlinePre: locale === "es" ? "Cómo" : "How",
    headlinePost:
      locale === "es"
        ? "redujo la mora temprana un 40% con T1Score."
        : "cut early arrears by 40% with T1Score.",
    pullQuote:
      locale === "es"
        ? "Para ese 10% sin historial, T1 es oro molido."
        : "For the 10% with no credit history, T1 is pure gold.",
    readCase: locale === "es" ? "Leer el caso completo" : "Read the full case",
    seeAll: locale === "es" ? "Ver todas las historias" : "See all stories",
  };

  return (
    <section
      className="relative pb-20 tablet:pb-28"
      style={{
        background:
          "linear-gradient(to bottom, #E59086 0%, #F2B5AE 18%, #FFFFFF 50%)",
      }}
    >
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-[110px] tablet:px-8 tablet:pt-[140px]">
        <div className="grid grid-cols-1 items-center gap-10 tablet:grid-cols-[1.1fr_1fr] tablet:gap-14 desktop:gap-20">
          {/* ── Left column: editorial copy ── */}
          <div data-animate className="flex flex-col items-start text-left">
            {/* Kicker */}
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-6 bg-gray-300" />
              <span className="font-inter text-[10.5px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                {copy.kicker}
              </span>
            </div>

            {/* Headline — Sora light, dark with red accent on company */}
            <h1 className="mt-6 font-sora text-[30px] leading-[1.12] font-light tracking-[-0.018em] text-gray-900 tablet:text-[36px] desktop:text-[44px]">
              <span>{copy.headlinePre} </span>
              <span className="text-[#E26153]">{featured.company}</span>
              <span> {copy.headlinePost}</span>
            </h1>

            {/* Pull-quote — large editorial italic */}
            <p className="mt-7 max-w-[520px] font-inter text-[17px] leading-[1.5] font-normal italic text-gray-700 tablet:text-[18px]">
              &ldquo;{copy.pullQuote}&rdquo;
            </p>
            <p className="mt-3 font-inter text-[11px] font-medium tracking-[0.04em] text-gray-500">
              {featured.quote.author}
              <span className="text-gray-400"> · {featured.quote.role[locale]}</span>
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={caseHref}
                className="group inline-flex items-center gap-2 font-inter text-[13px] font-semibold text-[#0A0B10]"
              >
                <span className="border-b border-[#0A0B10]/35 pb-1 transition-colors group-hover:border-[#0A0B10]">
                  {copy.readCase}
                </span>
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
              </Link>
              <a
                href="#casos"
                className="inline-flex items-center gap-1.5 font-inter text-[12px] font-normal text-gray-500 transition-colors hover:text-[#0A0B10]"
              >
                {copy.seeAll}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Right column: customer photo ── */}
          <figure data-animate className="w-full">
            <Link
              href={caseHref}
              className="group relative block overflow-hidden rounded-[14px] shadow-[0_22px_50px_-20px_rgba(10,11,16,0.22)] ring-1 ring-black/5"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={featured.heroImage}
                  alt={featured.company}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  style={{ objectPosition: featured.heroImageFocal ?? "center" }}
                  sizes="(max-width: 768px) 100vw, 640px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                {/* Logo — direct on image, no pill */}
                <Image
                  src={featured.logoSrc}
                  alt={featured.company}
                  width={180}
                  height={48}
                  className="absolute bottom-6 left-6 h-10 w-auto brightness-0 invert drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                />
                {/* Video badge — top-right */}
                {featured.contentType === "video" && (
                  <div className="absolute top-5 right-5 inline-flex h-7 items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 backdrop-blur-md">
                    <svg
                      width="7"
                      height="7"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="shrink-0"
                    >
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                    <span className="font-inter text-[9.5px] font-semibold uppercase tracking-[0.22em] text-white">
                      {locale === "es" ? "Video" : "Watch"}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </figure>
        </div>
      </div>
    </section>
  );
}
