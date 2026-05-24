'use client';

import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';

import { AdminDashboardService } from '@/apis';
import { ArrowLeftAuthIcon } from '@/assets/images/svg/ArrowLeftAuth';
import { Badge } from '@/components/ui/badge';
import ReactQuery from '@/configs/react_query_keys';
import numberSeprator from '@/utils/numberSeprator';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const AdminSpeakerPage = () => {
  const {
    data: speakersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQuery.adminSpeakersDashboard],
    queryFn: async () => {
      const result =
        await AdminDashboardService.apiServicesAppAdmindashboardGetallspeakersforadminGet();
      return result.items ?? [];
    },
    placeholderData: previousData => previousData,
  });

  if (isLoading) {
    return (
      <section className="flex flex-col gap-8">
        <TableSkeleton columns={7} rows={5} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-8">
        <div className="flex justify-center items-center py-12">
          <p className="text-xl-regular text-error-400">
            خطا در بارگذاری اسپیکرها. لطفاً دوباره تلاش کنید.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>نام</TableHead>
            <TableHead>مدل دستگاه</TableHead>
            <TableHead>موجودی</TableHead>
            <TableHead>قیمت</TableHead>
            <TableHead />
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {!speakersData || speakersData.length === 0 ? (
            <TableRow>
              <TableCell className="text-center text-textSecondary" colSpan={7}>
                اسپیکری یافت نشد
              </TableCell>
            </TableRow>
          ) : (
            speakersData.map(speaker => (
              <TableRow key={speaker.id}>
                <TableCell className="text-textSecondary">
                  {speaker.rowNumber ?? '-'}
                </TableCell>
                <TableCell className="text-gray-25">دستیار صوتی</TableCell>
                <TableCell>{speaker.deviceModel ?? '-'}</TableCell>
                <TableCell className="text-textSecondary">
                  {speaker.quantity ?? 0}
                </TableCell>
                <TableCell className="text-textSecondary flex gap-4 items-center">
                  {speaker.finalPrice
                    ? `${numberSeprator(String(speaker.finalPrice))} تومان`
                    : '-'}
                  {speaker?.discoutPercent && speaker?.discoutPercent > 0 && (
                    <Badge size="md" variant="sale">
                      {speaker?.discoutPercent}%
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/speakers/comments/${speaker.id}`}>
                    <Button
                      className="text-textTertiary cursor-pointer"
                      size="sm"
                      type="button"
                      variant="linkColor"
                    >
                      <span className="text-textTertiary">مشاهده نظرات</span>
                      <ArrowLeftAuthIcon
                        className="text-gray-600"
                        color="#475467"
                      />
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    className="text-primary-300 hover:text-primary-200 cursor-pointer"
                    size="sm"
                    type="button"
                    variant="linkColor"
                  >
                    <Link href={`/dashboard/speakers/${speaker.id}`}>
                      مشاهده جزئیات
                    </Link>
                    <ArrowLeftAuthIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default AdminSpeakerPage;
