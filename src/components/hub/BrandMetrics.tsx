"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Metric = {
  key: "merchants" | "payments" | "shipments";
  prefix: string;
  target: number;
  suffix: string;
};

const METRICS: Metric[] = [
  { key: "merchants", prefix: "+", target: 25, suffix: " mil" },
  { key: "payments", prefix: "+$", target: 25, suffix: "B" },
  { key: "shipments", prefix: "+", target: 40, suffix: "M" },
];

/**
 * Brand metrics — black band with three large display numbers laid out
 * in a single row. Black and white only; no chromatic accents. Numbers
 * animate up on scroll.
 */
export default function BrandMetrics() {
  const t = useTranslations("brandMetrics");

  return (
    <section className="relative bg-black py-20 tablet:py-24">
      <div className="relative mx-auto max-w-[1180px] px-8 tablet:px-16">
        {/* Section title — short, single color */}
        <h2
          data-animate
          className="text-center font-sora text-[32px] leading-[1.1] font-light tracking-[-0.015em] text-white tablet:text-[44px]"
        >
          {t("title")}
        </h2>

        {/* Single-row stats strip */}
        <div
          data-animate
          className="mt-14 grid grid-cols-1 gap-y-12 tablet:mt-16 tablet:grid-cols-3 tablet:gap-y-0 tablet:gap-x-8"
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
      <p className="font-sora text-[44px] leading-[1] font-light tracking-[-0.025em] whitespace-nowrap text-white tablet:text-[56px] desktop:text-[64px]">
        {metric.prefix}
        <CountUp target={metric.target} />
        {metric.suffix}
      </p>
      <p className="mx-auto mt-4 max-w-[220px] font-inter text-[13px] leading-[1.5] font-normal text-gray-400 tablet:text-[14px]">
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
