import { NetworkIcon } from '@/assets/images/svg/Network';
import { SmartSpeakerIcon } from '@/assets/images/svg/SmartSpeaker';
import { Badge } from '@/components/ui/badge';
import { TableBody, TableCell, TableSkeleton } from '@/components/ui/table';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { ProductTypeObj } from '@/enums/enum';
import { formatDate } from '@/utils/formatDate';
import numberSeprator from '@/utils/numberSeprator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PaymentHistoryItem {
  id?: number;
  type?: number;
  price?: number;
  date?: string | null;
  category?: string | string[] | null;
  subject?: string | null;
  [key: string]: any;
}

interface OrderTableProps {
  data: PaymentHistoryItem[];
  isLoading: boolean;
}

const OrderTable = ({ data, isLoading }: OrderTableProps) => {
  if (isLoading) {
    return (
      <div className="py-6">
        <TableSkeleton columns={5} rows={5} />
      </div>
    );
  }

  return (
    <div className="py-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>موضوع</TableHead>
            <TableHead>مبلغ</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>دسته‌بندی</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((payment, index) => {
              const Icon = payment.type === 3 ? SmartSpeakerIcon : NetworkIcon;
              const paymentType = payment.type || 0;
              const title =
                payment.subject ||
                ProductTypeObj[paymentType as keyof typeof ProductTypeObj] ||
                'نامشخص';
              const amount = payment.price
                ? `${numberSeprator(payment.price.toString())} ریال`
                : '0 ریال';
              const date = formatDate(payment.date);
              const category = Array.isArray(payment.category)
                ? payment.category.join(', ')
                : payment.category || 'عمومی';
              const paymentId = payment.id || index;

              return (
                <TableRow
                  key={paymentId || `${payment.type}-${payment.date}-${index}`}
                >
                  <TableCell className="text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Icon />
                      {title}
                    </div>
                  </TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell className="text-textSecondary">{date}</TableCell>
                  <TableCell>
                    <Badge variant="primary">{category}</Badge>
                  </TableCell>
                  <TableCell className="text-primary-300">
                    <Link
                      className="flex items-center justify-center gap-1"
                      href={`/dashboard/history/${payment.orderId}`}
                    >
                      مشاهده جزئیات
                      <ArrowLeft className="text-primary-700" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell className="text-center" colSpan={5}>
                <p className="text-sm font-medium text-textSecondary">
                  پرداختی انجام نشده است
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
