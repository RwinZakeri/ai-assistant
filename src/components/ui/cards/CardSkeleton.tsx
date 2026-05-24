import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
  return (
    <>
      <div className="flex h-[500px] w-[400px] flex-col space-y-3">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[92%]" />
          <Skeleton className="h-8 w-[78%]" />
          <Skeleton className="h-8 w-[85%]" />
          <Skeleton className="h-20 w-[96%]" />
        </div>
      </div>
    </>
  );
};

export default CardSkeleton;

