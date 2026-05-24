import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table/table";

interface UserTableSkeletonProps {
  rows?: number;
}

const UserTableSkeleton = ({ rows = 5 }: UserTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="text-textSecondary w-[56px]">
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell className="text-gray-25">
            <Skeleton className="h-4 w-full max-w-[150px]" />
          </TableCell>
          <TableCell className="text-gray-25">
            <Skeleton className="h-4 w-full max-w-[200px]" />
          </TableCell>
          <TableCell className="text-textSecondary">
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full max-w-[100px]" />
          </TableCell>
          <TableCell className="text-center w-[172px]">
            <Skeleton className="h-8 w-32 mx-auto rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default UserTableSkeleton;
