"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
import { Pagination } from "@/components/ui/pagination/index";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { AdminDashboardService } from "@/apis";
import { parseUserIdWithFallback, calculateTotalPages } from "../utils";
import VoiceAssistantsTableSkeleton from "./skeletons/VoiceAssistantsTableSkeleton";
import { useUserProfile } from "./UserProfileContext";

const VoiceAssistantsTable = () => {
  const { userId } = useUserProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const userIdNumber = parseUserIdWithFallback(userId);

  const { data, isLoading } = useQuery({
    queryKey: ["user-voice-assistants", userId, currentPage, pageSize],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallassistantsforselecteduserPost(
        {
          userId: userIdNumber,
          maxResultCount: pageSize,
          skipCount: (currentPage - 1) * pageSize,
        }
      ),
    enabled: !!userIdNumber && !isNaN(userIdNumber),
  });

  const assistants = useMemo(() => {
    const items = data?.items || [];
    
    return [...items].sort((a, b) => {
      const nameA = (a.assistantPersianTitle || "").toLowerCase();
      const nameB = (b.assistantPersianTitle || "").toLowerCase();
      return nameA.localeCompare(nameB, "fa");
    });
  }, [data?.items]);

  const totalItems = data?.totalCount || 0;
  const totalPages = calculateTotalPages(totalItems, pageSize);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-none">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">#</TableHead>
              <TableHead className="w-1/3">دستیاران صوتی خریداری شده</TableHead>
              <TableHead className="w-1/4"></TableHead>
              <TableHead className="w-1/3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <VoiceAssistantsTableSkeleton rows={5} />
            ) : assistants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-textSecondary"
                >
                  هیچ دستیار صوتی خریداری شده‌ای یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              assistants.map((assistant, index) => {
                const percentage = assistant.usedPercent || 0;
                const daysLeft = assistant.daysLeftCount || 0;
                const isActive = percentage < 100 && daysLeft > 0;

                return (
                  <TableRow key={assistant.rowNumber || index}>
                    <TableCell className="text-textSecondary text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-25">
                      {assistant.assistantPersianTitle || ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary" size="md">
                        {assistant.assistantCategoryTitle || ""}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isActive ? (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-300 text-sm-medium whitespace-nowrap">
                            {percentage}%
                          </span>
                          <ProgressPrimitive.Root
                            className="relative overflow-hidden bg-surfaceTertiary rounded-full w-[200px] h-2"
                            value={percentage}
                          >
                            <ProgressPrimitive.Indicator
                              className="h-full w-full bg-primary-300 transition-transform rounded-full duration-300 ease-in-out"
                              style={{
                                transform: `translateX(-${100 - percentage}%)`,
                              }}
                            />
                          </ProgressPrimitive.Root>
                          <span className="text-primary-300 text-sm-demibold whitespace-nowrap">
                            {daysLeft} روز مانده
                          </span>
                        </div>
                      ) : (
                        <span className="text-textSecondary text-sm-medium">
                          منقضی شده
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <div className="border-t border-gray-800 px-6 py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 20, 30, 50]}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceAssistantsTable;
