'use client';

import {
  AdminDashboardService,
  CategoriesService,
  LanguageService,
  UserDashboardService,
} from '@/apis';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/input/dropdown-input';
import { Input } from '@/components/ui/input/text-input/components/TextField';
import { Pagination } from '@/components/ui/pagination/index';
import { TableBody, TableCell, TableSkeleton } from '@/components/ui/table';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import ReactQuery from '@/configs/react_query_keys';
import { AssistantLogRange } from '@/enums/enum';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { adminDashboardTableHeaders, dashboardChartConfig } from '../../type';
import Chart from '../chart';
import { PERIOD_TO_RANGE_MAP } from '../chart/type';
import DashboardBoxs from '../dashboardDataBox/boxes';

const DashboardAdminPage = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortPeriod, setSortPeriod] = useState(2);

  const searchTitleDebounced = useDebounce(searchTitle, 500);

  const { permissions } = useAppSelector(state => state.userPermissions);
  const isAdminUser = useMemo(
    () => permissions && permissions?.length > 0,
    [permissions],
  );

  const currentRange =
    PERIOD_TO_RANGE_MAP[sortPeriod] ?? AssistantLogRange.Month;

  const chartSerivce = isAdminUser
    ? AdminDashboardService.apiServicesAppAdmindashboardGetalluserquestionschartdataPost
    : UserDashboardService.apiServicesAppUserdashboardGetassistantquestionstimeseriesPost;

  const { data: chartResponse, isLoading: isChartLoading } = useQuery({
    queryKey: [ReactQuery.assistantChartData, sortPeriod, isAdminUser],
    queryFn: () => chartSerivce({ range: currentRange }),
  });

  const getRangeType = (
    sortPeriod: number,
  ): 'yearly' | 'monthly' | 'weekly' => {
    const mapping: Record<number, 'yearly' | 'monthly' | 'weekly'> = {
      1: 'yearly',
      2: 'monthly',
      3: 'weekly',
    };
    return mapping[sortPeriod] ?? 'monthly';
  };

  const rangeType = getRangeType(sortPeriod);

  const { data: adminAssistantsData, isLoading: isAdminAssistantsLoading } =
    useQuery({
      queryKey: [
        ReactQuery.allAssistants,
        searchTitleDebounced,
        statusFilter,
        categoryFilter,
        languageFilter,
        currentPage,
        pageSize,
      ],
      queryFn: () => {
        return AdminDashboardService.apiServicesAppAdmindashboardGetallassistantsbyadminPost(
          {
            maxResultCount: pageSize,
            skipCount: (currentPage - 1) * pageSize,
            title: searchTitleDebounced || undefined,
            isActive:
              statusFilter === 'all'
                ? undefined
                : statusFilter === 'true'
                  ? true
                  : false,
            categoryId:
              categoryFilter && categoryFilter !== 'all'
                ? Number(categoryFilter)
                : undefined,
            languageId:
              languageFilter && languageFilter !== 'all'
                ? Number(languageFilter)
                : undefined,
          },
        );
      },
    });

  const queriesResult = useQueries({
    queries: [
      {
        queryKey: [ReactQuery.allAssistanceCategories],
        queryFn: () =>
          CategoriesService.apiServicesAppCategoriesGetallassistantcategoriesGet(),
      },
      {
        queryKey: [ReactQuery.allLanguages],
        queryFn: () =>
          LanguageService.apiServicesAppLanguageAppgetlanguagesGet(),
      },
    ],
  });

  const categories = queriesResult[0]?.data ?? [];
  const languages = queriesResult[1]?.data ?? [];

  const statusOptions = useMemo(
    () => [
      { value: 'true', label: 'فعال' },
      { value: 'false', label: 'غیر فعال' },
    ],
    [],
  );

  const categoryOptions = useMemo(
    () =>
      categories
        .map(cat => ({
          value: cat.category?.id?.toString() || '',
          label: cat.category?.title || '',
        }))
        .filter(cat => cat.value && cat.label),
    [categories],
  );

  const languageOptions = useMemo(
    () =>
      languages
        .map(lang => ({
          value: lang.id?.toString() || '',
          label: lang.displayName || lang.name || '',
        }))
        .filter(lang => lang.value && lang.label),
    [languages],
  );

  const { data: dashboardSubscription } = useAppSelector(
    state => state.dashboardSubscription,
  );
  const usedPercentage = dashboardSubscription?.usedSubPercentage ?? 0;

  const totalCount = adminAssistantsData?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle, statusFilter, categoryFilter, languageFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="pt-10 flex flex-col gap-16">
        <div className={cn('grid grid-cols-1 gap-6')}>
          <div className="lg:col-span-11 flex flex-col h-full justify-between gap-6">
            <DashboardBoxs />
            <div className="w-full rounded-xl">
              <Chart
                showTimeSelector
                chartConfig={dashboardChartConfig}
                chartResponse={chartResponse}
                className="border-none"
                dataKey={['usage', 'income']}
                isLoading={isChartLoading}
                rangeType={rangeType}
                sortPeriod={sortPeriod}
                title="سؤال‌های پرسیده شده"
                xAxisKey="month"
                onTimePeriodChange={period => setSortPeriod(period)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <p className="text-lg font-semibold">دستیارهای صوتی فعال</p>
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="w-full md:col-span-4">
              <Input
                className="w-full"
                placeholder="جستجو نام"
                type="text"
                value={searchTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTitle(e.target.value)
                }
              />
            </div>
            <div className="w-full md:col-span-2">
              <Select
                value={statusFilter === 'all' ? undefined : statusFilter}
                onValueChange={value => setStatusFilter(value || 'all')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:col-span-2">
              <Select
                value={categoryFilter === 'all' ? undefined : categoryFilter}
                onValueChange={value => setCategoryFilter(value || 'all')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:col-span-2">
              <Select
                value={languageFilter === 'all' ? undefined : languageFilter}
                onValueChange={value => setLanguageFilter(value || 'all')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="انتخاب زبان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {languageOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {isAdminAssistantsLoading ? (
            <TableSkeleton columns={7} rows={5} />
          ) : !adminAssistantsData?.items?.length ? (
            <div className="border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-textSecondary">دستیاری یافت نشد.</p>
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    {adminDashboardTableHeaders.map((header, index) => (
                      <TableHead key={header.id + index}>
                        {header.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminAssistantsData.items.map(assistant => (
                    <TableRow key={assistant.rowNumber}>
                      <TableCell className="text-textSecondary">
                        {assistant.rowNumber ?? '-'}
                      </TableCell>
                      <TableCell className="font-medium text-textTertiary">
                        {assistant.persianName || '-'}
                      </TableCell>
                      <TableCell className="text-gray-25">
                        {assistant.englishName || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          size="sm"
                          variant={assistant.isActive ? 'success' : 'error'}
                        >
                          {assistant.isActive ? 'فعال' : 'غیر فعال'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-textSecondary">
                        {assistant.userDescription || '-'}
                      </TableCell>
                      <TableCell>
                        {assistant.category?.title ? (
                          <Badge size="sm" variant="primary">
                            {assistant.category.title}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {assistant.languages &&
                        assistant.languages.length > 0 ? (
                          <div className="flex gap-1 overflow-x-auto">
                            {assistant.languages.map((lang, index) => (
                              <Badge
                                key={lang.id || index}
                                className="whitespace-nowrap"
                                size="sm"
                                variant="gray"
                              >
                                {lang.title || '-'}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalCount > 0 && (
                <div className="mt-4">
                  <Pagination
                    className="w-full"
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={totalCount}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardAdminPage;
