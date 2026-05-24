

import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table/table";

interface SpeakersTableSkeletonProps {
  rows?: number;
}

const SpeakersTableSkeleton = ({ rows = 5 }: SpeakersTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="w-[56px] px-3 py-2 text-center">
            <Skeleton className="h-4 w-6 mx-auto" />
          </TableCell>
          <TableCell className="px-3 py-2 w-1/4">
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
          <TableCell className="px-3 py-2 w-1/4">
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
          <TableCell className="px-3 py-2 w-1/4">
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
          <TableCell className="text-center flex items-center gap-12 px-3 py-2 w-1/4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-8 w-32 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default SpeakersTableSkeleton;
