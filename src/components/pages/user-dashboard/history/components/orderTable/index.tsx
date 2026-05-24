'use client';

import type { GetMyPaymentHistoryListOutput } from '@/apis/models/GetMyPaymentHistoryListOutput';
import type { OrderPaymentState } from '@/apis/models/OrderPaymentState';
import { NetworkIcon } from '@/assets/images/svg/Network';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TableBody, TableCell, TableSkeleton } from '@/components/ui/table';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { formatDate } from '@/utils/formatDate';
import numberSeprator from '@/utils/numberSeprator';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { memo, useMemo, useState } from 'react';

type PaymentHistoryItem = GetMyPaymentHistoryListOutput;

interface OrderTableProps {
  data: PaymentHistoryItem[];
  isLoading: boolean;
}

const getPaymentStateLabel = (state?: OrderPaymentState) => {
  switch (state) {
    case 0:
      return 'در انتظار پرداخت';
    case 1:
      return 'پرداخت شده';
    case 2:
      return 'ناموفق';
    default:
      return 'نامشخص';
  }
};

const DetailItem = memo(
  ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-800 px-4 py-3">
      <span className="text-sm text-textSecondary">{label}</span>
      <span className="text-sm font-semibold text-gray-25">{value}</span>
    </div>
  ),
);

DetailItem.displayName = 'DetailItem';

const OrderTable = ({ data, isLoading }: OrderTableProps) => {
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentHistoryItem | null>(null);

  const selectedPaymentInfo = useMemo(() => {
    if (!selectedPayment) {
      return null;
    }

    const category = selectedPayment.category?.length
      ? selectedPayment.category.join(', ')
      : 'عمومی';
    const amount = selectedPayment.amount
      ? `${numberSeprator(selectedPayment.amount.toString())} ریال`
      : '0 ریال';

    return {
      amount,
      category,
      date: formatDate(selectedPayment.date),
      orderId: selectedPayment.orderId ?? '-',
      paymentState: getPaymentStateLabel(selectedPayment.paymentState),
      title: selectedPayment.subject || 'نامشخص',
    };
  }, [selectedPayment]);

  if (isLoading) {
    return (
      <div className="py-6">
        <TableSkeleton columns={5} rows={5} />
      </div>
    );
  }

  return (
    <div className="py-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>موضوع</TableHead>
            <TableHead>مبلغ</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>دسته‌بندی</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((payment, index) => {
              const title = payment.subject || 'نامشخص';
              const amount = payment.amount
                ? `${numberSeprator(payment.amount.toString())} ریال`
                : '0 ریال';
              const date = formatDate(payment.date);
              const category = payment.category?.length
                ? payment.category.join(', ')
                : 'عمومی';
              const paymentId = payment.orderId ?? payment.rowNumber ?? index;

              return (
                <TableRow
                  key={
                    paymentId || `${payment.subject}-${payment.date}-${index}`
                  }
                >
                  <TableCell className="text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <NetworkIcon />
                      {title}
                    </div>
                  </TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell className="text-textSecondary">{date}</TableCell>
                  <TableCell>
                    <Badge variant="primary">{category}</Badge>
                  </TableCell>
                  <TableCell className="text-primary-300">
                    <button
                      className="flex items-center justify-center gap-1 text-primary-300 transition-colors hover:text-primary-200"
                      type="button"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      مشاهده جزئیات
                      <ArrowLeft className="text-primary-700" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell className="text-center" colSpan={5}>
                <p className="text-sm font-medium text-textSecondary">
                  پرداختی انجام نشده است
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog
        open={!!selectedPayment}
        onOpenChange={open => {
          if (!open) {
            setSelectedPayment(null);
          }
        }}
      >
        <DialogContent
          className="p-7 text-right"
          dir="rtl"
          showCloseButton={false}
        >
          <DialogClose className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-background">
            <Image
              alt="بستن"
              height={32}
              src="/images/icons/cards-modal-close.png"
              width={32}
            />
            <span className="sr-only">بستن</span>
          </DialogClose>
          <DialogHeader className="items-end">
            <DialogTitle className="text-lg font-semibold text-gray-25">
              جزئیات پرداخت
            </DialogTitle>
          </DialogHeader>
          {selectedPaymentInfo && (
            <div className="grid gap-3">
              <DetailItem label="موضوع" value={selectedPaymentInfo.title} />
              <DetailItem
                label="شماره سفارش"
                value={selectedPaymentInfo.orderId}
              />
              <DetailItem label="مبلغ" value={selectedPaymentInfo.amount} />
              <DetailItem label="تاریخ" value={selectedPaymentInfo.date} />
              <DetailItem
                label="دسته‌بندی"
                value={selectedPaymentInfo.category}
              />
              <DetailItem
                label="وضعیت پرداخت"
                value={selectedPaymentInfo.paymentState}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTable;
