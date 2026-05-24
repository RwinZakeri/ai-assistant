import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { GetOrderItemDetailByIdOutput } from '@/apis/models/GetOrderItemDetailByIdOutput';
import numberSeprator from '@/utils/numberSeprator';

interface HistoryProductTableProps {
  orderItems?: Array<GetOrderItemDetailByIdOutput> | null;
}

const HistoryProductTable = ({ orderItems }: HistoryProductTableProps) => {
  if (!orderItems || orderItems.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام و مدل دستگاه</TableHead>
            <TableHead>تعداد</TableHead>
            <TableHead>مبلغ واحد(تومان)</TableHead>
            <TableHead>تخفیف (تومان)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center text-textSecondary" colSpan={4}>
              محصولی یافت نشد
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>نام و مدل دستگاه</TableHead>
          <TableHead>تعداد</TableHead>
          <TableHead>مبلغ واحد(تومان)</TableHead>
          <TableHead>تخفیف (تومان)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderItems.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="text-sm font-semibold text-gray-25">
              {item.productName || '-'}
            </TableCell>
            <TableCell className="text-sm text-textSecondary">
              {item.quantity ?? '-'}
            </TableCell>
            <TableCell className="text-sm text-textSecondary">
              {item.unitPrice ? numberSeprator(item.unitPrice.toString()) : '-'}
            </TableCell>
            <TableCell className="text-sm text-textSecondary">
              {item.discountAmount
                ? numberSeprator(item.discountAmount.toString())
                : '0'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HistoryProductTable;
