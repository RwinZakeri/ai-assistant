import { OrderState } from '@/apis/models/OrderState';
import type { GetOrderDetailOutput } from '@/apis/models/GetOrderDetailOutput';
import type { SingleOrderItem } from '@/apis/models/SingleOrderItem';
import numberSeprator from '@/utils/numberSeprator';
import { formatDate } from '@/utils/formatDate';
import type {
  BuyerData,
  OrderItemDisplay,
  OrderSummaryData,
  OrderStatus,
} from './types';

const DEFAULT_VALUE = '-';
const DEFAULT_NUMBER = '0';

export const mapOrderStateToStatus = (state?: OrderState): OrderStatus => {
  switch (state) {
    case OrderState._1:
      return 'preparing';
    case OrderState._2:
      return 'shipping';
    case OrderState._3:
      return 'delivered';
    default:
      return 'preparing';
  }
};

export const mapStatusToOrderState = (status: OrderStatus): OrderState => {
  switch (status) {
    case 'preparing':
      return OrderState._1;
    case 'shipping':
      return OrderState._2;
    case 'delivered':
      return OrderState._3;
  }
};

export const transformToBuyerData = (
  orderDetail: GetOrderDetailOutput,
): BuyerData => ({
  buyer: orderDetail.customerName || DEFAULT_VALUE,
  nationalId: orderDetail.nationalCode || DEFAULT_VALUE,
  phoneNumber: orderDetail.phoneNumber || DEFAULT_VALUE,
  address: orderDetail.address || DEFAULT_VALUE,
  postalCode: orderDetail.postalCode || DEFAULT_VALUE,
});

export const transformToOrderItems = (
  items: SingleOrderItem[] | null | undefined,
): OrderItemDisplay[] => {
  if (!items || items.length === 0) {
    return [];
  }

  return items.map(item => ({
    deviceName: item.deviceName || DEFAULT_VALUE,
    quantity: item.quantity ?? 0,
    unitPrice: item.unitAmount
      ? numberSeprator(String(item.unitAmount))
      : DEFAULT_NUMBER,
    discount: item.discountedAmout
      ? numberSeprator(String(item.discountedAmout))
      : DEFAULT_NUMBER,
  }));
};

export const transformToOrderSummary = (
  orderDetail: GetOrderDetailOutput,
): OrderSummaryData => ({
  orderNumber: orderDetail.orderNumber
    ? numberSeprator(String(orderDetail.orderNumber))
    : DEFAULT_VALUE,
  shippingDate: orderDetail.deliveringDate
    ? formatDate(orderDetail.deliveringDate)
    : DEFAULT_VALUE,
  totalAmount: orderDetail.totalAmount
    ? numberSeprator(String(orderDetail.totalAmount))
    : DEFAULT_NUMBER,
  status: mapOrderStateToStatus(orderDetail.status),
});
