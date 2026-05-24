'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

import { AdminDashboardService } from '@/apis';
import { DownloadIcon } from '@/assets/images/svg/Download';
import type { QuestionsProps } from '@/components/pages/user-dashboard/voice-assistants/type';
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
import { UnderlineTabsContent } from '@/components/ui/tabs/underline';
import ReactQuery from '@/configs/react_query_keys';

const Questions = ({
  assistantId,
  isEditMode,
  onExportReady,
}: QuestionsProps) => {
  const [questionAccountSearch, setQuestionAccountSearch] =
    useState<string>('');
  const [selectedAssistantId, setSelectedAssistantId] = useState<number | null>(
    assistantId || null,
  );
  const [questionDateRange, setQuestionDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [questionPage, setQuestionPage] = useState(1);
  const [questionPageSize, setQuestionPageSize] = useState(10);

  const { data: allAssistantsData } = useQuery({
    queryKey: [ReactQuery.GetAllAssistantsForAdmin],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallassistantsforadminPost(
        {
          skipCount: 0,
          maxResultCount: 1000,
          sorting: null,
        },
      ),
    enabled: isEditMode,
  });

  const assistantOptions = useMemo(() => {
    if (!allAssistantsData?.items) {
      return [];
    }
    return allAssistantsData.items
      .filter(item => item.id != null && item.persianName)
      .map(item => ({
        label: item.persianName ?? '',
        value: String(item.id!),
      }));
  }, [allAssistantsData]);

  const debouncedQuestionAccountSearch = useDebounce(
    questionAccountSearch,
    500,
  );

  const { data: questionsDataRaw, isLoading: isLoadingQuestions } = useQuery({
    queryKey: [
      'GetAllAssistantQuestionAndAnswers',
      selectedAssistantId,
      questionDateRange,
    ],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallassistantquestionandanswersPost(
        {
          assistantId: selectedAssistantId || null,
          skipCount: 0,
          maxResultCount: 10000,
          start: questionDateRange?.from
            ? new Date(questionDateRange.from).toISOString()
            : null,
          end: questionDateRange?.to
            ? new Date(questionDateRange.to).toISOString()
            : null,
          sorting: null,
        },
      ),
    enabled: isEditMode,
  });

  const questionsData = useMemo(() => {
    if (!questionsDataRaw?.items) {
      return { items: [], totalCount: 0 };
    }

    let filtered = [...(questionsDataRaw.items || [])];

    if (debouncedQuestionAccountSearch) {
      filtered = filtered.filter(item =>
        item.fullName
          ?.toLowerCase()
          .includes(debouncedQuestionAccountSearch.toLowerCase()),
      );
    }

    const totalCount = filtered.length;
    const startIndex = (questionPage - 1) * questionPageSize;
    const endIndex = startIndex + questionPageSize;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      items: paginated,
      totalCount,
    };
  }, [
    questionsDataRaw,
    debouncedQuestionAccountSearch,
    questionPage,
    questionPageSize,
  ]);

  const exportQuestionsMutation = useMutation({
    mutationFn: () => {
      return AdminDashboardService.apiServicesAppAdmindashboardExportassistantquestionanswerstoexcelGet(
        selectedAssistantId || undefined,
        questionDateRange?.from
          ? new Date(questionDateRange.from).toISOString()
          : undefined,
        questionDateRange?.to
          ? new Date(questionDateRange.to).toISOString()
          : undefined,
        undefined,
        undefined,
        undefined,
      );
    },
    onSuccess: response => {
      const blob = new Blob([response as any], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'assistant_questions_answers.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('فایل با موفقیت دانلود شد');
    },
    onError: () => {
      toast.error('خطا در دانلود فایل');
    },
  });

  return (
    <UnderlineTabsContent value="questions">
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <Button
            disabled={exportQuestionsMutation.isPending}
            variant="primary"
            onClick={() => {
              exportQuestionsMutation.mutate();
            }}
          >
            <DownloadIcon />{' '}
            {exportQuestionsMutation.isPending ? 'درحال دانلود' : 'دانلود'}
          </Button>
        </div>

        <div className="flex items-end gap-2">
          <DropdownInput
            className="w-full"
            label=""
            options={[]}
            placeholder="جستجو نام اکانت"
            searchPlaceholder="جستجو نام اکانت"
            type="search"
            value={questionAccountSearch}
            onInputChange={value => {
              setQuestionAccountSearch(value.trim());
              setQuestionPage(1);
            }}
          />
          <DropdownInput
            className="w-full"
            label=""
            placeholder="همه دستیاران"
            type="default"
            options={[
              { label: 'همه دستیاران', value: '' },
              ...assistantOptions,
            ]}
            value={
              selectedAssistantId !== null ? String(selectedAssistantId) : ''
            }
            onValueChange={value => {
              setSelectedAssistantId(value ? Number(value) : null);
              setQuestionPage(1);
            }}
          />
          <div className="flex flex-col gap-1.5 w-full">
            <DateRangePicker
              className="w-full col-span-1"
              dateRange={questionDateRange}
              placeholderText="انتخاب بازه زمانی"
              onDateRangeChange={range => {
                setQuestionDateRange(range);
                setQuestionPage(1);
              }}
            />
          </div>
        </div>
        <div className="w-full">
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
              {isLoadingQuestions ? (
                <TableRow>
                  <TableCell
                    className="text-center text-textSecondary"
                    colSpan={6}
                  >
                    در حال بارگذاری...
                  </TableCell>
                </TableRow>
              ) : !questionsData?.items || questionsData.items.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center text-textSecondary"
                    colSpan={6}
                  >
                    سؤالی یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {questionsData.items.map((question, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-textSecondary">
                        {question.rowNumber ??
                          (questionPage - 1) * questionPageSize + index + 1}
                      </TableCell>
                      <TableCell className="text-textTertiary">
                        {question.fullName || '-'}
                      </TableCell>
                      <TableCell className="text-textTertiary">
                        {question.assistantName || '-'}
                      </TableCell>
                      <TableCell className="text-textTertiary max-w-md">
                        <div className="line-clamp-2">
                          {question.question || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-textTertiary max-w-md">
                        <div className="line-clamp-2">
                          {question.answer || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-textSecondary">
                        {question.date
                          ? new Date(question.date).toLocaleDateString(
                              'fa-IR',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {questionsData.totalCount &&
                  questionsData.totalCount > questionPageSize ? (
                    <TableRow>
                      <TableCell className="p-4" colSpan={6}>
                        <Pagination
                          currentPage={questionPage}
                          pageSize={questionPageSize}
                          pageSizeOptions={[10, 20, 50]}
                          totalItems={questionsData.totalCount || 0}
                          totalPages={Math.ceil(
                            (questionsData.totalCount || 0) / questionPageSize,
                          )}
                          onPageChange={setQuestionPage}
                          onPageSizeChange={newSize => {
                            setQuestionPageSize(newSize);
                            setQuestionPage(1);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ) : null}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </UnderlineTabsContent>
  );
};

export default Questions;
