'use client';

import type { GetAllOrdersForAdminOutput } from '@/apis/models/GetAllOrdersForAdminOutput';
import { ArrowLeftOrderIcon } from '@/assets/images/svg/ArrowLeftOrder';
import { Download02Icon } from '@/assets/images/svg/Download02';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination/index';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { formatDate } from '@/utils/formatDate';
import numberSeprator from '@/utils/numberSeprator';
import { getStatusConfig } from '../utils';

interface OrdersTableProps {
  orders: GetAllOrdersForAdminOutput[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetails: (orderId: number) => void;
  onDownloadInvoice: (orderId: number) => void;
  isDownloadingInvoice?: boolean;
}

export default function OrdersTable({
  orders,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onDownloadInvoice,
  isDownloadingInvoice = false,
}: OrdersTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

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
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center text-textSecondary"
                  colSpan={9}
                >
                  سفارشی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              orders.map(order => {
                const status = getStatusConfig(order.status);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="text-xs-medium text-textSecondary">
                      {order.rowNumber ?? 'ثبت نشده'}
                    </TableCell>
                    <TableCell className="text-sm-demibold text-textSecondary">
                      {order.orderNumber ?? 'ثبت نشده'}
                    </TableCell>
                    <TableCell className="text-gray-25">
                      {order.deviceNameAndModel ?? 'ثبت نشده'}
                    </TableCell>
                    <TableCell className="text-sm-medium text-textSecondary">
                      {order.quantity ?? 0}
                    </TableCell>
                    <TableCell className="text-sm-medium text-textSecondary">
                      {order.paidAmount
                        ? `${numberSeprator(String(order.paidAmount))} تومان`
                        : 'ثبت نشده'}
                    </TableCell>
                    <TableCell className="text-sm-medium text-textSecondary">
                      {order.sendingDate
                        ? formatDate(order.sendingDate)
                        : 'ثبت نشده'}
                    </TableCell>
                    <TableCell>
                      <Badge size="sm" variant={status.variant}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="flex items-center gap-2"
                        // disabled={isDownloadingInvoice}
                        // loading={isDownloadingInvoice}
                        size="sm"
                        variant="tertiaryColor"
                        onClick={() => order.id && onDownloadInvoice(order.id)}
                      >
                        <Download02Icon />
                        دانلود فاکتور
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="flex items-center gap-2"
                        size="sm"
                        variant="linkColor"
                        onClick={() => order.id && onViewDetails(order.id)}
                      >
                        مشاهده جزئیات
                        <ArrowLeftOrderIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {totalCount > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell className="px-6 py-4" colSpan={9}>
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    pageSizeOptions={[10, 20, 50]}
                    totalItems={totalCount}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
