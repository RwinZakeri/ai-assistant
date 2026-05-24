
import { Skeleton } from "@/components/ui/skeleton";

const WalletCardSkeleton = () => {
  return (
    <>
      <div className="flex h-fit flex-col gap-3">
        <div className="flex items-end gap-1">
          <Skeleton className="h-9 w-40 rounded-lg" />
          <Skeleton className="h-4 w-14 mb-1 rounded-md" />
        </div>
      </div>
      <div className="w-32 h-16 relative overflow-hidden rounded-lg bg-surfaceTertiary/30">
        <div className="absolute inset-0 flex items-end justify-between px-0.5 pb-0.5 gap-0.5">
          {[45, 35, 50, 30, 55, 40, 48, 35, 42, 38, 45, 32, 50, 40, 45, 38].map(
            (height, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: `${height}%`,
                }}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default WalletCardSkeleton;
