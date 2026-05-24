import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>خریدار</TableHead>
            <TableHead>کد ملی</TableHead>
            <TableHead>شماره تلفن</TableHead>
            <TableHead>آدرس</TableHead>
            <TableHead>کد پستی</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-64" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">نام و مدل دستگاه</TableHead>
            <TableHead className="w-[25%]">تعداد</TableHead>
            <TableHead className="w-[25%]">مبلغ واحد (تومان)</TableHead>
            <TableHead className="w-[25%]">تخفیف (تومان)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="py-8 px-10 flex flex-col gap-6 border border-gray-800 rounded-xl">
        <div className="flex flex-row items-center gap-10">
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-12" />
          <div className="flex items-center gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-row-reverse items-center gap-2"
              >
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
