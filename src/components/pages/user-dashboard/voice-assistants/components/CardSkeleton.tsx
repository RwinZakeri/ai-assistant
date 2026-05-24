import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => {
  return (
    <div className="rounded-xl flex flex-col h-[548px] flex-1 overflow-hidden">
      <Skeleton className="rounded-tl-2xl rounded-tr-2xl self-stretch shrink-0 h-60 w-full" />
      <div className=" flex-1 flex flex-col px-6 py-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="flex items-center justify-between gap-3 mb-5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="flex gap-2 mb-5">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>
  );
};
