'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { TableRow, TableCell } from '@/components/ui/table/table';

interface DeliveryTableSkeletonProps {
  rows?: number;
}

const DeliveryTableSkeleton = ({ rows = 5 }: DeliveryTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="text-textSecondary w-[56px]">
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell className="text-sm font-semibold text-gray-25 text-right">
            <Skeleton className="h-4 w-full max-w-[100px]" />
          </TableCell>
          <TableCell className="text-sm font-semibold text-gray-25 text-right">
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
          <TableCell className="text-sm font-semibold text-textTertiary text-right">
            <Skeleton className="h-4 w-full max-w-[100px]" />
          </TableCell>
          <TableCell className="w-[136px]">
            <div className="flex items-center gap-4 justify-center">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default DeliveryTableSkeleton;
