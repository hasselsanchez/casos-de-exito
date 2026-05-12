"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { articles } from "@/lib/articles";
import { T1_HOME_URL } from "@/lib/constants";

/**
 * Sticky video hero. The <section> is sticky-positioned at top:0 for the full
 * viewport height, so as the user scrolls the next section (white background)
 * slides up and "reveals" over the hero. The video itself is decorative —
 * paused under prefers-reduced-motion, replaced by the poster on mobile to
 * save bandwidth. Drop the final asset at /public/videos/hero.{mp4,webm}; the
 * <source> tags will pick it up without any code change.
 */
export default function HeroSection() {
  const locale = useLocale() as "es" | "en";

  /* Disable video autoplay for users who opt out of motion. We still render
     the poster so the hero never looks empty. */
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const copy = {
    headlinePre: locale === "es" ? "Historias de" : "Stories of",
    headlineAccent: locale === "es" ? "éxito" : "success",
    subhead:
      locale === "es"
        ? "Miles de negocios están redefiniendo el comercio en México. Conoce cómo lo hacen con T1."
        : "Thousands of businesses are redefining commerce in Mexico. See how they do it with T1.",
    primary: locale === "es" ? "Empieza con T1" : "Get started with T1",
    secondary: locale === "es" ? "Ver todas las historias" : "See all stories",
  };

  /* Logo rail — same source as the old LogoStrip, duplicated for a seamless
     marquee loop. White-inverted to read on the dark video. */
  const companies = articles.map((a) => ({
    name: a.company,
    logo: a.logoSrc,
    slug: a.slug,
  }));
  const rail = [...companies, ...companies];

  return (
    <section
      className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden bg-[#0A0B10]"
      aria-label={locale === "es" ? "Casos de éxito" : "Success stories"}
    >
      {/* ── Background video ──
          Place the final asset at /public/videos/hero.{mp4,webm}. No poster
          image — the video element falls back to pure black (via bg-black)
          while buffering, so the transition into the first frame is
          invisible instead of revealing a placeholder photo. */}
      <video
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full bg-black object-cover"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* ── Scrim ──
          Two gradient layers preserve video clarity while keeping the text
          legible: a left-weighted darken for the headline column, and a
          bottom darken that anchors the logo rail. No global blur — the
          video reads sharp. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-5 pt-[110px] pb-[200px] tablet:px-10 tablet:pt-[140px] tablet:pb-[220px]">
          <div className="max-w-[640px]">
            <h1
              className="font-sora text-[40px] leading-[1.05] font-light tracking-[-0.02em] text-white tablet:text-[64px]"
              style={{
                animation: `hero-fade-up 850ms cubic-bezier(0.16, 1, 0.3, 1) both`,
              }}
            >
              {copy.headlinePre}{" "}
              <span className="text-white">{copy.headlineAccent}</span>
            </h1>

            <p
              className="mt-6 max-w-[520px] font-inter text-[15px] leading-[1.6] text-white/75 tablet:text-[17px]"
              style={{
                animation: `hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 260ms both`,
              }}
            >
              {copy.subhead}
            </p>

            <div
              className="mt-9 flex flex-col items-stretch gap-3 tablet:flex-row tablet:items-center tablet:gap-3.5"
              style={{
                animation: `hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms both`,
              }}
            >
              <a
                href={T1_HOME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[48px] items-center justify-center rounded-[18px] bg-[#DB3B2B] px-7 font-inter text-[14px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(219,59,43,0.65)] transition-all duration-300 hover:bg-[#E26153] hover:shadow-[0_16px_36px_-10px_rgba(226,97,83,0.75)]"
              >
                {copy.primary}
              </a>
              <a
                href="#explorar"
                className="group inline-flex h-[48px] items-center justify-center gap-2 rounded-[18px] border border-white/25 bg-white/[0.08] px-7 font-inter text-[14px] font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white/[0.14]"
              >
                {copy.secondary}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                >
                  <path d="m6 7 6 6 6-6" />
                  <path d="m6 14 6 6 6-6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Logo rail — no label, no panel ──
            Marquee pinned to the bottom of the hero. Logos invert to white at
            low opacity so they read as a quiet proof line over the video,
            without competing with the headline. Edge fades blend the rail
            into the dark scrim instead of sitting on a glass card. */}
        <div
          className="absolute right-0 bottom-0 left-0 pb-20 tablet:pb-24"
          style={{
            animation: `hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 560ms both`,
          }}
        >
          <div className="group relative overflow-hidden">
            <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0A0B10] via-[#0A0B10]/60 to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-[#0A0B10] via-[#0A0B10]/60 to-transparent" />

            <div className="flex w-fit animate-marquee items-center gap-12 group-hover:[animation-play-state:paused] tablet:gap-16">
              {rail.map((c, i) => (
                <div
                  key={`${c.slug}-${i}`}
                  className="group/logo flex h-9 w-[108px] shrink-0 items-center justify-center px-2 transition-transform duration-300 ease-out hover:-translate-y-0.5"
                >
                  <Image
                    src={c.logo}
                    alt={c.name}
                    width={100}
                    height={36}
                    className={`object-contain brightness-0 invert opacity-50 transition-opacity duration-500 ease-out group-hover/logo:opacity-100 ${
                      c.slug === "sears"
                        ? "h-3 w-auto"
                        : c.slug === "doto"
                          ? "h-4 w-auto"
                          : c.slug === "makora"
                            ? "h-4 w-auto"
                            : "h-7 max-w-[100px]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
