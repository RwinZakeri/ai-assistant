

import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table/table";

interface PaymentHistoryTableSkeletonProps {
  rows?: number;
}

const PaymentHistoryTableSkeleton = ({
  rows = 5,
}: PaymentHistoryTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="text-sm font-semibold">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-full max-w-[150px]" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full max-w-[100px]" />
          </TableCell>
          <TableCell className="text-textSecondary">
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default PaymentHistoryTableSkeleton;
