"use client";

import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";
import SectionsHeader from "@/components/ui/headers/SectionsHeader";
import useDevice from "@/hooks/useDevice";
import DesktopFeatures from "./DesktopFeatures";
import MobileFeatures from "./MobileFeatures";

const Features = () => {
  const device = useDevice();

  return (
    <ContentWrapper>
      <div className="flex flex-col gap-16 ">
        <SectionsHeader
          title="چرا دستیار صوتی آریو؟"
          description="دستیار صوتی هوشمند برای پاسخگویی به تمام سوالات و نیازهای عمومی و تخصصی شما در هر لحظه"
        />
        {device === "mobile" ? <MobileFeatures /> : <DesktopFeatures />}
      </div>
    </ContentWrapper>
  );
};

export default Features;
