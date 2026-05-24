import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table/table';

interface DiscountCodesTableSkeletonProps {
  rows?: number;
}

const DiscountCodesTableSkeleton = ({
  rows = 5,
}: DiscountCodesTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="text-textSecondary w-[56px] text-center">
            <Skeleton className="h-4 w-8 mx-auto" />
          </TableCell>
          <TableCell className="text-sm font-semibold text-gray-25">
            <Skeleton className="h-4 w-full max-w-[150px]" />
          </TableCell>
          <TableCell className="text-sm font-semibold text-gray-25">
            <Skeleton className="h-4 w-full max-w-[80px]" />
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </TableCell>
          <TableCell className="text-sm font-semibold text-textTertiary">
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
          <TableCell className="text-sm font-medium text-textTertiary">
            <Skeleton className="h-4 w-full max-w-[100px]" />
          </TableCell>
          <TableCell className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default DiscountCodesTableSkeleton;
