'use client';

import { UserDashboardService } from '@/apis';
import { TableSkeleton } from '@/components/ui/table';
import ReactQuery from '@/configs/react_query_keys';
import { useQuery } from '@tanstack/react-query';
import HeaderDashboard from '../../components/HeaderDashboard';
import HistoryProductTable from '../components/historyDetailTable/HistoryProductTable';
import HistorySummaryTable from '../components/historyDetailTable/HistorySummaryTable';
import HistoryUserTable from '../components/historyDetailTable/HistoryUserTable';

type HistorySingleProps = {
  id: string;
};

const HistorySingle = ({ id }: HistorySingleProps) => {
  const orderId = parseInt(id, 10);

  const {
    data: orderDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQuery.orderDetail, orderId],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetorderdetailbyidGet(
        orderId,
      ),
    enabled: !!orderId && !isNaN(orderId),
  });

  return (
    <HeaderDashboard label="جزئیات سفارش">
      {isLoading ? (
        <div className="flex flex-col gap-10">
          <TableSkeleton columns={5} rows={1} />
          <TableSkeleton columns={4} rows={3} />
          <div className="py-8 px-10 border border-gray-800 rounded-xl">
            <div className="h-6 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      ) : error || !orderDetail ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-textSecondary">خطا در بارگذاری جزئیات سفارش</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <HistoryUserTable
            address={orderDetail.address}
            customerName={orderDetail.customerName}
            nationalCode={orderDetail.nationalCode}
            phoneNumber={orderDetail.phoneNumber}
            postalCode={orderDetail.postalCode}
          />
          <HistoryProductTable orderItems={orderDetail.orderItems} />
          <HistorySummaryTable
            orderNumber={orderDetail.orderNo}
            orderState={orderDetail.orderState}
            sendDate={orderDetail.sendingDate}
            totalAmount={orderDetail.totalPayable}
          />
        </div>
      )}
    </HeaderDashboard>
  );
};

export default HistorySingle;
