import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { articles, getArticleBySlug } from "@/lib/articles";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleMetaCard from "@/components/article/ArticleMetaCard";
import ArticleMetrics from "@/components/article/ArticleMetrics";
import { HeroCtaProvider } from "@/components/article/HeroCtaContext";
import LiteYouTube from "@/components/article/LiteYouTube";
import QuoteBlock from "@/components/article/QuoteBlock";
import RelatedArticles from "@/components/article/RelatedArticles";
import FinalCta from "@/components/article/FinalCta";
import { linkifyT1 } from "@/lib/linkifyT1";
import { SITE_URL } from "@/lib/constants";
import Image from "next/image";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  return articles.flatMap((article) => [
    { locale: "es", slug: article.slug },
    { locale: "en", slug: article.slugEn },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const loc = locale as "es" | "en";
  const description = article.executiveSummary[loc];
  const path = loc === "es" ? `/casos-de-exito/${article.slug}` : `/success-stories/${article.slugEn}`;
  const fullUrl = `${SITE_URL}/${loc}${path}`;
  const imageUrl = `${SITE_URL}${article.heroImage}`;
  const keywords = [
    article.company,
    "caso de éxito",
    "T1",
    ...article.solutions,
    article.industry[loc],
  ];

  return {
    title: `${article.title[loc]} | T1 Casos de Éxito`,
    description,
    keywords,
    authors: [{ name: "T1" }],
    alternates: {
      canonical: fullUrl,
      languages: {
        es: `${SITE_URL}/es/casos-de-exito/${article.slug}`,
        en: `${SITE_URL}/en/success-stories/${article.slugEn}`,
      },
    },
    openGraph: {
      title: article.title[loc],
      description,
      url: fullUrl,
      siteName: "T1",
      type: "article",
      locale: loc === "es" ? "es_MX" : "en_US",
      publishedTime: article.publishedAt,
      authors: ["T1"],
      tags: article.solutions,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.company,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title[loc],
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const locale = (await getLocale()) as "es" | "en";
  const t = await getTranslations("article");
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const path =
    locale === "es"
      ? `/casos-de-exito/${article.slug}`
      : `/success-stories/${article.slugEn}`;
  const articleUrl = `${SITE_URL}/${locale}${path}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title[locale],
    description: article.executiveSummary[locale],
    image: [`${SITE_URL}${article.heroImage}`],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: locale === "es" ? "es-MX" : "en-US",
    author: {
      "@type": "Organization",
      name: "T1",
      url: "https://www.t1.com/mx",
    },
    publisher: {
      "@type": "Organization",
      name: "T1",
      url: "https://www.t1.com/mx",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logos/T1.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    about: {
      "@type": "Organization",
      name: article.company,
    },
    keywords: [
      article.company,
      ...article.solutions,
      article.industry[locale],
      "caso de éxito",
      "T1",
    ].join(", "),
  };

  return (
    <HeroCtaProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-[920px] px-4 pb-20 pt-[110px] tablet:px-6 tablet:pb-24 tablet:pt-[130px]">
        {/* Back link */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center font-inter text-2xs font-medium text-[#E26153] transition-colors hover:underline"
        >
          {t("backToAll")}
        </Link>

        {/* ===== HERO 2-col: text | meta card ===== */}
        <div
          className="grid grid-cols-1 items-start gap-8 tablet:grid-cols-[1fr_170px] tablet:gap-14"
          data-animate
        >
          <ArticleHero article={article} locale={locale} />
          <ArticleMetaCard article={article} locale={locale} />
        </div>

        {/* ===== 2-col below hero: sticky metrics | (video + editorial body) ===== */}
        <div className="mt-14 grid grid-cols-1 gap-10 tablet:grid-cols-[200px_1fr] tablet:gap-12">
          {/* LEFT: sticky metrics */}
          <ArticleMetrics article={article} locale={locale} />

          {/* RIGHT: video + editorial body */}
          <div className="min-w-0">
            {/* Video */}
            {article.contentType === "video" && article.videoId && (
              <div
                className="relative aspect-video w-full overflow-hidden rounded-[16px] bg-gray-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)]"
                data-animate
              >
                <LiteYouTube
                  videoId={article.videoId}
                  title={article.title[locale]}
                />
              </div>
            )}

            {/* Brand intro — lead paragraph */}
            <section className="mt-12" data-animate>
              <p className="font-inter text-[19px] leading-[1.6] text-gray-700">
                {linkifyT1(article.content.intro[locale])}
              </p>
            </section>

            {/* Challenge */}
            <section className="mt-14" data-animate>
              <h2 className="font-sora text-[26px] font-light leading-tight text-gray-900 tablet:text-[30px]">
                {t("challenge")}
              </h2>
              <p className="mt-5 font-inter text-small leading-[1.7] text-gray-700">
                {linkifyT1(article.content.challenge[locale])}
              </p>
            </section>

            {/* Decorative image */}
            {article.images.length > 0 && (
              <div className="mt-10 flex justify-center" data-animate>
                <div className="relative aspect-[16/9] w-full max-w-[520px] overflow-hidden rounded-[14px]">
                  <Image
                    src={article.images[2] ?? article.images[1] ?? article.images[0]}
                    alt={article.company}
                    fill
                    className="object-cover object-[center_top]"
                    sizes="(max-width: 768px) 100vw, 520px"
                  />
                </div>
              </div>
            )}

            {/* Solution */}
            <section className="mt-14" data-animate>
              <h2 className="font-sora text-[26px] font-light leading-tight text-gray-900 tablet:text-[30px]">
                {t("solution")}
              </h2>
              <p className="mt-5 font-inter text-small leading-[1.7] text-gray-700">
                {linkifyT1(article.content.solution[locale])}
              </p>
            </section>

            {/* Results */}
            <section className="mt-14" data-animate>
              <h2 className="font-sora text-[26px] font-light leading-tight text-gray-900 tablet:text-[30px]">
                {t("results")}
              </h2>
              <p className="mt-5 font-inter text-small leading-[1.7] text-gray-700">
                {linkifyT1(article.content.results[locale])}
              </p>
            </section>

            {/* Quote */}
            <div className="mt-14">
              <QuoteBlock quote={article.quote} locale={locale} />
            </div>
          </div>
        </div>
      </article>

      <FinalCta />
      <RelatedArticles currentSlug={article.slug} />
    </HeroCtaProvider>
  );
}
