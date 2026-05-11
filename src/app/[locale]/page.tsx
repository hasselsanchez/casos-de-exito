import HeroSection from "@/components/hub/HeroSection";
import CustomersBySize from "@/components/hub/CustomersBySize";
import BrandMetrics from "@/components/hub/BrandMetrics";
import ArticleFeed from "@/components/hub/ArticleFeed";
import CTAFinal from "@/components/hub/CTAFinal";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* Wrapper lifts the rest of the page above the sticky hero so the
         first section slides up over it as you scroll. The negative margin
         + rounded top creates the editorial reveal. */}
      <div className="relative z-10 -mt-8 rounded-t-[32px] bg-white shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)]">
        <CustomersBySize />
        <BrandMetrics />
        <ArticleFeed />
        <CTAFinal />
      </div>
    </>
  );
}
