export type OrderStatus = 'preparing' | 'shipping' | 'delivered';

export interface BuyerData {
  buyer: string;
  nationalId: string;
  phoneNumber: string;
  address: string;
  postalCode: string;
}

export interface OrderItemDisplay {
  deviceName: string;
  quantity: number;
  unitPrice: string;
  discount: string;
}

export interface OrderSummaryData {
  orderNumber: string;
  shippingDate: string;
  totalAmount: string;
  status: OrderStatus;
}
