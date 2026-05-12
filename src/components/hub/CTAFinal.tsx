"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { T1_HOME_URL } from "@/lib/constants";

export default function CTAFinal() {
  const t = useTranslations("cta");

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-[920px] px-6 py-16 text-center tablet:py-20">
        <h2
          data-animate
          className="font-sora text-[32px] font-light leading-[1.1] tracking-[-0.015em] text-white tablet:whitespace-nowrap tablet:text-[44px]"
        >
          {t("title")} {t("titleAccent")}
        </h2>

        <p
          data-animate
          className="mx-auto mt-5 max-w-[560px] font-inter text-[17px] leading-[1.6] text-gray-500 tablet:text-[20px]"
        >
          {t("subtitle")}
        </p>

        <div data-animate className="mt-8">
          <Link
            href={T1_HOME_URL}
            className="inline-flex h-[56px] items-center rounded-full bg-[#DB3B2B] px-10 font-inter text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-[#E26153]"
          >
            {t("primary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
