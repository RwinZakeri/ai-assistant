'use client';

import type { CommentStatus, LifecycleBounds } from '@/apis';
import { AdminDashboardService } from '@/apis';
import type { paymentDateType } from '@/components/pages/user-dashboard/payment-history/type';
import type { CommentsProps } from '@/components/pages/user-dashboard/voice-assistants/type';
import { DateRangePicker } from '@/components/ui/calendar';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { Pagination } from '@/components/ui/pagination/index';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { UnderlineTabsContent } from '@/components/ui/tabs/underline';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import CommentTable from '../components/comments/commentTable';
import { commentStatus, newestOldestItem } from '../components/comments/type';

const Comments = ({ assistantId }: CommentsProps) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'specifications';

  const [date, setDate] = useState<paymentDateType>({
    from: null,
    to: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [status, setStatus] = useState<undefined | CommentStatus>(undefined);
  const [commentLifecycleBounds, setCommentLifecycleBounds] = useState<
    undefined | LifecycleBounds
  >(undefined);

  const {
    data: commentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'GetAssistantCommentsById',
      assistantId,
      currentPage,
      pageSize,
      status,
      commentLifecycleBounds,
      date,
    ],
    queryFn: async () => {
      const result =
        await AdminDashboardService.apiServicesAppAdmindashboardGetassistantcommentsbyidPost(
          {
            assistantId,
            maxResultCount: pageSize,
            skipCount: (currentPage - 1) * pageSize,
            status,
            lifecycleBounds: commentLifecycleBounds,
            start: date.from,
            end: date.to,
          },
        );

      return {
        items: (result?.items || []).map((item: any, index: number) => ({
          commentId: item.id,
          fullname: item.fullName,
          comment: item.content,
          date: item.date,
          status: item.status,
          rowNumber: (currentPage - 1) * pageSize + index + 1,
        })),
        totalCount: result?.totalCount || 0,
      };
    },
    enabled: !!assistantId && activeTab === 'comments',
    placeholderData: previousData => previousData,
  });

  const comments = useMemo(() => {
    return commentsData?.items ?? [];
  }, [commentsData]);

  const totalCount = useMemo(() => {
    return commentsData?.totalCount ?? 0;
  }, [commentsData]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleLifecycleBoundsChange = (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    if (stringValue === 'all' || stringValue === undefined) {
      setCommentLifecycleBounds(undefined);
      return;
    }
    const sortingValue =
      typeof stringValue === 'string' ? Number(stringValue) : undefined;
    setCommentLifecycleBounds(
      sortingValue !== undefined ? sortingValue : undefined,
    );
  };

  const handleStatusChange = (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    if (stringValue === 'all' || stringValue === undefined) {
      setStatus(undefined);
      return;
    }
    const statusValue =
      typeof stringValue === 'string' ? Number(stringValue) : undefined;
    setStatus(
      statusValue !== undefined ? (statusValue as CommentStatus) : undefined,
    );
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate({
      from: range?.from?.toISOString() || null,
      to: range?.to?.toISOString() || null,
    });
  };

  return (
    <UnderlineTabsContent value="comments">
      <div className="flex flex-col gap-6">
        <div className="flex items-end gap-2">
          <DropdownInput
            className="w-full"
            label="جدیدترین"
            options={newestOldestItem}
            onValueChange={handleLifecycleBoundsChange}
          />
          <DropdownInput
            className="w-full"
            label="انتخاب وضعیت"
            options={commentStatus}
            onValueChange={handleStatusChange}
          />
          <DateRangePicker
            className="w-full col-span-1"
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-xl-regular text-error-400">
              خطا در بارگذاری نظرات. لطفاً دوباره تلاش کنید.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>نام و نام خانوادگی</TableHead>
                <TableHead>نظرات</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center text-textSecondary"
                    colSpan={6}
                  >
                    نظری یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                comments.map(comment => (
                  <CommentTable
                    key={comment.commentId}
                    assistantId={assistantId}
                    comment={comment}
                  />
                ))
              )}
              {!isLoading && comments.length > 0 && totalCount > 0 && (
                <TableRow>
                  <TableCell className="w-full p-4" colSpan={6}>
                    <Pagination
                      className="w-full"
                      currentPage={currentPage}
                      pageSize={pageSize}
                      totalItems={totalCount}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </UnderlineTabsContent>
  );
};

export default Comments;
