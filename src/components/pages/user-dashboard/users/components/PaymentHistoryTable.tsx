'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { Pagination } from '@/components/ui/pagination/index';
import { Speaker01Icon } from '@/assets/images/svg/Speaker01';
import { Modem02Icon } from '@/assets/images/svg/Modem02';
import { useQuery } from '@tanstack/react-query';
import { AdminDashboardService } from '@/apis';
import type { GetUserPaymentOutput } from '@/apis';
import PaymentHistoryTableSkeleton from './skeletons/PaymentHistoryTableSkeleton';
import { ProductType as ApiProductType } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { formatDate } from '@/utils/formatDate';
import { parseUserId, calculateTotalPages } from '../utils';
import { useUserProfile } from './UserProfileContext';

const PRODUCT_TYPE_ICON_MAP: Partial<
  Record<ApiProductType, React.ComponentType>
> = {
  [ApiProductType._3]: Speaker01Icon,
  [ApiProductType._4]: Modem02Icon,
};

const getProductIconComponent = (productType?: ApiProductType | null) => {
  if (productType === undefined || productType === null) {
    return null;
  }
  const IconComponent = PRODUCT_TYPE_ICON_MAP[productType];
  if (!IconComponent) {
    return null;
  }
  return IconComponent;
};

const PaymentHistoryTable = () => {
  const { userId } = useUserProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const userIdNumber = parseUserId(userId);

  const { data, isLoading } = useQuery<{
    items: GetUserPaymentOutput[];
    totalCount: number;
  }>({
    queryKey: [ReactQuery.userPayments, userIdNumber, currentPage, pageSize],
    queryFn: async () => {
      if (!userIdNumber || Number.isNaN(userIdNumber)) {
        return { items: [] as GetUserPaymentOutput[], totalCount: 0 };
      }

      const skipCount = (currentPage - 1) * pageSize;
      const response =
        await AdminDashboardService.apiServicesAppAdmindashboardGetuserpaymentsGet(
          userIdNumber,
          undefined,
          skipCount,
          pageSize,
        );

      return {
        items: response.items ?? [],
        totalCount: response.totalCount ?? 0,
      };
    },
    enabled: !!userIdNumber && !Number.isNaN(userIdNumber),
  });

  const payments = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = calculateTotalPages(totalCount, pageSize);

  const paginatedData = useMemo(() => payments, [payments]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>موضوع</TableHead>
              <TableHead>مبلغ</TableHead>
              <TableHead>تاریخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <PaymentHistoryTableSkeleton rows={5} />
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center text-textSecondary"
                  colSpan={3}
                >
                  پرداختی انجام نشده است
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map(
                (payment: GetUserPaymentOutput, index: number) => {
                  const IconComponent = getProductIconComponent(
                    payment.productType ?? undefined,
                  );

                  const isAssistant = payment.productType === ApiProductType._4;
                  const iconBackgroundClass = isAssistant
                    ? 'bg-primary-800 border-primary-800'
                    : 'bg-gray-800 border-gray-800';

                  return (
                    <TableRow key={index}>
                      <TableCell className="text-sm font-semibold">
                        <div className="flex items-center gap-2">
                          {IconComponent && (
                            <div
                              className={`p-2 rounded-full flex items-center justify-center border ${iconBackgroundClass}`}
                            >
                              <IconComponent />
                            </div>
                          )}
                          {payment.subject ?? '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-textTertiary text-sm font-medium ">
                        {payment.amount?.toLocaleString('fa-IR') ?? '-'}ریال
                      </TableCell>
                      <TableCell className="text-textSecondary">
                        {formatDate(payment.paymentDate) || '-'}
                      </TableCell>
                    </TableRow>
                  );
                },
              )
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <div className="border-t border-gray-800 px-6 py-4">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 30, 50]}
            totalItems={payments.length}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryTable;
