import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';

interface HistoryUserTableProps {
  customerName?: string | null;
  nationalCode?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  postalCode?: string | null;
}

const HistoryUserTable = ({
  customerName,
  nationalCode,
  phoneNumber,
  address,
  postalCode,
}: HistoryUserTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>خریدار</TableHead>
          <TableHead>شماره تلفن</TableHead>
          <TableHead>آدرس</TableHead>
          <TableHead>کدپستی</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-sm font-semibold text-gray-25">
            {customerName || '-'}
          </TableCell>

          <TableCell className="text-sm text-textTertiary">
            {phoneNumber || '-'}
          </TableCell>
          <TableCell className="text-sm text-textTertiary">
            {address || '-'}
          </TableCell>
          <TableCell className="text-sm text-textTertiary">
            {postalCode || '-'}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default HistoryUserTable;
