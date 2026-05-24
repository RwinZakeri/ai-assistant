"use client";

import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";
import useDevice from "@/hooks/useDevice";
import DesktopBrands from "./DesktopBrands";
import MobileBrands from "./MobileBrands";

const BrandsLogos = () => {
  const device = useDevice();
  return (
    <ContentWrapper>
      <div className="flex flex-col gap-8 justify-center items-center">
        <p className="text-md-medium text-textSecondary">
          همکارانی که در توسعه دستیاران صوتی مشارکت کرده اند
        </p>
        {device === "mobile" ? <MobileBrands /> : <DesktopBrands />}
      </div>
    </ContentWrapper>
  );
};

export default BrandsLogos;
