"use client";

import SmartSpeakerCard from "@/components/ui/cards/smart-speakers/products-card";
import CardSkeleton from "../../../../ui/cards/CardSkeleton";
import getFileUrl from "@/utils/getFileUrl";

interface SmartSpeakersProps {
  isLoading: boolean;
  error: Error | null;
  speakers: Array<{
    id?: number | null;
    fileId?: string | null;
    title?: string | null;
    quantityInStorage?: number | null;
    stars?: number | null;
    finalPrice?: number | null;
    discountPercent?: number | null;
    originalPrice?: number | null;
  }>;
  skeletonId: string;
}

const SmartSpeakers = ({
  isLoading,
  error,
  speakers,
  skeletonId,
}: SmartSpeakersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-12">
      {isLoading ? (
        <>
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={`${skeletonId}-${index}`} />
          ))}
        </>
      ) : error ? (
        <p className="col-span-1 md:col-span-3 text-center text-textSecondary">
          خطا در بارگذاری اسپیکرهای هوشمند. لطفا دوباره تلاش کنید.
        </p>
      ) : speakers.length > 0 ? (
        speakers.map((speaker) => {
          const speakerId = typeof speaker?.id === "number" ? speaker.id : null;

          if (speakerId === null) {
            return null;
          }

          const thumbnail = getFileUrl(speaker.fileId) || "/images/Image.png";

          return (
            <SmartSpeakerCard
              key={speakerId}
              id={speakerId}
              thumbnail={thumbnail}
              title={speaker.title ?? ""}
              quantityInStorage={speaker.quantityInStorage ?? 0}
              stars={speaker.stars ?? 0}
              finalPrice={speaker.finalPrice ?? 0}
              discountPercent={speaker.discountPercent ?? 0}
              originalPrice={speaker.originalPrice ?? speaker.finalPrice ?? 0}
            />
          );
        })
      ) : (
        <p className="col-span-1 md:col-span-3 text-center text-textSecondary">
          اسپیکری یافت نشد.
        </p>
      )}
    </div>
  );
};

export default SmartSpeakers;
