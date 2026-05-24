import GuideHeroSection from "./components/GuideHeroSection";
import GuideSliderSection from "./components/GuideSliderSection";
import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";

export default function GuidePage() {
  return (
    <>
      <GuideHeroSection />
      <ContentWrapper>
        <GuideSliderSection />
      </ContentWrapper>
    </>
  );
}
