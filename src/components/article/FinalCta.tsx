"use client";

import { useTranslations } from "next-intl";
import { SIGNUP_URL } from "@/lib/constants";
import SectionWrapper from "../ui/SectionWrapper";

export default function FinalCta() {
  const t = useTranslations("article");

  return (
    <SectionWrapper className="py-16 tablet:py-20">
      <div className="flex justify-center" data-animate>
        <a
          href={SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[45px] items-center gap-2 rounded-[18px] bg-[#E26153] px-7 font-inter text-2xs font-semibold text-white transition-colors hover:bg-[#DB3B2B]"
        >
          {t("finalCta")}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </SectionWrapper>
  );
}
