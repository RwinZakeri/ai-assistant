import { OrderState } from '@/apis/models/OrderState';

export const STATUS_OPTIONS = [
  { value: String(OrderState._1), label: 'در حال آماده سازی' },
  { value: String(OrderState._2), label: 'در حال ارسال' },
  { value: String(OrderState._3), label: 'تحویل شده' },
];
