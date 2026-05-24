'use client';

import { AdminDashboardService } from '@/apis';
import { DownloadIcon } from '@/assets/images/svg/Download';
import { NetworkIcon } from '@/assets/images/svg/Network';
import { SmartSpeakerIcon } from '@/assets/images/svg/SmartSpeaker';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/calendar';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { Input } from '@/components/ui/input/text-input/components/TextField';
import { Pagination } from '@/components/ui/pagination/index';
import { TableSkeleton } from '@/components/ui/table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import ReactQuery from '@/configs/react_query_keys';
import { ProductTypeObj, topicOptions } from '@/enums/enum';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/formatDate';
import numberSeprator from '@/utils/numberSeprator';
import { persianToEnglish } from '@/utils/persianToEnglish';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import HeaderDashboard from '../components/HeaderDashboard';
import type { DropdownOption } from '../support/type';
import type { paymentDateType } from './type';

const PaymentHistoryPage = () => {
  const [date, setDate] = useState<paymentDateType>({
    from: null,
    to: null,
  });

  const [selectedTopic, setSelectedTopic] = useState<DropdownOption | null>(
    null,
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    priceRangeStart: number | null;
    priceRangeEnd: number | null;
  }>({
    priceRangeStart: null,
    priceRangeEnd: null,
  });

  const [accountSearch, setAccountSearch] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleTopicChange = (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    if (stringValue === '0') {
      setSelectedTopic(null);
    } else {
      const selectedItem = topicOptions.find(
        item => item.value === stringValue,
      );
      setSelectedTopic(selectedItem || null);
    }
  };

  const searchDebounce = useDebounce(accountSearch, 500);
  const selectedStartPriceRangeDebounce = useDebounce(
    selectedPriceRange.priceRangeStart,
    500,
  );
  const selectedEndPriceRangeDebounce = useDebounce(
    selectedPriceRange.priceRangeEnd,
    500,
  );

  const { data: PaymentHistoryData, isLoading } = useQuery({
    queryKey: [
      ReactQuery.paymentHistory,
      date,
      selectedTopic,
      searchDebounce,
      selectedStartPriceRangeDebounce,
      selectedEndPriceRangeDebounce,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallpaymenthistoriesforadminPost(
        {
          maxResultCount: pageSize,
          skipCount: (currentPage - 1) * pageSize,
          sorting: null,
          accountName: searchDebounce || null,
          type: selectedTopic?.value ? Number(selectedTopic.value) : undefined,
          priceRangeStart: selectedStartPriceRangeDebounce || undefined,
          priceRangeEnd: selectedEndPriceRangeDebounce || undefined,
          startDate: date.from || undefined,
          endDate: date.to || undefined,
        },
      ),
  });

  const mutation = useMutation({
    mutationFn: () => {
      return AdminDashboardService.apiServicesAppAdmindashboardExportpaymenthistoriestoexcelGet();
    },
    onSuccess: response => {
      const blob = new Blob([response as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payment_history.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  return (
    <HeaderDashboard
      label="تاریخچه پرداخت ها"
      actionButton={
        <Button
          disabled={mutation.isPending}
          variant="primary"
          onClick={() => {
            mutation.mutate();
          }}
        >
          <DownloadIcon /> {mutation.isPending ? 'درحال دانلود' : 'دانلود'}
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-9 gap-2">
          <DropdownInput
            className="w-full col-span-4"
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
            className="w-full col-span-2"
            options={topicOptions}
            placeholder="موضوع را انتخاب کنید"
            value={selectedTopic?.value || ''}
            onValueChange={handleTopicChange}
          />
          <label className="w-full flex gap-2 col-span-2 relative">
            <Input
              placeholder="قیمت از"
              type="text"
              value={selectedPriceRange.priceRangeStart || ''}
              onChange={event => {
                const value = event.target.value;
                const numericValue = value
                  ? Number(persianToEnglish(value))
                  : null;
                setSelectedPriceRange(prev => ({
                  ...prev,
                  priceRangeStart: numericValue,
                }));
              }}
            />
            <Input
              placeholder="قیمت تا"
              type="text"
              value={selectedPriceRange.priceRangeEnd || ''}
              onChange={event => {
                const value = event.target.value;
                const numericValue = value
                  ? Number(persianToEnglish(value))
                  : null;
                setSelectedPriceRange(prev => ({
                  ...prev,
                  priceRangeEnd: numericValue,
                }));
              }}
            />
          </label>
          <DateRangePicker
            className="w-full col-span-1"
            onDateRangeChange={range => {
              setDate({
                from: range?.from?.toISOString() || null,
                to: range?.to?.toISOString() || null,
              });
            }}
          />
        </div>
        {isLoading ? (
          <section className="flex flex-col gap-8">
            <TableSkeleton columns={4} rows={5} />
          </section>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>موضوع</TableHead>
                <TableHead>اکانت</TableHead>
                <TableHead>مبلغ</TableHead>
                <TableHead>تاریخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PaymentHistoryData?.items?.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center text-textSecondary"
                    colSpan={4}
                  >
                    اطلاعاتی یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                PaymentHistoryData?.items?.map(payment => (
                  <TableRow key={`${payment.accountName}-${payment.price}`}>
                    <TableCell className="text-textTertiary flex items-center gap-2 text-sm font-semibold">
                      {payment.type === 3 ? (
                        <SmartSpeakerIcon />
                      ) : (
                        <NetworkIcon />
                      )}
                      {ProductTypeObj[payment.type || 0]}
                    </TableCell>
                    <TableCell className="text-textTertiary">
                      {payment.accountName}
                    </TableCell>
                    <TableCell className="text-textTertiary">
                      {numberSeprator(payment.price?.toString() || '')} ریال
                    </TableCell>
                    <TableCell className="text-textSecondary">
                      {formatDate(payment.date)}
                    </TableCell>
                  </TableRow>
                ))
              )}

              <TableRow>
                <TableCell className="w-full p-4" colSpan={4}>
                  <Pagination
                    className="w-full"
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={PaymentHistoryData?.totalCount || 0}
                    totalPages={Math.ceil(
                      (PaymentHistoryData?.totalCount || 0) / pageSize,
                    )}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    </HeaderDashboard>
  );
};

export default PaymentHistoryPage;
