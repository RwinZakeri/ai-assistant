'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface OrderSummaryProps {
  orderNumber: string;
  shippingDate: string;
  totalAmount: string;
  status: 'preparing' | 'shipping' | 'delivered';
  onStatusChange?: (status: 'preparing' | 'shipping' | 'delivered') => void;
  disabled?: boolean;
}

export default function OrderSummary({
  orderNumber,
  shippingDate,
  totalAmount,
  status,
  onStatusChange,
  disabled = false,
}: OrderSummaryProps) {
  const handleStatusChange = (value: string) => {
    if (disabled) {
      return;
    }
    onStatusChange?.(value as 'preparing' | 'shipping' | 'delivered');
  };

  return (
    <div className="py-8 px-10 flex flex-col gap-6 border border-gray-800 rounded-xl">
      <div className="flex flex-row items-center gap-10 ">
        <div className="flex items-center gap-4">
          <p className="text-textSecondary text-xs">شماره سفارش</p>
          <p className="text-md-demibold text-gray-25">{orderNumber}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-textSecondary text-xs">روز ارسال</p>
          <p className="text-md-demibold text-gray-25">{shippingDate}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-textSecondary text-xs">مبلغ کل (تومان)</p>
          <p className="text-xl-bold text-gray-25">{totalAmount}</p>
        </div>
      </div>
      <div className="flex  items-center gap-4">
        <p className="text-textSecondary text-xs">وضعیت</p>
        <RadioGroup
          className="flex items-center gap-5"
          disabled={disabled}
          value={status}
          onValueChange={handleStatusChange}
        >
          <div className="flex flex-row-reverse items-center gap-2">
            <RadioGroupItem
              disabled={disabled}
              id="delivered"
              value="delivered"
            />
            <Label
              htmlFor="delivered"
              className={`text-xs-demibold text-textTertiary ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              تحویل شده
            </Label>
          </div>
          <div className="flex flex-row-reverse items-center gap-2">
            <RadioGroupItem
              disabled={disabled}
              id="shipping"
              value="shipping"
            />
            <Label
              htmlFor="shipping"
              className={`text-xs-demibold text-textTertiary ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              در حال ارسال
            </Label>
          </div>
          <div className="flex flex-row-reverse items-center gap-2">
            <RadioGroupItem
              disabled={disabled}
              id="preparing"
              value="preparing"
            />
            <Label
              htmlFor="preparing"
              className={`text-xs-demibold text-textTertiary ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              در حال آماده سازی
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
