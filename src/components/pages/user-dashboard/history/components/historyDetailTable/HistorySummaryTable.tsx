import type { badgeVariants } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';
import type { OrderState } from '@/apis/models/OrderState';
import { formatPersianDate } from '@/utils/formatPersianDate';
import numberSeprator from '@/utils/numberSeprator';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

interface HistorySummaryTableProps {
  orderState?: OrderState;
  orderNumber?: string | null;
  sendDate?: string;
  totalAmount?: number;
}

export const getOrderStatusLabel = (state?: OrderState): string => {
  switch (state) {
    case 0:
      return 'در انتظار پرداخت';
    case 1:
      return 'در حال پردازش';
    case 2:
      return 'در حال ارسال';
    case 3:
      return 'تحویل شده';
    default:
      return 'نامشخص';
  }
};

export const getOrderStatusVariant = (state?: OrderState): BadgeVariant => {
  switch (state) {
    case 0:
      return 'warning';
    case 1:
      return 'warning';
    case 2:
      return 'warning';
    case 3:
      return 'success';
    default:
      return 'gray';
  }
};

const HistorySummaryTable = ({
  orderState,
  orderNumber,
  sendDate,
  totalAmount,
}: HistorySummaryTableProps) => {
  const statusLabel = getOrderStatusLabel(orderState);
  const statusVariant = getOrderStatusVariant(orderState);
  const formattedDate = sendDate ? formatPersianDate(sendDate) : '-';
  const formattedAmount = totalAmount
    ? numberSeprator(totalAmount.toString())
    : '0';

  return (
    <div className="py-8 px-10 flex items-center gap-10 border border-gray-800 rounded-xl">
      <div className="flex items-center gap-2">
        <p className="text-textSecondary text-xs">وضعیت</p>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-textSecondary text-xs">شماره سفارش</p>
        <p className="text-xl font-bold text-gray-25">{orderNumber || '-'}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-textSecondary text-xs">روز ارسال</p>
        <p className="text-sm font-bold text-gray-25">{formattedDate}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-textSecondary text-xs">مبلغ کل (تومان)</p>
        <p className="text-xl font-bold text-gray-25">{formattedAmount}</p>
      </div>
    </div>
  );
};

export default HistorySummaryTable;
