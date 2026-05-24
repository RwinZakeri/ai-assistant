'use client';
import { UserDashboardService } from '@/apis';
import { Pagination } from '@/components/ui/pagination/index';
import ReactQuery from '@/configs/react_query_keys';
import { LifecycleBounds } from '@/enums/enum';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import HeaderDashboard from '../components/HeaderDashboard';
import OrderTable from './components/orderTable';
import SearchBar from './components/searchBar';

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortValue, setSortValue] = useState<string>();
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearchValue = useDebounce(searchValue, 400);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const lifecycleBounds = useMemo(() => {
    if (sortValue === 'all') {
      return undefined;
    }
    const sortNum = Number(sortValue);
    return sortNum === LifecycleBounds.Newest ||
      sortNum === LifecycleBounds.Oldest
      ? (sortNum as any)
      : undefined;
  }, [sortValue]);

  const { data: paymentHistoryData, isLoading } = useQuery({
    queryKey: [
      ReactQuery.paymentHistory,
      currentPage,
      pageSize,
      lifecycleBounds,
      debouncedSearchValue,
    ],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetmypaymenthistoriesPost(
        {
          maxResultCount: pageSize,
          skipCount: (currentPage - 1) * pageSize,
          filter: debouncedSearchValue || undefined,
          sorting:
            lifecycleBounds !== undefined
              ? lifecycleBounds.toString()
              : undefined,
        },
      ),
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [lifecycleBounds, debouncedSearchValue]);

  const paymentHistories = paymentHistoryData?.items ?? [];
  const totalCount = paymentHistoryData?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <HeaderDashboard label="تاریخچه خرید">
      <SearchBar
        searchValue={searchValue}
        sortValue={sortValue}
        onSearchChange={setSearchValue}
        onSortChange={setSortValue}
      />
      <OrderTable data={paymentHistories} isLoading={isLoading} />
      {!isLoading && paymentHistories.length > 0 && totalCount > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalCount}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </HeaderDashboard>
  );
};

export default History;
