'use client';

import type { ComponentProps } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { useRouter } from 'next/navigation';
import { TicketStatus } from '../type';
import type { TicketTableProps } from '../type';

const statusLabel: Record<TicketStatus, string> = {
  [TicketStatus.Pending]: 'در انتظار بررسی',
  [TicketStatus.Checking]: 'در حال انجام',
  [TicketStatus.Done]: 'بررسی شده',
};

const statusVariant: Record<
  TicketStatus,
  ComponentProps<typeof Badge>['variant']
> = {
  [TicketStatus.Pending]: 'primary',
  [TicketStatus.Checking]: 'gray',
  [TicketStatus.Done]: 'success',
};

const TicketTable = ({ tickets }: TicketTableProps) => {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>عنوان</TableHead>
          <TableHead>موضوع</TableHead>
          <TableHead>تاریخ</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead className="text-center">مشاهده</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.length === 0 ? (
          <TableRow>
            <TableCell className="text-center text-textSecondary" colSpan={6}>
              هنوز تیکتی ایجاد نشده است.
            </TableCell>
          </TableRow>
        ) : (
          tickets.map(ticket => (
            <TableRow key={ticket.id}>
              <TableCell className="font-semibold text-white">
                {ticket.ticketNumber}
              </TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell className="text-textSecondary">
                {ticket.date}
              </TableCell>
              <TableCell>
                <Badge size="sm" variant={statusVariant[ticket.status]}>
                  {statusLabel[ticket.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  aria-label={`مشاهده تیکت ${ticket.ticketNumber}`}
                  className="w-full sm:w-auto text-primary-300 hover:text-primary-200 cursor-pointer"
                  size="sm"
                  type="button"
                  variant="linkColor"
                  onClick={() => router.push(`/dashboard/support/${ticket.id}`)}
                >
                  مشاهده
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TicketTable;
