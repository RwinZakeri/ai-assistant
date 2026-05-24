'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import HeaderDashboard from '../components/HeaderDashboard';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { Button } from '@/components/ui/button';

import { useDebounce } from '@/hooks/useDebounce';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { Pagination } from '@/components/ui/pagination/index';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import { Edit01Icon } from '@/assets/images/svg/Edit01';
import { Tag } from '@/components/ui/tag';
import DeleteDiscountCodeModal from './components/DeleteDiscountCodeModal';
import DiscountCodesTableSkeleton from './components/skeletons/DiscountCodesTableSkeleton';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { LifecycleBounds } from '@/enums/enum';
import { formatDate } from '@/utils/formatDate';
import type { DiscountCode } from './types';
import { DashboardPlusIcon } from '@/assets/images/svg/DashboardPlus';

import { Asset3Icon } from '@/assets/images/svg/Asset3';

const formatDateRange = (
  startDate?: string | null,
  endDate?: string | null,
): string => {
  if (!startDate && !endDate) {
    return '-';
  }

  const formatSingleDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      return '';
    }
    try {
      const date = new Date(dateString);
      const persianDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        calendar: 'persian',
      }).format(date);
      return persianDate;
    } catch {
      return '';
    }
  };

  const start = formatSingleDate(startDate);
  const end = formatSingleDate(endDate);

  if (start !== end) {
    return `${start} - ${end}`;
  } else {
    return `${end}`;
  }
};

const sortOptions = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
];

const calculateTotalPages = (totalItems: number, pageSize: number): number => {
  return Math.ceil(totalItems / pageSize);
};

const DiscountCodesPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearchValue = useDebounce(searchValue, 400);

  const lifecycleBounds =
    sortBy === 'newest'
      ? (LifecycleBounds.Newest as any)
      : sortBy === 'oldest'
        ? (LifecycleBounds.Oldest as any)
        : undefined;

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [
      ReactQuery.allDiscountCodes,
      debouncedSearchValue,
      lifecycleBounds,
      currentPage,
      pageSize,
    ],
    queryFn: () => {
      return AdminDashboardService.apiServicesAppAdmindashboardGetalldiscountcodesPost(
        {
          maxResultCount: pageSize,
          skipCount: (currentPage - 1) * pageSize,
          sorting: null,
          code: debouncedSearchValue || undefined,
          lifecycleBounds,
        },
      );
    },
  });

  const discountCodes: DiscountCode[] =
    apiResponse?.items?.map(item => {
      const itemWithRelations = item as typeof item & {
        assistants?: Array<{ id?: number; title?: string | null }>;
        speakers?: Array<{ speakerId?: number; title?: string | null }>;
      };

      return {
        id: String(item.id ?? ''),
        code: item.discountCode ?? '',
        percentage: item.discountPercentage ?? 0,
        voiceAssistants:
          itemWithRelations.assistants?.map(
            a => a.title ?? String(a.id ?? ''),
          ) ?? [],
        devices:
          itemWithRelations.speakers?.map(
            s => s.title ?? String(s.speakerId ?? ''),
          ) ?? [],
        expirationDate: formatDateRange(item.start, item.end),
        minimumPurchaseAmount: undefined,
        usageCount: undefined,
        creationDate: item.start ? formatDate(item.start) : undefined,
        rowNumber: item.rowNumber ?? 0,
      };
    }) ?? [];

  const totalItems = apiResponse?.totalCount ?? 0;
  const totalPages = calculateTotalPages(totalItems, pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue, sortBy]);

  const handleAddCode = () => {
    router.push('/dashboard/discount-codes/add');
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/discount-codes/${id}/edit`);
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);

  const deleteDiscountCodeMutation = useMutation({
    mutationFn: (discountId: number) =>
      AdminDashboardService.apiServicesAppAdmindashboardDeletediscountcodeDelete(
        discountId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ReactQuery.allDiscountCodes,
          debouncedSearchValue,
          lifecycleBounds,
          currentPage,
          pageSize,
        ],
      });
      setDeleteModalOpen(false);
      setSelectedCodeId(null);
    },
  });

  const handleDelete = (id: string) => {
    setSelectedCodeId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCodeId) {
      const discountId = parseInt(selectedCodeId, 10);
      if (!isNaN(discountId)) {
        deleteDiscountCodeMutation.mutate(discountId);
      }
    }
  };

  const addButton = (
    <Button
      className="flex items-center gap-2 cursor-pointer flex-row-reverse"
      size="lg"
      variant="primary"
      onClick={handleAddCode}
    >
      افزودن کد تخفیف
      <DashboardPlusIcon />
    </Button>
  );

  return (
    <>
      <HeaderDashboard headerButton={addButton} label="کد تخفیف">
        <section className="flex flex-col gap-6">
          <div className="w-full flex flex-row items-center gap-3">
            <DropdownInput
              className="flex-1"
              options={[]}
              searchPlaceholder="جستجو کد"
              type="search"
              value={searchValue}
              onInputChange={value => setSearchValue(value)}
              onValueChange={value =>
                setSearchValue(typeof value === 'string' ? value : '')
              }
            />
            <DropdownInput
              className="w-[320px] flex-shrink-0"
              options={sortOptions}
              placeholder="جدیدترین"
              type="default"
              value={sortBy}
              onValueChange={value => {
                if (typeof value === 'string') {
                  setSortBy(value);
                }
              }}
            />
          </div>

          <div className="border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-none">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[56px]">#</TableHead>
                    <TableHead>کد تخفیف</TableHead>
                    <TableHead>درصد تخفیف</TableHead>
                    <TableHead>دستیار صوتی</TableHead>
                    <TableHead>دستگاه</TableHead>
                    <TableHead>تاریخ اعتبار</TableHead>
                    <TableHead className="text-center" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <DiscountCodesTableSkeleton rows={pageSize} />
                  ) : discountCodes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="text-center text-textSecondary"
                        colSpan={7}
                      >
                        هیچ کد تخفیفی یافت نشد.
                      </TableCell>
                    </TableRow>
                  ) : (
                    discountCodes.map(code => (
                      <TableRow key={code.id}>
                        <TableCell className="text-textSecondary w-[56px] text-center">
                          {code.rowNumber || 'ثبت نشده'}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-gray-25">
                          {code.code}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-gray-25">
                          {code.percentage}%
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {code.voiceAssistants.length > 0 ? (
                              <>
                                {code.voiceAssistants
                                  .slice(0, 2)
                                  .map((va, idx) => (
                                    <Tag key={idx} size="sm">
                                      {va}
                                    </Tag>
                                  ))}
                                {code.voiceAssistants.length > 2 && (
                                  <Tag
                                    className="text-textTertiary flex items-center justify-center"
                                    size="sm"
                                  >
                                    <Asset3Icon className="w-2.5 h-2.5" />
                                  </Tag>
                                )}
                              </>
                            ) : (
                              <span className="text-textTertiary text-sm">
                                ثبت نشده
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {code.devices.length > 0 ? (
                              <>
                                {code.devices.slice(0, 1).map((device, idx) => (
                                  <Tag key={idx} size="sm">
                                    {device}
                                  </Tag>
                                ))}
                                {code.devices.length > 1 && (
                                  <Tag
                                    className="text-textTertiary flex items-center justify-center"
                                    size="sm"
                                  >
                                    <Asset3Icon className="w-2.5 h-2.5 " />
                                  </Tag>
                                )}
                              </>
                            ) : (
                              <span className="text-textTertiary text-sm">
                                ثبت نشده
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-textTertiary">
                          {code.expirationDate}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              aria-label={`ویرایش ${code.code}`}
                              className="text-primary-300 hover:text-primary-200 cursor-pointer p-1 transition-colors"
                              type="button"
                              onClick={() => handleEdit(code.id)}
                            >
                              <Edit01Icon />
                            </button>
                            <button
                              aria-label={`حذف ${code.code}`}
                              className="text-error-500 hover:text-error-400 cursor-pointer p-1 transition-colors"
                              type="button"
                              onClick={() => handleDelete(code.id)}
                            >
                              <RedTrash01Icon />
                            </button>
                          </div>
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
                  pageSize={pageSize}
                  pageSizeOptions={[10, 20, 50]}
                  totalItems={totalItems}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize: number) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
          </div>
        </section>
      </HeaderDashboard>

      <DeleteDiscountCodeModal
        isLoading={deleteDiscountCodeMutation.isPending}
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteModalOpen}
      />
    </>
  );
};

export default DiscountCodesPage;
