import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  showTimeSelector?: boolean;
  className?: string;
  chartHeight?: string;
}

const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  showTimeSelector = true,
  className = "",
  chartHeight = "h-60",
}) => {
  return (
    <div className={`w-full ${className} border-none flex flex-col gap-12`}>
      <div className="mb-6 flex justify-between mx-3 border-b border-gray-800 pb-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>
        {showTimeSelector && (
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        )}
      </div>

      <div dir="rtl" className="w-full">
        <Skeleton className={`w-full ${chartHeight} rounded-md`} />
      </div>
    </div>
  );
};

export default ChartSkeleton;

