"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { SIGNUP_URL } from "@/lib/constants";

export default function CTAFinal() {
  const t = useTranslations("cta");

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-[720px] px-6 py-24 text-center tablet:py-32">
        <h2
          data-animate
          className="font-sora text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white tablet:text-[55px]"
        >
          {t("title")}{" "}
          <span className="text-[#E26153]">{t("titleAccent")}</span>
        </h2>

        <p
          data-animate
          className="mx-auto mt-7 max-w-[560px] font-inter text-[17px] leading-[1.6] text-gray-500 tablet:text-[20px]"
        >
          {t("subtitle")}
        </p>

        <div data-animate className="mt-12">
          <Link
            href={SIGNUP_URL}
            className="inline-flex h-[56px] items-center rounded-full bg-[#E26153] px-10 font-inter text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-[#DB3B2B]"
          >
            {t("primary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
