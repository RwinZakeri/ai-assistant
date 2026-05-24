import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";
import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const SpeakerPageSkeleton = () => {
  return (
    <ContentWrapper>
      <div className="flex flex-col">
        {/* Product Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12 md:mb-[96px]">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[300px] md:h-[594px] w-full md:w-[506px] rounded-[16px]" />
            {/* Thumbnails */}
            <div className="flex gap-3 hidden md:flex">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <Skeleton className="h-20 w-20 rounded-lg" />
              <Skeleton className="h-20 w-20 rounded-lg" />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col w-full md:w-[617px] justify-between items-start gap-8 md:gap-0">
            {/* Header */}
            <div className="flex flex-col gap-4 md:gap-5 w-full">
              <Skeleton className="h-8 w-full md:w-96" />
              <div className="flex flex-row items-center gap-3 md:gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>

            {/* Color Selection */}
            <div className="flex flex-col gap-4 w-full">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
                <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
                <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
                <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
              </div>
            </div>

            {/* Top Technical Details */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 w-full">
              <Skeleton className="h-[86px] w-full md:w-[200px] md:flex-1 rounded-xl md:rounded-2xl" />
              <Skeleton className="h-[86px] w-full md:w-[200px] md:flex-1 rounded-xl md:rounded-2xl" />
              <Skeleton className="h-[86px] w-full md:w-[200px] md:flex-1 rounded-xl md:rounded-2xl" />
            </div>

            {/* Price Display */}
            <div className="flex flex-row w-full justify-between items-start">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            {/* Buy Button */}
            <Skeleton className="h-12 w-full md:w-auto md:min-w-[200px] rounded-md" />
          </div>
        </div>

        {/* Description Section */}
        <div className="flex flex-col gap-8 md:gap-16 py-12 md:py-[96px]">
          <Skeleton className="h-7 w-24" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[85%]" />
          </div>

          {/* Technical Details */}
          <div className="flex flex-col gap-5 mt-8 md:mt-16">
            <Skeleton className="h-7 w-24" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-[98px]">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between py-4 border-b border-linePrimary"
                >
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="py-12 flex flex-col border-t border-b border-linePrimary">
          <div className="flex justify-between w-full">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>

        {/* Similar Speakers */}
        <div className="my-12 md:my-[96px]">
          <Skeleton className="h-7 w-40 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default SpeakerPageSkeleton;
