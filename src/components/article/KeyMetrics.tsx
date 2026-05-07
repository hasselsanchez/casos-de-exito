import type { Article } from "@/lib/articles";

interface KeyMetricsProps {
  metrics: Article["metrics"];
  locale: "es" | "en";
}

export default function KeyMetrics({ metrics, locale }: KeyMetricsProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 tablet:grid-cols-3"
      data-animate
    >
      {metrics.map((metric, i) => (
        <div
          key={i}
          className="rounded-[20px] border border-gray-100 bg-white p-6 text-center shadow-[0px_0px_25px_2px_rgba(0,0,0,0.06)]"
        >
          <p className="font-sora text-display-lg font-bold text-[#E26153]">
            {metric.value[locale]}
          </p>
          <p className="mt-2 font-inter text-2xs text-gray-500">
            {metric.label[locale]}
          </p>
        </div>
      ))}
    </div>
  );
}
