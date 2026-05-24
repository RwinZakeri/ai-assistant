"use client";

import { SpeakersService } from "@/apis";
import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";
import SectionsHeader from "@/components/ui/headers/SectionsHeader";
import ReactQuery from "@/configs/react_query_keys";
import { useQuery } from "@tanstack/react-query";
import { useId } from "react";
import SmartSpeakers from "./SmartSpeakers";

const SmartSpeakerListPage = () => {
  const skeletonId = useId();
  const { data, isLoading, error } = useQuery({
    queryKey: [ReactQuery.allSpeakers],
    queryFn: () => {
      return SpeakersService.apiServicesAppSpeakersGetallspeakersPost({
        maxResultCount: 6,
        skipCount: 0,
        sorting: null,
      });
    },
  });

  const speakers = data?.items ?? [];

  return (
    <ContentWrapper>
      <div className="flex flex-col gap-8 md:gap-16">
        <SectionsHeader
          title="اسپیکر‌های هوشمند"
          description="بلندگوهای هوشمند با توانایی‌های پیشرفته برای تعامل سریع و آسان با دستیار صوتی"
        />
        <SmartSpeakers
          isLoading={isLoading}
          error={error}
          speakers={speakers}
          skeletonId={skeletonId}
        />
      </div>
    </ContentWrapper>
  );
};

export default SmartSpeakerListPage;
