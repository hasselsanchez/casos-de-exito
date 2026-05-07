import HeroSection from "@/components/hub/HeroSection";
import LogoStrip from "@/components/hub/LogoStrip";
import CustomersBySize from "@/components/hub/CustomersBySize";
import BrandMetrics from "@/components/hub/BrandMetrics";
import ArticleFeed from "@/components/hub/ArticleFeed";
import CTAFinal from "@/components/hub/CTAFinal";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LogoStrip />
      <CustomersBySize />
      <BrandMetrics />
      <ArticleFeed />
      <CTAFinal />
    </>
  );
}
