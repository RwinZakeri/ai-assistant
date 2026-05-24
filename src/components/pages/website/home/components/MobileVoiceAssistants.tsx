"use client";

import VoiceCard from "@/components/ui/cards/voice-assistants/products-card";
import CardSkeleton from "../../../../ui/cards/CardSkeleton";
import getFileUrl from "@/utils/getFileUrl";
import { useId } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { VoiceAssistantItem } from "./type";

interface MobileVoiceAssistantsProps {
  isLoading: boolean;
  items: VoiceAssistantItem[];
  skeletonId: string;
}

const MobileVoiceAssistants = ({
  isLoading,
  items,
  skeletonId,
}: MobileVoiceAssistantsProps) => {
  return (
    <Swiper
      loop={true}
      modules={[Pagination]}
      pagination={{
        clickable: true,
        bulletActiveClass: "swiper-pagination-bullet-active",
        bulletClass: "swiper-pagination-bullet",
      }}
      allowTouchMove={true}
      touchEventsTarget="container"
      touchRatio={1}
      threshold={10}
      resistance={true}
      resistanceRatio={0.85}
      direction="horizontal"
      spaceBetween={16}
      slidesPerView={1.2}
      className="h-[600px] !overflow-visible w-full [&_.swiper-pagination]:!-bottom-[45px] [&_.swiper-pagination]:!left-1/2 [&_.swiper-pagination]:!-translate-x-1/2 [&_.swiper-pagination]:!w-auto [&_.swiper-pagination]:!flex [&_.swiper-pagination]:!gap-2 [&_.swiper-pagination]:!bg-[#1B1B1B]/50 [&_.swiper-pagination]:!px-4 [&_.swiper-pagination]:!py-2 [&_.swiper-pagination]:!rounded-full [&_.swiper-pagination-bullet]:!bg-[#353535] [&_.swiper-pagination-bullet]:!opacity-100 [&_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination-bullet]:!h-2 [&_.swiper-pagination-bullet]:!rounded-full [&_.swiper-pagination-bullet]:!transition-all [&_.swiper-pagination-bullet]:!duration-300 [&_.swiper-pagination-bullet-active]:!bg-gray-300 [&_.swiper-pagination-bullet-active]:!opacity-100 [&_.swiper-pagination-bullet-active]:!w-8"
    >
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <SwiperSlide key={`${skeletonId}-${index}`}>
            <CardSkeleton />
          </SwiperSlide>
        ))
      ) : items.length > 0 ? (
        items.map((item) => {
          const imageUlr = getFileUrl(item?.thumbnail);
          return (
            <SwiperSlide key={item.id}>
              <VoiceCard
                id={item.id || "/"}
                imageSrc={imageUlr || "image"}
                languageTags={item.languages ?? []}
                category={item?.category?.title ?? ""}
                title={item.title ?? ""}
                subscriptionType={""}
                ratingValue={String(item.stars ?? 0)}
                badges={item.tones ?? []}
                description={item.description ?? ""}
                currentPrice={String(item.finalPrice ?? 0)}
                currency="تومان"
                originalPrice={String(
                  item.originalPrice ?? item.finalPrice ?? ""
                )}
                discountPercent={Number(item.discountPercent ?? 0)}
              />
            </SwiperSlide>
          );
        })
      ) : (
        <SwiperSlide>
          <p className="text-center text-textSecondary">
            دستیاری یافت نشد.
          </p>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default MobileVoiceAssistants;

