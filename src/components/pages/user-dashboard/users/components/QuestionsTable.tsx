"use client";

import { useMemo, useState } from "react";
import { Download02Icon } from "@/assets/images/svg/Download02";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
import { DropdownInput } from "@/components/ui/input/dropdown-input";
import { DateRangePicker } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Pagination } from "@/components/ui/pagination/index";
import { AdminDashboardService, UserDashboardService } from "@/apis";
import type {
  GetAllUserQuestionAnswersOutput,
  GetAssistantsLightWeightOutput,
} from "@/apis";
import ReactQuery from "@/configs/react_query_keys";
import { useQuery, useMutation } from "@tanstack/react-query";
import { formatDate } from "@/utils/formatDate";
import type { Question, QuestionsTableProps } from "./types";
import { calculateTotalPages } from "../utils";
import QuestionsTableSkeleton from "./skeletons/QuestionsTableSkeleton";
import { toast } from "sonner";
import type { FileDto } from "@/apis";
import { getDownloadTempFileUrl } from "@/utils/getDownloadTempFileUrl";
import downloadFile from "@/utils/downloadFile";

const DEFAULT_SORTING = "date DESC";
const DEFAULT_PAGE_SIZE = 8;
const ALL_ASSISTANTS_VALUE = "all";

const getAssistantIdFromValue = (value: string): number | undefined => {
  return value === ALL_ASSISTANTS_VALUE || value === ""
    ? undefined
    : Number(value);
};

const mapApiQuestionToQuestion = (
  item: GetAllUserQuestionAnswersOutput,
  index: number
): Question => {
  const rowNumber = item.rowNumber ?? index + 1;

  return {
    id: String(rowNumber),
    number: rowNumber,
    fullName: item.fullName ?? "",
    voiceAssistantId: item.assistantName ?? "",
    questions: item.question ? [item.question] : [],
    answers: item.answer ? [item.answer] : [],
    date: item.date ? formatDate(item.date) : undefined,
  };
};

const QuestionsTable = ({}: QuestionsTableProps) => {
  const [selectedVoiceAssistant, setSelectedVoiceAssistant] =
    useState<string>(ALL_ASSISTANTS_VALUE);
  const [selectedAssistantId, setSelectedAssistantId] = useState<number>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data: assistantsData } = useQuery({
    queryKey: [ReactQuery.userAssistantsLightWeight],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetalluserassistantslightweightGet(),
  });

  const voiceAssistantOptions = useMemo(() => {
    const baseOptions = [
      { value: ALL_ASSISTANTS_VALUE, label: "همه دستیاران صوتی" },
    ];

    if (!assistantsData || assistantsData.length === 0) {
      return baseOptions;
    }

    return [
      ...baseOptions,
      ...assistantsData.map((assistant: GetAssistantsLightWeightOutput) => ({
        value: assistant.id !== undefined ? String(assistant.id) : "",
        label: assistant.title ?? "",
      })),
    ];
  }, [assistantsData]);

  const {
    data: questionsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      ReactQuery.userQuestionsForAdmin,
      {
        selectedAssistantId,
        dateFrom: dateRange?.from?.toISOString(),
        dateTo: dateRange?.to?.toISOString(),
        currentPage,
        pageSize,
      },
    ],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetalluserquestionandanswersPost(
        {
          assistantId: selectedAssistantId,
          start: dateRange?.from?.toISOString() ?? null,
          end: dateRange?.to?.toISOString() ?? null,
          skipCount: (currentPage - 1) * pageSize,
          maxResultCount: pageSize,
          sorting: DEFAULT_SORTING,
        }
      ),
  });

  const questions: Question[] = useMemo(() => {
    return questionsResponse?.items
      ? questionsResponse.items.map(mapApiQuestionToQuestion)
      : [];
  }, [questionsResponse]);

  const totalItems = questionsResponse?.totalCount ?? questions.length;
  const totalPages = calculateTotalPages(totalItems, pageSize);

  const exportMutation = useMutation({
    mutationFn: async () => {
      return AdminDashboardService.apiServicesAppAdmindashboardExportquestionandanswerstoexcelGet(
        selectedAssistantId,
        dateRange?.from?.toISOString(),
        dateRange?.to?.toISOString(),
        DEFAULT_SORTING
      );
    },
    onSuccess: (data: FileDto) => {
      try {
        if (!data?.fileToken) {
          throw new Error("File token not found in response");
        }

        const downloadUrl = getDownloadTempFileUrl(data);
        const fileName = data.fileName || "Users_QA_Exported.xlsx";

        downloadFile(downloadUrl, fileName);
        toast.success("فایل اکسل با موفقیت دانلود شد.");
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات فایل. لطفاً دوباره تلاش کنید.");
      }
    },
    onError: () => {
      toast.error("خطا در دانلود فایل اکسل. لطفاً دوباره تلاش کنید.");
    },
  });

  const handleDownload = () => {
    exportMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-row gap-4 items-center w-full  ">
          <DropdownInput
            type="default"
            placeholder="انتخاب دستیار صوتی"
            options={voiceAssistantOptions}
            value={selectedVoiceAssistant}
            onValueChange={(value) => {
              const strValue = value as string;
              setSelectedVoiceAssistant(strValue);
              setSelectedAssistantId(getAssistantIdFromValue(strValue));
              setCurrentPage(1);
            }}
            className="w-[320px]"
          />
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={(range) => {
              setDateRange(range);
              setCurrentPage(1);
            }}
            placeholderText="انتخاب تاریخ"
            triggerClassName="text-textSecondary"
          />
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleDownload}
          disabled={exportMutation.isPending}
          className="flex items-center gap-2"
        >
          <Download02Icon />
          {exportMutation.isPending ? "در حال دانلود..." : "دانلود"}
        </Button>
      </div>

      
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>نام و نام خانوادگی</TableHead>
                <TableHead>شناسه دستیار صوتی</TableHead>
                <TableHead>سؤالات</TableHead>
                <TableHead>پاسخ ها</TableHead>
                <TableHead>تاریخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <QuestionsTableSkeleton rows={5} />
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-destructive"
                  >
                    خطا در بارگذاری سؤالات. لطفاً دوباره تلاش کنید.
                  </TableCell>
                </TableRow>
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-textSecondary"
                  >
                    هیچ سؤالی یافت نشد.
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-semibold text-white">
                      {question.number}
                    </TableCell>
                    <TableCell>{question.fullName}</TableCell>
                    <TableCell>{question.voiceAssistantId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {question.questions.map((q, index) => (
                          <div key={index} className="text-sm">
                            {q}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {question.answers.map((a, index) => (
                          <div key={index} className="text-sm">
                            {a}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-textSecondary">
                      {question.date}
                    </TableCell>
                  </TableRow>
                ))
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
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              pageSizeOptions={[8, 16, 24]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsTable;
