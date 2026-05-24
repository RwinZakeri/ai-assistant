'use client';

import type { GetAllTicketsOutput } from '@/apis';
import { AdminDashboardService } from '@/apis';
import { ArrowLeftAuthIcon } from '@/assets/images/svg/ArrowLeftAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/calendar';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { Pagination } from '@/components/ui/pagination/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import ReactQuery from '@/configs/react_query_keys';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/formatDate';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { paymentDateType } from '../../../payment-history/type';
import {
  API_TICKET_STATUS_MAP,
  TICKET_STATUS_LABELS,
  TicketStatus,
  ticketStatusOptions,
} from '../../type';

const AdminSupportPage = () => {
  const router = useRouter();
  const [accountSearch, setAccountSearch] = useState('');
  const debouncedAccountSearch = useDebounce(accountSearch, 500);

  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const [date, setDate] = useState<paymentDateType>({
    from: null,
    to: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedAccountSearch]);

  const { data, isLoading } = useQuery({
    queryKey: [
      ReactQuery.GetAllTicketsForAdmin,
      currentPage,
      pageSize,
      debouncedAccountSearch,
      statusFilter,
      categoryFilter,
      date.from,
      date.to,
    ],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallticketsforadminPost(
        {
          skipCount: (currentPage - 1) * pageSize,
          maxResultCount: pageSize,
          sorting: null,
          accountNameOrTitle: debouncedAccountSearch || undefined,
          statusFilter:
            statusFilter && statusFilter !== ''
              ? (Number(statusFilter) as any)
              : undefined,
          ticketCategoryId:
            categoryFilter && categoryFilter !== ''
              ? Number(categoryFilter)
              : undefined,
          start: date.from || undefined,
          end: date.to || undefined,
        },
      ),
    placeholderData: keepPreviousData,
  });

  const { data: category } = useQuery({
    queryKey: [ReactQuery.GetTicketCategoriesForAdmin],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetticketcategoriesforadminGet(),
  });

  const { tickets, totalCount, totalPages } = useMemo(() => {
    const ticketsList: GetAllTicketsOutput[] = data?.items ?? [];
    const count = data?.totalCount ?? 0;
    const pages = Math.ceil(count / pageSize);
    return {
      tickets: ticketsList,
      totalCount: count,
      totalPages: pages,
    };
  }, [data?.items, data?.totalCount, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-2">
        <DropdownInput
          className="w-full"
          options={[]}
          placeholder="جستجو نام اکانت"
          searchPlaceholder="جستجو نام اکانت"
          type="search"
          value={accountSearch}
          onInputChange={value => {
            setAccountSearch(value.trim());
          }}
        />

        <DropdownInput
          className="w-full"
          placeholder="انتخاب وضعیت"
          value={statusFilter || 'all'}
          options={[
            { label: 'همه', value: 'all' },
            ...ticketStatusOptions.filter(opt => opt.value !== ''),
          ]}
          onValueChange={value => {
            if (value === 'all') {
              setStatusFilter(undefined);
            } else {
              setStatusFilter(typeof value === 'string' ? value : undefined);
            }
            setCurrentPage(1);
          }}
        />

        <DropdownInput
          className="w-full"
          placeholder="انتخاب موضوع"
          value={categoryFilter || 'all'}
          options={[
            { label: 'همه', value: 'all' },
            ...(category
              ?.filter(item => item.id != null)
              .map(item => ({
                value: String(item.id),
                label: item.title ?? '',
              })) ?? []),
          ]}
          onValueChange={value => {
            if (value === 'all') {
              setCategoryFilter(undefined);
            } else {
              setCategoryFilter(typeof value === 'string' ? value : undefined);
            }
            setCurrentPage(1);
          }}
        />

        <DateRangePicker
          className="w-full"
          onDateRangeChange={range => {
            setDate({
              from: range?.from?.toISOString() ?? null,
              to: range?.to?.toISOString() ?? null,
            });
            setCurrentPage(1);
          }}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>اکانت</TableHead>
            <TableHead>عنوان</TableHead>
            <TableHead>موضوع</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="text-center" colSpan={7}>
                در حال بارگذاری...
              </TableCell>
            </TableRow>
          ) : tickets.length === 0 ? (
            <TableRow>
              <TableCell className="text-center text-textSecondary" colSpan={7}>
                تیکتی یافت نشد
              </TableCell>
            </TableRow>
          ) : (
            <>
              {tickets.map((ticket, index) => (
                <TableRow key={ticket.chatId ?? index}>
                  <TableCell>
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>{ticket.accountName ?? '-'}</TableCell>
                  <TableCell>{ticket.title ?? '-'}</TableCell>
                  <TableCell>{ticket.category ?? '-'}</TableCell>
                  <TableCell className="text-textSecondary text-sm">
                    {' '}
                    {formatDate(ticket.date)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      variant={
                        ticket.ticketStatus == 0
                          ? 'primary'
                          : ticket.ticketStatus == 1
                            ? 'gray'
                            : 'success'
                      }
                    >
                      {ticket.ticketStatus !== undefined &&
                      ticket.ticketStatus !== null
                        ? TICKET_STATUS_LABELS[
                            API_TICKET_STATUS_MAP[
                              typeof ticket.ticketStatus === 'number'
                                ? ticket.ticketStatus
                                : Number(ticket.ticketStatus)
                            ] ?? TicketStatus.Pending
                          ]
                        : ''}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="linkColor"
                      onClick={() =>
                        router.push(`/dashboard/support/${ticket?.chatId}`)
                      }
                    >
                      مشاهده جزئیات
                      <ArrowLeftAuthIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell className="p-4" colSpan={7}>
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    pageSizeOptions={[12, 24, 48]}
                    totalItems={totalCount}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default AdminSupportPage;
