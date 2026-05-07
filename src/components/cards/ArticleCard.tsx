import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Article } from "@/lib/articles";

interface ArticleCardProps {
  article: Article;
  locale: "es" | "en";
  index?: number;
}

/* Per-logo widths tuned so every brand renders at ~22px visual height —
   matches the treatment used in ArticleFeed for visual consistency. */
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

export default function ArticleCard({
  article,
  locale,
  index = 0,
}: ArticleCardProps) {
  const cfg = PARTNER_LOGO[article.company] ?? { w: "w-[64px]", h: "h-[22px]" };
  return (
    <Link
      href={{
        pathname: "/casos-de-exito/[slug]",
        params: { slug: article.slug },
      }}
      className="group relative overflow-hidden rounded-[20px] border border-gray-200/60 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.heroImage}
          alt={article.company}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ objectPosition: article.heroImageFocal ?? "center" }}
          sizes="(max-width: 768px) 100vw, 50vw"
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
            className={`block ${cfg.h ?? "h-[22px]"} ${cfg.w} bg-no-repeat brightness-0 invert`}
            style={{
              backgroundImage: `url(${article.logoSrc})`,
              backgroundSize: cfg.size ?? "contain",
              backgroundPosition: cfg.pos ?? "left center",
            }}
          />
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

      {/* Content area */}
      <div className="p-5">
        <h3 className="font-sora text-[15px] font-semibold leading-snug text-gray-900">
          {article.title[locale]}
        </h3>
        <p className="mt-2 line-clamp-2 font-inter text-[13px] leading-relaxed text-gray-500">
          {article.subtitle[locale]}
        </p>

        {/* Solutions tags — moved to content area, simplified */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {article.solutions.map((sol) => (
            <span
              key={sol}
              className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 font-inter text-[10.5px] font-medium text-gray-600"
            >
              {sol}
            </span>
          ))}
        </div>

        {/* Read more indicator */}
        <div className="mt-4 flex items-center gap-1.5 font-inter text-[12px] font-semibold text-[#E26153] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span>Leer más</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
