import ContentWrapper from "@/components/layouts/wrappers/ContentWrapper";
import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const ProductPageSkeleton = () => {
  return (
    <ContentWrapper>
      <div className="flex flex-col gap-[192px]">
        <div className="flex gap-16">
          <Skeleton className="h-[506px] w-[506px] rounded-[16px]" />

          <div className="flex flex-col justify-between flex-1">
            <div className="flex flex-col gap-5">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
              </div>

              <div className="flex gap-20">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex gap-2 items-center">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 rounded-md" />
              <Skeleton className="h-12 w-32 rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-16">
          <Skeleton className="h-7 w-24" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[85%]" />
            <Skeleton className="h-5 w-[92%]" />
          </div>
        </div>

        <div className="py-12 flex flex-col border-t border-b border-linePrimary">
          <div className="flex justify-between w-full">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>

        <div className="flex gap-10">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ProductPageSkeleton;
