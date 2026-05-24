'use client';

import type { ComponentProps } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TicketStatus } from '@/enums/enum';
import SupportTicketsTableSkeleton from './skeletons/SupportTicketsTableSkeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import type { SupportTicket } from './types';
import { convertToSupportTicket } from '../utils';
import { useUserProfile } from './UserProfileContext';

const statusLabel: Record<TicketStatus, string> = {
  [TicketStatus.Pending]: 'در انتظار بررسی',
  [TicketStatus.Checking]: 'در حال بررسی',
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

const SupportTicketsTable = () => {
  const { userId } = useUserProfile();
  const router = useRouter();
  const numericUserId = Number(userId) || 0;

  const {
    data: supportTicketsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQuery.userTicketsForAdmin, numericUserId],
    enabled: numericUserId > 0,
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetalluserticketsGet(
        numericUserId,
      ),
  });

  const tickets: SupportTicket[] = supportTicketsData
    ? supportTicketsData.map((ticket, index) =>
        convertToSupportTicket(ticket, index),
      )
    : [];

  if (error) {
    return (
      <div className="border border-gray-800 rounded-xl p-8 text-center">
        <p className="text-destructive">
          خطا در بارگذاری تیکت‌ها. لطفاً دوباره تلاش کنید.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>اکانت</TableHead>
          <TableHead>عنوان</TableHead>
          <TableHead>موضوع</TableHead>
          <TableHead>تاریخ</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead className="text-center">مشاهده</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <SupportTicketsTableSkeleton rows={5} />
        ) : tickets.length === 0 ? (
          <TableRow>
            <TableCell className="text-center text-textSecondary" colSpan={7}>
              هنوز تیکتی ایجاد نشده است.
            </TableCell>
          </TableRow>
        ) : (
          tickets.map(ticket => (
            <TableRow key={ticket.id}>
              <TableCell className="font-semibold text-white">
                {ticket.ticketNumber}
              </TableCell>
              <TableCell className="text-textTertiary text-sm font-medium ">
                {ticket.account}
              </TableCell>
              <TableCell className="text-gray-25 text-sm-demibold">
                {ticket.title}
              </TableCell>
              <TableCell className="text-gray-25 text-sm-demibold">
                {ticket.subject}
              </TableCell>
              <TableCell className="text-textSecondary">
                {ticket.date}
              </TableCell>
              <TableCell>
                <Badge size="md" variant={statusVariant[ticket.status]}>
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

export default SupportTicketsTable;
