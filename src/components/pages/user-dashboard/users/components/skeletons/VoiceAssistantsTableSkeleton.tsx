
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table/table";

interface VoiceAssistantsTableSkeletonProps {
  rows?: number;
}

const VoiceAssistantsTableSkeleton = ({
  rows = 5,
}: VoiceAssistantsTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="text-center px-3 py-2">
            <Skeleton className="h-4 w-6 mx-auto" />
          </TableCell>
          <TableCell className="px-3 py-2">
            <Skeleton className="h-4 w-full max-w-[200px]" />
          </TableCell>
          <TableCell className="px-3 py-2">
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>
          <TableCell className="px-3 py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-8 rounded" />
              <Skeleton className="h-2 w-[200px] rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default VoiceAssistantsTableSkeleton;
