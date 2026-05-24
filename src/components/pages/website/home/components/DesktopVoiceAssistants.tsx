"use client";

import VoiceCard from "@/components/ui/cards/voice-assistants/products-card";
import { useId } from "react";
import CardSkeleton from "../../../../ui/cards/CardSkeleton";
import getFileUrl from "@/utils/getFileUrl";
import type { VoiceAssistantItem } from "./type";

interface DesktopVoiceAssistantsProps {
  isLoading: boolean;
  items: VoiceAssistantItem[];
  skeletonId: string;
}

const DesktopVoiceAssistants = ({
  isLoading,
  items,
  skeletonId,
}: DesktopVoiceAssistantsProps) => {
  return (
    <div className="grid grid-cols-3 w-full gap-12">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={`${skeletonId}-${index}`} />
        ))
      ) : items.length > 0 ? (
        items.map((item) => {
          const imageUlr = getFileUrl(item?.thumbnail);
          return (
            <VoiceCard
              key={item.id}
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
          );
        })
      ) : (
        <p className="col-span-3 text-center text-textSecondary">
          دستیاری یافت نشد.
        </p>
      )}
    </div>
  );
};

export default DesktopVoiceAssistants;

