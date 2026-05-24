import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { Skeleton } from '@/components/ui/skeleton';

interface OrdersTableSkeletonProps {
  rows?: number;
}

export default function OrdersTableSkeleton({
  rows = 5,
}: OrdersTableSkeletonProps) {
  return (
    <div className="flex flex-col">
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>شماره سفارش</TableHead>
              <TableHead>نام و مدل دستگاه</TableHead>
              <TableHead>تعداد</TableHead>
              <TableHead>مبلغ پرداختی</TableHead>
              <TableHead>روز ارسال</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>{}</TableHead>
              <TableHead>{}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
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
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-32 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-32 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
