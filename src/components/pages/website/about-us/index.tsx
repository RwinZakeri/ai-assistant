import AboutUsHeader from "./components/AboutUsHeader";
import JourneySection from "./components/JourneySection";
import AboutArioContent from "./components/AboutArioContent";
import ContactUsSection from "./components/ContactUsSection";
import Wrapper from "@/components/layouts/wrappers/ContentWrapper";
import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";

export default function AboutUsPage() {
  return (
    <>
      <ContentWrapper>
        <AboutUsHeader />
      </ContentWrapper>
      <JourneySection />
      <ContentWrapper>
        <AboutArioContent />
        <ContactUsSection />
      </ContentWrapper>
    </>
  );
}
