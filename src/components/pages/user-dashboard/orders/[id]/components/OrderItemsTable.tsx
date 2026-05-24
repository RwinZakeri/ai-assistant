import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import type { OrderItemDisplay } from '../types';
import { ORDER_ITEMS_TABLE_HEADERS, TABLE_CELL_CLASSES } from '../constants';

interface OrderItemsTableProps {
  items: OrderItemDisplay[];
}

export default function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25%]">
            {ORDER_ITEMS_TABLE_HEADERS.DEVICE_NAME}
          </TableHead>
          <TableHead className="w-[25%]">
            {ORDER_ITEMS_TABLE_HEADERS.QUANTITY}
          </TableHead>
          <TableHead className="w-[25%]">
            {ORDER_ITEMS_TABLE_HEADERS.UNIT_PRICE}
          </TableHead>
          <TableHead className="w-[25%]">
            {ORDER_ITEMS_TABLE_HEADERS.DISCOUNT}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell className={TABLE_CELL_CLASSES.PRIMARY_TEXT}>
              {item.deviceName}
            </TableCell>
            <TableCell className={TABLE_CELL_CLASSES.SECONDARY_TEXT}>
              {item.quantity}
            </TableCell>
            <TableCell className={TABLE_CELL_CLASSES.SECONDARY_TEXT}>
              {item.unitPrice}
            </TableCell>
            <TableCell className={TABLE_CELL_CLASSES.SECONDARY_TEXT}>
              {item.discount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
