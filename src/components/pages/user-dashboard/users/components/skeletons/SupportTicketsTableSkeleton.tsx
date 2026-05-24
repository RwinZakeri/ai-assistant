
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table/table";

interface SupportTicketsTableSkeletonProps {
  rows?: number;
}

const SupportTicketsTableSkeleton = ({
  rows = 5,
}: SupportTicketsTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="font-semibold text-white">
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full max-w-[150px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
          <TableCell className="text-textSecondary">
            <Skeleton className="h-4 w-full max-w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-8 w-20 mx-auto rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default SupportTicketsTableSkeleton;
