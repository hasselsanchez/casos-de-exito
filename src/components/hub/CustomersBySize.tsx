"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { SOLUTION_META } from "@/lib/constants";

type SolutionKey = "tienda" | "pagos" | "envios" | "score";

const ORDER: SolutionKey[] = ["tienda", "pagos", "envios", "score"];

/* These labels MUST match the keys in SOLUTION_META so the meta lookup
   resolves. T1Score is one word per the brand guide; the rest have a space. */
const SOLUTION_LABEL: Record<SolutionKey, string> = {
  tienda: "T1 Tienda",
  pagos: "T1 Pagos",
  envios: "T1 Envíos",
  score: "T1Score",
};

const REPRESENTATIVE: Record<SolutionKey, string> = {
  tienda: "makora",
  pagos: "pase",
  envios: "doto",
  score: "circulo-de-credito",
};

/** Per-logo visual height tuning for the T1 product marks. The t1pagos SVG
   has a viewBox 16% taller than the others, so a single height class makes it
   read smaller. These overrides equalize optical weight in the rotation strip. */
const PRODUCT_LOGO_HEIGHT: Record<SolutionKey, string> = {
  tienda: "h-[20px]",
  pagos: "h-[24px]",
  envios: "h-[20px]",
  score: "h-[20px]",
};

/** Auto-rotation cadence (ms). Tuned with the progress-line keyframe in
   globals.css — must match the keyframe duration so the line completes its
   sweep exactly when the next case advances. */
const ROTATION_MS = 3500;

/** Cooldown after a manual click before auto-rotation resumes. */
const CLICK_COOLDOWN_MS = 12000;

/** Per-logo placement on the image — widths tuned so every brand renders at
   ~28px visual height for consistent editorial weight. */
const PARTNER_LOGO: Record<
  string,
  { w: string; h?: string; size?: string; pos?: string }
> = {
  "Sears México": { w: "w-[116px]", h: "h-[28px]" },
  Doto: { w: "w-[72px]", h: "h-[28px]" },
  Makora: { w: "w-[116px]", h: "h-[28px]" },
  PASE: { w: "w-[64px]", h: "h-[28px]" },
  Sesen: { w: "w-[96px]", h: "h-[28px]" },
  "Círculo de Crédito": {
    w: "w-[120px]",
    h: "h-[32px]",
    size: "100% auto",
    pos: "left 45%",
  },
};

/**
 * "Por solución" — own section. Vertical logo strip on the LEFT pins the
 * navigation; image center; compact editorial text right (industry → ONE
 * hero metric → quote → CTA). On tablet+ the section is pinned via a tall
 * outer wrapper + sticky inner — scroll position drives the active case
 * (one step ≈ ¾ viewport of scroll). Auto-rotation continues to advance
 * the page when the user is idle inside the pinned area. Mobile keeps the
 * stacked layout and the original opacity-only auto-rotation.
 */
export default function CustomersBySize() {
  const t = useTranslations("customers");
  const locale = useLocale() as "es" | "en";
  const [active, setActive] = useState<SolutionKey>("tienda");
  const [isHoveringStrip, setIsHoveringStrip] = useState(false);
  const [isInClickCooldown, setIsInClickCooldown] = useState(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paused = isHoveringStrip || isInClickCooldown;

  /* Respect prefers-reduced-motion — disables auto-rotation. Users can still
     click logos to navigate. State (not ref) so the JSX reacts to it. */
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Tablet+ gets the scroll-pinned experience. On mobile the section is a
     normal flow block — no pinning, no scroll-driven active step. The MQ
     match is read once + on resize so SSR renders the mobile layout first
     (safe default) and hydrates into desktop behavior when applicable. */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Scroll-driven active step. The outer wrapper is 4× viewport tall on
     desktop; inside, a sticky element pins for the first 3 viewports. We
     map scroll progress within the pinned range to one of 4 discrete steps. */
  useEffect(() => {
    if (!isDesktop) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const rect = wrapper.getBoundingClientRect();
      const wh = window.innerHeight;
      const pinRange = wrapper.offsetHeight - wh;
      if (pinRange <= 0) return;
      const scrolled = Math.max(0, Math.min(pinRange, -rect.top));
      const progress = scrolled / pinRange;
      /* Math.min guards against progress === 1 producing index 4. */
      const step = Math.min(ORDER.length - 1, Math.floor(progress * ORDER.length));
      const nextActive = ORDER[step];
      setActive(nextActive);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isDesktop]);

  /* Auto-rotation. On mobile we just toggle `active` (opacity cross-fade,
     no scroll). On desktop we instead programmatically scroll the page so
     the sticky pin advances naturally — this lets an idle user "watch the
     reel" without input, and at the last case it scrolls past the section
     into the next one. We only ever auto-scroll while the section is
     currently pinned to avoid yanking the page when the user is elsewhere. */
  useEffect(() => {
    if (paused || reducedMotion) return;
    if (!isDesktop) {
      const id = setInterval(() => {
        setActive((prev) => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length]);
      }, ROTATION_MS);
      return () => clearInterval(id);
    }
    const id = setInterval(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const wh = window.innerHeight;
      /* Only auto-advance when the section is actually pinned. */
      if (rect.top > 0 || rect.bottom < wh) return;
      const pinRange = wrapper.offsetHeight - wh;
      const stepHeight = pinRange / ORDER.length;
      const idx = ORDER.indexOf(active);
      /* On the last case, scroll a full step to release the pin and reveal
         the next section. Earlier cases scroll exactly one step. */
      const delta = idx >= ORDER.length - 1 ? stepHeight + 1 : stepHeight;
      window.scrollBy({ top: delta, behavior: "smooth" });
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [paused, reducedMotion, isDesktop, active]);

  /* Cleanup the click-cooldown timer on unmount. */
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  const handleLogoClick = (k: SolutionKey) => {
    /* On desktop the active step is owned by scroll position, so a click
       must scroll to that step rather than just calling setActive (which
       would be immediately overwritten by the scroll handler). */
    if (isDesktop && wrapperRef.current) {
      const wrapper = wrapperRef.current;
      const rect = wrapper.getBoundingClientRect();
      const wh = window.innerHeight;
      const pinRange = wrapper.offsetHeight - wh;
      const stepHeight = pinRange / ORDER.length;
      const targetIdx = ORDER.indexOf(k);
      /* Land in the middle of the target step's range so we're firmly inside
         it (and not balancing on a boundary the next scroll tick can flip). */
      const targetScrolled = stepHeight * (targetIdx + 0.5);
      const wrapperTopAbs = window.scrollY + rect.top;
      window.scrollTo({ top: wrapperTopAbs + targetScrolled, behavior: "smooth" });
    } else {
      setActive(k);
    }
    setIsInClickCooldown(true);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    /* When the cooldown ends, cycle to the next solution immediately rather
       than waiting another full ROTATION_MS — otherwise the clicked logo
       sits "selected" for cooldown + interval, which feels too long. */
    cooldownTimerRef.current = setTimeout(() => {
      setIsInClickCooldown(false);
    }, CLICK_COOLDOWN_MS);
  };

  const articleFor = (k: SolutionKey) =>
    articles.find((a) => a.slug === REPRESENTATIVE[k]);
  const activeArticle = articleFor(active);
  if (!activeArticle) return null;

  const readFullCase =
    locale === "es" ? "Leer el caso completo" : "Read the full case";

  return (
    <section id="por-solucion" className="bg-white">
      {/* ── Outer wrapper: tall on tablet+ to host the pinned scroll range.
          The inner element below uses `sticky top-0` to pin while the user
          scrolls through this height, mapping scroll position to active
          case. 300vh = 200vh of pin range = ~50vh per case, so one trackpad
          swipe advances one solution. Mobile gets natural flow, no extra
          height. */}
      <div
        ref={wrapperRef}
        className="tablet:h-[300vh]"
      >
        {/* ── Inner sticky pinned showcase ── */}
        <div className="py-16 tablet:sticky tablet:top-0 tablet:flex tablet:h-screen tablet:flex-col tablet:justify-center tablet:py-0">
          <div className="mx-auto w-full max-w-[1100px] px-5 tablet:px-8">
            {/* ── Section header ── */}
            <div data-animate className="max-w-[760px]">
              <h2 className="font-sora text-[32px] leading-[1.1] font-light tracking-[-0.015em] text-[#0A0B10] tablet:text-[40px]">
                {t("title")}
                <span className="text-[#E26153]">{t("titleAccent")}</span>
              </h2>
            </div>

            {/* ── Showcase grid ──
                Mobile: stacked (image, horizontal logo strip, text).
                Tablet+: 3 columns — vertical logo strip · image · compact text. */}
            <div
              data-animate
              className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 tablet:mt-9 tablet:grid-cols-[110px_minmax(0,1fr)_280px] tablet:items-start tablet:gap-x-9"
            >
              {/* ── Vertical logo strip (tablet+) ──
                  1px track to the left of each logo. Active logo's track
                  paints top-to-bottom over ROTATION_MS. Suppressed when
                  scroll — not the timer — owns the next advance. */}
              <div
                className="hidden tablet:order-1 tablet:flex tablet:flex-col tablet:gap-2"
                onMouseEnter={() => setIsHoveringStrip(true)}
                onMouseLeave={() => setIsHoveringStrip(false)}
              >
                {ORDER.map((k) => {
                  const isActive = active === k;
                  const sol = SOLUTION_LABEL[k];
                  const meta = SOLUTION_META[sol];
                  const heightClass = PRODUCT_LOGO_HEIGHT[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleLogoClick(k)}
                      aria-label={sol}
                      aria-pressed={isActive}
                      className="group flex items-center gap-3 py-2 text-left"
                    >
                      <div
                        aria-hidden
                        className={`h-10 w-px shrink-0 transition-colors duration-300 ${
                          isActive ? "bg-[#E26153]" : "bg-gray-100"
                        }`}
                      />
                      <div className="flex h-6 items-center">
                        {meta && (
                          <Image
                            src={meta.logoSrc}
                            alt={sol}
                            width={140}
                            height={32}
                            className={`${heightClass} w-auto object-contain transition-all duration-500 ${
                              isActive
                                ? "opacity-100"
                                : "opacity-40 grayscale group-hover:opacity-70"
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── Image stack with cross-fade ──
                  All 4 articles render as stacked layers in the same grid
                  cell; only the active layer is fully opaque & interactive.
                  Eliminates unmount/remount churn and the brief flash while
                  a new <Image> loads — every variant is preloaded and
                  toggling the active one is a pure opacity cross-fade. */}
              <div className="order-1 tablet:order-2">
                <div className="relative grid overflow-hidden rounded-[10px]">
                  {ORDER.map((k) => {
                    const a = articleFor(k);
                    if (!a) return null;
                    const isActive = active === k;
                    const aSlug = locale === "en" ? a.slugEn : a.slug;
                    const aHref = `/${locale}/casos-de-exito/${aSlug}`;
                    const aCfg = PARTNER_LOGO[a.company] ?? { w: "w-[88px]" };
                    return (
                      <Link
                        key={k}
                        href={aHref}
                        aria-hidden={!isActive}
                        tabIndex={isActive ? 0 : -1}
                        className={`group col-start-1 row-start-1 block transition-opacity duration-300 ease-out ${
                          isActive
                            ? "opacity-100"
                            : "pointer-events-none opacity-0"
                        }`}
                      >
                        <div className="relative aspect-[3/2]">
                          <Image
                            src={a.heroImage}
                            alt={a.company}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            style={{ objectPosition: a.heroImageFocal ?? "center" }}
                            sizes="(max-width: 768px) 100vw, 580px"
                            priority={isActive}
                          />

                          {/* Soft top + bottom gradients for white overlay legibility.
                             heroPreviewDarken bumps the top gradient when the photo's
                             environment has competing white branding (e.g. Makora wall). */}
                          <div
                            className={
                              a.heroPreviewDarken
                                ? "absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 via-black/30 to-transparent"
                                : "absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/35 via-black/8 to-transparent"
                            }
                          />
                          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                          {/* Logo — white, INSIDE image, no pill, top-left */}
                          <div className="absolute top-5 left-5 tablet:top-6 tablet:left-6">
                            <span
                              role="img"
                              aria-label={a.company}
                              className={`block ${aCfg.h ?? "h-7"} ${aCfg.w} bg-no-repeat brightness-0 invert`}
                              style={{
                                backgroundImage: `url(${a.logoSrc})`,
                                backgroundSize: aCfg.size ?? "contain",
                                backgroundPosition: aCfg.pos ?? "left center",
                              }}
                            />
                          </div>

                          {/* Title overlay — bottom-left */}
                          <div className="absolute inset-x-0 bottom-0 p-5 tablet:p-6">
                            <h3 className="max-w-[440px] font-sora text-[16px] leading-[1.3] font-light tracking-[-0.005em] text-white tablet:text-[18px]">
                              {a.title[locale]}
                            </h3>
                          </div>

                          {/* Video badge — top-right */}
                          {a.contentType === "video" && (
                            <span className="absolute top-5 right-5 inline-flex h-6 items-center gap-1.5 rounded-full bg-white/90 px-3 font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0A0B10] backdrop-blur-sm tablet:top-6 tablet:right-6">
                              <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="6,4 20,12 6,20" />
                              </svg>
                              {locale === "es" ? "Video" : "Watch"}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* ── Horizontal logo strip (mobile only) ──
                  Same active/progress semantics as the vertical desktop
                  strip, just oriented horizontally with the 1px track
                  above each logo. */}
              <div
                className="order-2 grid grid-cols-4 gap-x-3 tablet:hidden"
                onMouseEnter={() => setIsHoveringStrip(true)}
                onMouseLeave={() => setIsHoveringStrip(false)}
              >
                {ORDER.map((k) => {
                  const isActive = active === k;
                  const sol = SOLUTION_LABEL[k];
                  const meta = SOLUTION_META[sol];
                  const heightClass = PRODUCT_LOGO_HEIGHT[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleLogoClick(k)}
                      aria-label={sol}
                      aria-pressed={isActive}
                      className="group flex flex-col items-center"
                    >
                      <div
                        aria-hidden
                        className={`h-px w-full transition-colors duration-300 ${
                          isActive ? "bg-[#E26153]" : "bg-gray-100"
                        }`}
                      />
                      <div className="mt-5 flex h-6 items-center">
                        {meta && (
                          <Image
                            src={meta.logoSrc}
                            alt={sol}
                            width={140}
                            height={32}
                            className={`${heightClass} w-auto object-contain transition-all duration-500 ${
                              isActive
                                ? "opacity-100"
                                : "opacity-40 grayscale group-hover:opacity-70"
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── Right column: editorial hierarchy ──
                  Compact width on tablet+ — narrower text + tighter type
                  scale than before so it reads as a sidebar to the photo
                  rather than competing with it. All 4 article variants
                  render stacked in the same grid cell; only the active
                  one is fully opaque and interactive. */}
              <div className="relative order-3 grid">
                {ORDER.map((k) => {
                  const a = articleFor(k);
                  if (!a) return null;
                  const isActive = active === k;
                  const aSlug = locale === "en" ? a.slugEn : a.slug;
                  const aHref = `/${locale}/casos-de-exito/${aSlug}`;
                  return (
                    <div
                      key={k}
                      aria-hidden={!isActive}
                      className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-300 ease-out ${
                        isActive
                          ? "opacity-100"
                          : "pointer-events-none opacity-0"
                      }`}
                    >
                      {/* 1. Industry kicker — magazine-style section label */}
                      <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E26153]">
                        {a.industry[locale]}
                      </p>

                      {/* 2. ONE hero metric — the lead */}
                      {a.metrics[0] && (
                        <div className="mt-5">
                          <p className="font-sora text-[36px] leading-[1] font-light tracking-[-0.025em] text-[#0A0B10] tablet:text-[40px]">
                            {a.metrics[0].value[locale]}
                          </p>
                          <p className="mt-2.5 max-w-[260px] font-inter text-[12px] leading-[1.45] text-gray-500">
                            {a.metrics[0].label[locale]}
                          </p>
                        </div>
                      )}

                      {/* 3. Quote — the human truth */}
                      <blockquote className="mt-6 border-l border-gray-200 pl-4">
                        <p className="font-sora text-[14px] leading-[1.55] font-light text-gray-800 tablet:text-[15px]">
                          &ldquo;{a.quote.short[locale]}&rdquo;
                        </p>
                        <footer className="mt-2.5 font-inter text-[10.5px] text-gray-500">
                          {a.quote.author}
                          <span className="mx-1.5 text-gray-300">·</span>
                          {a.quote.role[locale]}
                        </footer>
                      </blockquote>

                      {/* 4. CTA — solution context already lives in the active pill above */}
                      <Link
                        href={aHref}
                        tabIndex={isActive ? 0 : -1}
                        className="group mt-6 inline-flex items-center gap-1.5 self-start font-inter text-[12px] font-medium text-[#E26153] transition-opacity hover:opacity-70"
                      >
                        {readFullCase}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        >
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
