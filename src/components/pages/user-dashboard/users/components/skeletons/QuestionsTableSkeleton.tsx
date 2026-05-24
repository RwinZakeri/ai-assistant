
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table/table";

interface QuestionsTableSkeletonProps {
  rows?: number;
}

const QuestionsTableSkeleton = ({ rows = 5 }: QuestionsTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="font-semibold text-white">
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full max-w-[150px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-full max-w-[200px]" />
              <Skeleton className="h-4 w-full max-w-[180px]" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-full max-w-[200px]" />
              <Skeleton className="h-4 w-full max-w-[180px]" />
            </div>
          </TableCell>
          <TableCell className="text-textSecondary">
            <Skeleton className="h-4 w-full max-w-[100px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default QuestionsTableSkeleton;
