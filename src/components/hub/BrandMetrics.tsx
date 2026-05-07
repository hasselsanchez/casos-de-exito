"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Metric = {
  key: "merchants" | "payments" | "shipments" | "integrations";
  prefix: string;
  target: number;
  suffix: string;
};

const METRICS: Metric[] = [
  { key: "merchants", prefix: "+", target: 25, suffix: " mil" },
  { key: "payments", prefix: "+$", target: 13, suffix: "B" },
  { key: "shipments", prefix: "+", target: 40, suffix: "M" },
  { key: "integrations", prefix: "+", target: 10, suffix: "" },
];

/**
 * Compact metrics interlude — white. Small Sora numbers in a centered
 * horizontal row with hairline frames. Quiet typographic moment, not a
 * monumental section.
 */
export default function BrandMetrics() {
  const t = useTranslations("brandMetrics");

  return (
    <section className="relative bg-white py-12 tablet:py-16">
      <div className="relative mx-auto max-w-[1180px] px-5 tablet:px-8">
        {/* Small intro line — Inter regular with red accent */}
        <p
          data-animate
          className="mx-auto max-w-[640px] text-center font-inter text-[15px] leading-[1.5] font-normal text-gray-600 tablet:text-[16px]"
        >
          {t("title")}
          <span className="text-[#E26153]">{t("titleAccent")}</span>
          {t("titleAfter")}
        </p>

        {/* Compact metrics strip */}
        <div
          data-animate
          className="mt-7 grid grid-cols-2 gap-y-10 tablet:mt-8 tablet:grid-cols-4 tablet:gap-y-0"
        >
          {METRICS.map((m) => (
            <MetricCell key={m.key} metric={m} label={t(`items.${m.key}`)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCell({ metric, label }: { metric: Metric; label: string }) {
  return (
    <div className="text-center">
      <p className="font-inter text-[24px] leading-[1] font-bold tracking-[-0.015em] text-gray-900 tablet:text-[28px]">
        {metric.prefix}
        <CountUp target={metric.target} />
        {metric.suffix}
      </p>
      <p className="mx-auto mt-2.5 max-w-[200px] font-inter text-[12px] leading-[1.5] font-normal text-gray-500">
        {label}
      </p>
    </div>
  );
}

function CountUp({
  target,
  duration = 1500,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * target);
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {Math.round(count)}
    </span>
  );
}
