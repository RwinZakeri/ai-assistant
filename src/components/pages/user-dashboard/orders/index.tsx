'use client';

import { AdminDashboardService } from '@/apis';
import type { GetAllOrdersForAdminInput } from '@/apis/models/GetAllOrdersForAdminInput';
import type { OrderState } from '@/apis/models/OrderState';
import { Download02Icon } from '@/assets/images/svg/Download02';
import { Button } from '@/components/ui/button';
import ReactQuery from '@/configs/react_query_keys';
import { useDebounce } from '@/hooks/useDebounce';
import downloadFile from '@/utils/downloadFile';
import { getDownloadTempFileUrl } from '@/utils/getDownloadTempFileUrl';
import { pdf } from '@react-pdf/renderer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import HeaderDashboard from '../components/HeaderDashboard';
import InvoicePDF from './components/InvoicePDF';
import OrdersFilters from './components/OrdersFilters';
import OrdersTable from './components/OrdersTable';
import OrdersTableSkeleton from './components/OrdersTableSkeleton';

export default function OrdersPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [deviceModelValue, setDeviceModelValue] = useState<string>('');
  const [statusValue, setStatusValue] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearchValue = useDebounce(searchValue, 400);

  const orderNumber = useMemo(() => {
    const parsed = parseInt(debouncedSearchValue);
    return isNaN(parsed) ? null : parsed;
  }, [debouncedSearchValue]);

  const queryInput: GetAllOrdersForAdminInput = useMemo(
    () => ({
      maxResultCount: pageSize,
      skipCount: (currentPage - 1) * pageSize,
      sorting: '',
      orderNumber,
      deviceModel: deviceModelValue || null,
      status:
        statusValue && statusValue !== ''
          ? (parseInt(statusValue) as OrderState)
          : undefined,
      startDate: dateRange?.from ? dateRange.from.toISOString() : null,
      endDate: dateRange?.to ? dateRange.to.toISOString() : null,
    }),
    [
      pageSize,
      currentPage,
      orderNumber,
      deviceModelValue,
      statusValue,
      dateRange,
    ],
  );

  const { data: ordersResponse, isLoading: isLoadingOrders } = useQuery({
    queryKey: [ReactQuery.allOrdersForAdmin, queryInput],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallordersforadminPost(
        queryInput,
      ),
  });

  const orders = ordersResponse?.items ?? [];
  const totalCount = ordersResponse?.totalCount ?? 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue, deviceModelValue, statusValue, dateRange]);

  const exportExcelMutation = useMutation({
    mutationFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardExportorderstoexcelGet(
        orderNumber ?? undefined,
        deviceModelValue || undefined,
        statusValue && statusValue !== ''
          ? (parseInt(statusValue) as OrderState)
          : undefined,
        dateRange?.from?.toISOString(),
        dateRange?.to?.toISOString(),
        '',
        undefined,
        undefined,
      ),
    onSuccess: data => {
      try {
        if (!data?.fileToken) {
          throw new Error('File token not found in response');
        }
        const downloadUrl = getDownloadTempFileUrl(data);
        const fileName = data.fileName || 'Orders_Exported.xlsx';
        downloadFile(downloadUrl, fileName);
        toast.success('فایل اکسل با موفقیت دانلود شد.');
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات فایل. لطفاً دوباره تلاش کنید.');
      }
    },
    onError: () => {
      toast.error('خطا در دانلود فایل اکسل. لطفاً دوباره تلاش کنید.');
    },
  });

  const downloadInvoiceMutation = useMutation({
    mutationFn: async (orderId: number) => {
      // Get invoice data
      const invoiceData =
        await AdminDashboardService.apiServicesAppAdmindashboardGetorderinvoicedataGet(
          orderId,
        );

      // Generate PDF
      const doc = pdf(<InvoicePDF invoiceData={invoiceData} />);
      const blob = await doc.toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoiceData.orderNo || orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return invoiceData;
    },
    onSuccess: () => {
      toast.success('فاکتور با موفقیت دانلود شد.');
    },
    onError: () => {
      toast.error('خطا در دانلود فاکتور. لطفاً دوباره تلاش کنید.');
    },
  });

  const handleViewDetails = (orderId: number) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  const handleDownloadInvoice = (orderId: number) => {
    downloadInvoiceMutation.mutate(orderId);
  };

  const handleExportExcel = () => {
    exportExcelMutation.mutate();
  };

  return (
    <HeaderDashboard
      label="سفارشات"
      headerButton={
        <Button
          className="flex items-center gap-2"
          disabled={exportExcelMutation.isPending}
          size="md"
          variant="primary"
          onClick={handleExportExcel}
        >
          <Download02Icon />
          {exportExcelMutation.isPending ? 'در حال دانلود...' : 'دانلود'}
        </Button>
      }
    >
      <div className="flex flex-col">
        <OrdersFilters
          dateRange={dateRange}
          deviceModelValue={deviceModelValue}
          searchValue={searchValue}
          statusValue={statusValue}
          onDateRangeChange={setDateRange}
          onDeviceModelChange={setDeviceModelValue}
          onSearchChange={setSearchValue}
          onStatusChange={setStatusValue}
        />
        {isLoadingOrders ? (
          <OrdersTableSkeleton rows={pageSize} />
        ) : (
          <OrdersTable
            currentPage={currentPage}
            isDownloadingInvoice={downloadInvoiceMutation.isPending}
            orders={orders}
            pageSize={pageSize}
            totalCount={totalCount}
            onDownloadInvoice={handleDownloadInvoice}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            onPageSizeChange={size => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </HeaderDashboard>
  );
}
