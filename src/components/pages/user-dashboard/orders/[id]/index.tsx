'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { toast } from 'sonner';
import HeaderDashboard from '../../components/HeaderDashboard';
import OrderBuyerTable from './components/OrderBuyerTable';
import OrderItemsTable from './components/OrderItemsTable';
import OrderSummary from './components/OrderSummary';
import OrderDetailsSkeleton from './components/OrderDetailsSkeleton';
import {
  mapStatusToOrderState,
  transformToBuyerData,
  transformToOrderItems,
  transformToOrderSummary,
} from './utils';
import { ORDER_MESSAGES, ORDER_LABELS } from './constants';

interface OrderDetailsPageProps {
  orderId: string;
}

export default function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
  const orderIdNumber = parseInt(orderId, 10);
  const queryClient = useQueryClient();
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  const {
    data: orderDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQuery.orderDetail, orderIdNumber],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetorderdetailGet(
        orderIdNumber,
      ),
    enabled: !!orderIdNumber && !isNaN(orderIdNumber),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: 'preparing' | 'shipping' | 'delivered') =>
      AdminDashboardService.apiServicesAppAdmindashboardUpdateorderstatusPost(
        orderIdNumber,
        mapStatusToOrderState(status),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.orderDetail, orderIdNumber],
      });
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.allOrdersForAdmin],
      });
      toast.success(ORDER_MESSAGES.STATUS_UPDATE_SUCCESS);
      setIsStatusChanging(false);
    },
    onError: () => {
      toast.error(ORDER_MESSAGES.STATUS_UPDATE_ERROR);
      setIsStatusChanging(false);
    },
  });

  const handleStatusChange = (
    status: 'preparing' | 'shipping' | 'delivered',
  ) => {
    if (isStatusChanging || updateStatusMutation.isPending) {
      return;
    }
    setIsStatusChanging(true);
    updateStatusMutation.mutate(status);
  };

  if (isLoading) {
    return (
      <HeaderDashboard label={ORDER_LABELS.PAGE_TITLE}>
        <OrderDetailsSkeleton />
      </HeaderDashboard>
    );
  }

  if (error || !orderDetail) {
    return (
      <HeaderDashboard label={ORDER_LABELS.PAGE_TITLE}>
        <div className="flex items-center justify-center py-20">
          <p className="text-textSecondary">{ORDER_MESSAGES.ERROR}</p>
        </div>
      </HeaderDashboard>
    );
  }

  const buyerData = transformToBuyerData(orderDetail);
  const orderItems = transformToOrderItems(orderDetail.orderItems);
  const summaryData = transformToOrderSummary(orderDetail);

  return (
    <HeaderDashboard label={ORDER_LABELS.PAGE_TITLE}>
      <div className="flex flex-col gap-10">
        <OrderBuyerTable buyerData={buyerData} />
        <OrderItemsTable items={orderItems} />
        <OrderSummary
          disabled={isStatusChanging || updateStatusMutation.isPending}
          orderNumber={summaryData.orderNumber}
          shippingDate={summaryData.shippingDate}
          status={summaryData.status}
          totalAmount={summaryData.totalAmount}
          onStatusChange={handleStatusChange}
        />
      </div>
    </HeaderDashboard>
  );
}
