
import { Skeleton } from "@/components/ui/skeleton";

const UserProfileBannerSkeleton = () => {
  return (
    <div className="w-full h-[154px] relative">
      <Skeleton className="w-full h-[106px] rounded-2xl" />
      <div className="absolute bottom-0 right-6 size-30 rounded-full bg-surfaceTertiary overflow-hidden">
        <Skeleton className="h-full w-full rounded-full" />
      </div>
    </div>
  );
};

export default UserProfileBannerSkeleton;
