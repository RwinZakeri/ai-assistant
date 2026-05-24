import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import type { BuyerData } from '../types';
import { BUYER_TABLE_HEADERS, TABLE_CELL_CLASSES } from '../constants';

interface OrderBuyerTableProps {
  buyerData: BuyerData;
}

export default function OrderBuyerTable({ buyerData }: OrderBuyerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{BUYER_TABLE_HEADERS.BUYER}</TableHead>
          <TableHead>{BUYER_TABLE_HEADERS.NATIONAL_ID}</TableHead>
          <TableHead>{BUYER_TABLE_HEADERS.PHONE_NUMBER}</TableHead>
          <TableHead>{BUYER_TABLE_HEADERS.ADDRESS}</TableHead>
          <TableHead>{BUYER_TABLE_HEADERS.POSTAL_CODE}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className={TABLE_CELL_CLASSES.PRIMARY_TEXT}>
            {buyerData.buyer}
          </TableCell>
          <TableCell className={TABLE_CELL_CLASSES.SECONDARY_TEXT}>
            {buyerData.nationalId}
          </TableCell>
          <TableCell className={TABLE_CELL_CLASSES.SECONDARY_TEXT}>
            {buyerData.phoneNumber}
          </TableCell>
          <TableCell className={TABLE_CELL_CLASSES.SECONDARY_TEXT}>
            {buyerData.address}
          </TableCell>
          <TableCell className={TABLE_CELL_CLASSES.SECONDARY_TEXT}>
            {buyerData.postalCode}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
