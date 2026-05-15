import { articles } from "@/lib/articles";

/* Single source of truth for the listing-card visual assets.
   Both consumers — the main homepage feed (ArticleFeed → FeedCard) and the
   related-articles strip at the bottom of each case page (ArticleCard) —
   read from these maps. Adding a new article to articles.ts WITHOUT adding
   a CARD_GRADIENT entry here will fail the build (see safeguard below). */

/* Per-logo height for the centered-logo card layout. Wider wordmarks
   (Makora, Sears) get a smaller height so the bounding box stays in line
   with the more compact ones; taller-friendly marks (PASE, Doto) get a bit
   more presence. Stacked logos (icon ABOVE wordmark, e.g. Organic Skincare)
   need ~3× the height of a horizontal wordmark to feel balanced. */
export const CENTERED_LOGO: Record<string, string> = {
  "Sears México": "h-[36px]",
  Doto: "h-[44px]",
  Makora: "h-[28px]",
  PASE: "h-[48px]",
  Sesen: "h-[40px]",
  "Círculo de Crédito": "h-[44px]",
  "Organic Skincare": "h-[90px]",
};

/* Per-brand override for the logo container's max-width within the card.
   Default is max-w-[68%] which works for horizontal wordmarks (the wordmark
   fills the height of the container and the width is rarely the constraint).
   Stacked logos with icon + wordmark + subtitle distribute height vertically,
   so they need both more height AND more width to grow large enough that
   the visible wordmark portion feels equivalent to other brands. */
export const CENTERED_LOGO_MAX_W: Record<string, string> = {
  // Add an entry here only when h alone isn't enough (max-w-[68%] caps the
  // bg-contain width before the height takes effect). Empty by default.
};
export const DEFAULT_LOGO_MAX_W = "max-w-[68%]";

/* Per-article hover gradient config. Each slug points to a painterly
   background from /public/images/background hover images/ and optionally
   specifies how to frame it inside the card. `position` maps to CSS
   object-position, `origin` to transform-origin, and `scale` to a zoom
   factor — together they let a single source image expose very different
   regions per card. Makora and PASE share BKG 6: Makora crops into the
   upper-left, PASE into the lower-right, so each card sits at one end of
   the gradient. Círculo de Crédito uses BKG 1 framed on its lower-center
   blue blob to avoid the red zone in the upper-left.

   Pick a BKG whose dominant tone relates to the brand — see
   feedback-card-assets-mandatory memory for the brand-relation rule. */
export type GradientView = {
  src: string;
  position?: string;
  origin?: string;
  scale?: number;
};

export const CARD_GRADIENT: Record<string, GradientView> = {
  "circulo-de-credito": {
    src: "/images/background hover images/BKGMesa de trabajo 6.jpg",
    position: "left top",
    origin: "left top",
    scale: 1.9,
  },
  doto: { src: "/images/background hover images/BKGMesa de trabajo 8.jpg" },
  makora: {
    src: "/images/background hover images/BKGMesa de trabajo 6.jpg",
    position: "right top",
    origin: "right top",
    scale: 2.2,
  },
  pase: {
    src: "/images/background hover images/BKGMesa de trabajo 1.jpg",
    position: "50% 100%",
    origin: "center bottom",
    scale: 1.7,
  },
  sears: { src: "/images/background hover images/BKGMesa de trabajo 5.jpg" },
  sesen: { src: "/images/background hover images/BKGMesa de trabajo 10.jpg" },
  "organic-skincare": {
    src: "/images/background hover images/BKGMesa de trabajo 3.jpg",
  },
};

/* Build-time safeguard: every article in articles.ts MUST have a hover
   background registered in CARD_GRADIENT, or the listing-grid card looks
   flat on hover. This has been forgotten enough times that we now
   hard-fail the build instead of relying on memory. Both ArticleCard and
   ArticleFeed import from this module, so the check covers BOTH consumers
   (the homepage feed and the related-articles section). */
const missingGradient = articles.find((a) => !(a.slug in CARD_GRADIENT));
if (missingGradient) {
  throw new Error(
    `[cardAssets] Missing CARD_GRADIENT entry for slug "${missingGradient.slug}". ` +
      `Add a hover background in src/lib/cardAssets.ts — pick a file from ` +
      `/public/images/background hover images/ whose tone relates to the brand.`,
  );
}
