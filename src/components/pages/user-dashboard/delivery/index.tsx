'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import HeaderDashboard from '@/components/pages/user-dashboard/components/HeaderDashboard';
import { Button } from '@/components/ui/button';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import { Edit01Icon } from '@/assets/images/svg/Edit01';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import DeleteDeliveryTimeModal from './components/DeleteDeliveryTimeModal';
import { sortOptions } from './constants';
import { DashboardPlusIcon } from '@/assets/images/svg/DashboardPlus';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { LifecycleBounds } from '@/enums/enum';
import type { GetAllDeliveringHoursOutput } from '@/apis';
import { formatNumberWithCommas } from './utils';
import { useDebounce } from '@/hooks/useDebounce';
import { dayOfWeekLabels } from './components/types';
import type { DeliveryTimeItem } from './components/types';
import DeliveryTableSkeleton from './components/skeletons/DeliveryTableSkeleton';

const DeliveryTimeListPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState(String(LifecycleBounds.Newest));
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearchValue = useDebounce(searchValue, 400);

  const lifecycleBounds = useMemo(() => {
    const sortNum = Number(sortValue);
    return sortNum === LifecycleBounds.Newest ||
      sortNum === LifecycleBounds.Oldest
      ? sortNum
      : undefined;
  }, [sortValue]);

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      ReactQuery.allDeliveringHours,
      debouncedSearchValue,
      lifecycleBounds,
    ],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetalldeliveringhoursGet(
        debouncedSearchValue || undefined,
        lifecycleBounds,
      ),
  });

  useEffect(() => {
    refetch();
  }, [lifecycleBounds, refetch]);

  const deliveryTimes: DeliveryTimeItem[] = useMemo(() => {
    if (!apiResponse || !Array.isArray(apiResponse)) {
      return [];
    }

    return apiResponse.map((item: GetAllDeliveringHoursOutput) => {
      const day = item.day !== undefined ? dayOfWeekLabels[item.day] || '' : '';
      const timeRange =
        item.fromTime && item.toTime ? `${item.fromTime} - ${item.toTime}` : '';
      const cost = item.price
        ? `${formatNumberWithCommas(item.price)} تومان`
        : '';

      return {
        id: item.id || 0,
        day,
        timeRange,
        cost,
        rowNumber: item.rowNumber || 0,
      };
    });
  }, [apiResponse]);

  const totalItems = deliveryTimes.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = deliveryTimes.slice(startIndex, startIndex + pageSize);

  const handleAddClick = () => {
    router.push('/dashboard/delivery/add');
  };

  const handleEditClick = (id: number) => {
    router.push(`/dashboard/delivery/edit/${id}`);
  };

  const deleteDeliveryTimeMutation = useMutation({
    mutationFn: (deliveryHourId: number) =>
      AdminDashboardService.apiServicesAppAdmindashboardDeletedeliveryhourbyidDelete(
        deliveryHourId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ReactQuery.allDeliveringHours,
          debouncedSearchValue,
          lifecycleBounds,
        ],
      });
      setDeleteModalOpen(false);
      setSelectedId(null);
    },
  });

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedId !== null) {
      deleteDeliveryTimeMutation.mutate(selectedId);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <>
      <HeaderDashboard
        label="زمان ارسال"
        actionButton={
          <Button size="lg" variant="primary" onClick={handleAddClick}>
            <DashboardPlusIcon />
            افزودن زمان ارسال
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="w-full flex flex-row items-center gap-3">
            <DropdownInput
              className="flex-1"
              options={[]}
              searchPlaceholder="جستجو مورد"
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
              value={sortValue}
              onValueChange={value => {
                if (typeof value === 'string') {
                  setSortValue(value);
                  setCurrentPage(1);
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
                    <TableHead className="w-1/4 text-right">روز</TableHead>
                    <TableHead className="w-1/4 text-right">
                      بازه زمانی
                    </TableHead>
                    <TableHead className="w-1/4 text-right">هزینه</TableHead>
                    <TableHead className="w-[136px] text-center" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <DeliveryTableSkeleton rows={pageSize} />
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-textSecondary w-[56px]">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-gray-25 text-right">
                          {item.day}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-gray-25 text-right">
                          {item.timeRange}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-textTertiary text-right">
                          {item.cost}
                        </TableCell>
                        <TableCell className="w-[136px]">
                          <div className="flex items-center gap-4 justify-center">
                            <button
                              aria-label="ویرایش"
                              className="text-primary-300 hover:text-primary-200 transition-colors cursor-pointer"
                              onClick={() => handleEditClick(item.id)}
                            >
                              <Edit01Icon />
                            </button>
                            <button
                              aria-label="حذف"
                              className="text-error-500 hover:text-error-400 transition-colors cursor-pointer"
                              onClick={() => handleDeleteClick(item.id)}
                            >
                              <RedTrash01Icon />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        className="text-center text-textSecondary"
                        colSpan={5}
                      >
                        <p className="text-sm font-medium text-textSecondary">
                          هیچ زمان ارسالی یافت نشد
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </HeaderDashboard>

      <DeleteDeliveryTimeModal
        isLoading={deleteDeliveryTimeMutation.isPending}
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteModalOpen}
      />
    </>
  );
};

export default DeliveryTimeListPage;
