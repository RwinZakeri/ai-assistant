'use client';

import { UserDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { useQuery } from '@tanstack/react-query';

import type { GetUserTicketsOutput, TicketStatus } from '@/apis';
import { TableSkeleton } from '@/components/ui/table';
import type { Ticket } from '../../type';
import {
  API_TICKET_STATUS_MAP,
  TicketStatus as TicketStatusType,
} from '../../type';
import TicketTable from '../TicketTable';

const mapTicketStatus = (status?: TicketStatus): TicketStatusType => {
  if (status === undefined || status === null) {
    return TicketStatusType.Pending;
  }
  // Convert enum to number for mapping
  const statusNumber = typeof status === 'number' ? status : Number(status);
  return API_TICKET_STATUS_MAP[statusNumber] ?? TicketStatusType.Pending;
};

const formatDate = (dateString?: string | null): string => {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
    return persianDate;
  } catch {
    return dateString;
  }
};

const convertToTicket = (
  ticket: GetUserTicketsOutput,
  index: number,
): Ticket => {
  return {
    id: ticket.chatId || String(index),
    ticketNumber: String(index + 1),
    title: ticket.title || '',
    subject: ticket.category || '',
    date: formatDate(ticket.date),
    status: mapTicketStatus(ticket.ticketStatus),
  };
};

const UserSupportPage = () => {
  const {
    data: ticketsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQuery.userTickets],
    queryFn: () => {
      return UserDashboardService.apiServicesAppUserdashboardGetuserticketsGet();
    },
  });

  const tickets: Ticket[] = ticketsData
    ? ticketsData.map((ticket, index) => convertToTicket(ticket, index))
    : [];

  if (isLoading) {
    return (
      <section className="flex flex-col gap-8">
        <TableSkeleton columns={6} rows={5} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-8">
        <div className="flex justify-center items-center py-12">
          <p className="text-xl-regular text-error-400">
            خطا در بارگذاری تیکت‌ها. لطفاً دوباره تلاش کنید.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {tickets.length === 0 ? (
          <div className="text-center text-textSecondary py-8">
            هیچ تیکتی یافت نشد.
          </div>
        ) : (
          <TicketTable tickets={tickets} />
        )}
      </div>
    </section>
  );
};

export default UserSupportPage;
