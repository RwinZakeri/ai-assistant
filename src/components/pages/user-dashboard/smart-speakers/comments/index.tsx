"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { AdminDashboardService, CommentStatus, LifecycleBounds } from "@/apis";
import type { GetAllSpeakerCommentsOutput } from "@/apis/models/GetAllSpeakerCommentsOutput";
import { DateRangePicker } from "@/components/ui/calendar";
import { DropdownInput } from "@/components/ui/input/dropdown-input";
import { Pagination } from "@/components/ui/pagination/index";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
import ReactQuery from "@/configs/react_query_keys";
import HeaderDashboard from "../../components/HeaderDashboard";
import { paymentDateType } from "../../payment-history/type";
import CommentTable from "./components/commentTable";
import { commentStatus, newestOldestItem } from "./components/type";

interface SpeakerCommentsProps {
  speakerId: number;
}

const SpeakerComments = ({ speakerId }: SpeakerCommentsProps) => {
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
      ReactQuery.speakerCommentsForAdmin,
      speakerId,
      currentPage,
      pageSize,
      status,
      commentLifecycleBounds,
      date,
    ],
    queryFn: async () => {
      const result =
        await AdminDashboardService.apiServicesAppAdmindashboardGetallspeakercommentsforadminPost(
          {
            speakerId,
            maxResultCount: pageSize,
            skipCount: (currentPage - 1) * pageSize,
            sorting: null,
            status: status,
            commentLifecycleBounds,
            startDate: date.from,
            endDate: date.to,
          }
        );

      return result;
    },
    enabled: !!speakerId,
    placeholderData: (previousData) => previousData,
  });

  // const comments: GetAllSpeakerCommentsOutput[] = ;

  const comments = useMemo<GetAllSpeakerCommentsOutput[]>(() => {
    return commentsData?.items ?? [];
  }, [commentsData]);

  const totalCount = useMemo(() => {
    return commentsData?.totalCount ?? 0;
  }, [commentsData]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [commentsData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <HeaderDashboard label="نظرات">
      <div className="flex flex-col gap-6">
        <div className="flex  items-end gap-2">
          <DropdownInput
            onValueChange={(value) => {
              if (value === "all" || value === undefined) {
                setCommentLifecycleBounds(undefined);
                return;
              }
              const sortingValue =
                typeof value === "string" ? Number(value) : undefined;
              setCommentLifecycleBounds(
                sortingValue !== undefined ? sortingValue : undefined
              );
            }}
            className="w-full"
            options={newestOldestItem}
            label="جدیدترین"
          ></DropdownInput>
          <DropdownInput
            onValueChange={(value) => {
              if (value === "all" || value === undefined) {
                setStatus(undefined);
                return;
              }
              const statusValue =
                typeof value === "string" ? Number(value) : undefined;
              setStatus(
                statusValue !== undefined
                  ? (statusValue as CommentStatus)
                  : undefined
              );
            }}
            className="w-full"
            options={commentStatus}
            label="انتخاب وضعیت"
          ></DropdownInput>
          <DateRangePicker
            onDateRangeChange={(range) => {
              setDate({
                from: range?.from?.toISOString() || null,
                to: range?.to?.toISOString() || null,
              });
            }}
            className="w-full col-span-1"
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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-textSecondary"
                  >
                    نظری یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                comments.map((comment) => (
                  <CommentTable
                    key={comment.commentId}
                    comment={comment}
                    speakerId={speakerId}
                  />
                ))
              )}
              {!isLoading && comments.length > 0 && totalCount > 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="w-full p-4">
                    <Pagination
                      className="w-full"
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      totalItems={totalCount}
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
    </HeaderDashboard>
  );
};

export default SpeakerComments;
