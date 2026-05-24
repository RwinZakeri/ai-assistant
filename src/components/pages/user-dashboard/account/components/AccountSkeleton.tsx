import { Skeleton } from "@/components/ui/skeleton/skeleton";

const AccountSkeleton = () => {
  const renderInputSkeleton = (width = "w-[512px]") => (
    <Skeleton className={`h-12 ${width} rounded-xl`} />
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surfacePrimary rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-8 mt-6">
          <div className="flex flex-col gap-4 w-[512px]">
            <Skeleton className="h-5 w-20 rounded-md self-end" />
            <div className="flex gap-6">
              {renderInputSkeleton("w-full")}
              {renderInputSkeleton("w-full")}
            </div>
          </div>

          <div className="flex flex-col gap-4 w-[512px]">
            <Skeleton className="h-5 w-32 rounded-md self-end" />
            {renderInputSkeleton()}
          </div>

          <div className="flex flex-col gap-4 w-[512px]">
            <Skeleton className="h-5 w-24 rounded-md self-end" />
            {renderInputSkeleton()}
          </div>

          <div className="flex flex-col gap-4 w-[512px]">
            <Skeleton className="h-5 w-24 rounded-md self-end" />
            <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4 rounded-md self-end" />
          </div>

          <div className="flex flex-col gap-4 w-[512px]">
            <Skeleton className="h-4 w-3/4 rounded-md self-end" />
            <Skeleton className="min-h-[110px] w-full rounded-2xl" />
            <div className="flex gap-6 w-full">
              {renderInputSkeleton("w-full")}
              {renderInputSkeleton("w-full")}
            </div>
            {renderInputSkeleton()}
          </div>

          <Skeleton className="h-12 w-[180px] rounded-xl self-end" />
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;

