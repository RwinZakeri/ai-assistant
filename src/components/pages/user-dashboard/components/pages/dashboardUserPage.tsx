'use client';

import { AdminDashboardService, UserDashboardService } from '@/apis';
import { FlashIcon } from '@/assets/images/svg/Flash';
import { Button } from '@/components/ui/button';
import CardSkeleton from '@/components/ui/cards/CardSkeleton';
import VoiceDashboardCard from '@/components/ui/cards/voice-assistants/dashboard-card';
import { CircularProgress } from '@/components/ui/progress';
import ReactQuery from '@/configs/react_query_keys';
import { AssistantLogRange } from '@/enums/enum';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';
import getFileUrl from '@/utils/getFileUrl';
import { useQuery } from '@tanstack/react-query';
import { useId, useMemo, useState } from 'react';
import { dashboardChartConfig } from '../../type';
import Chart from '../chart';
import { PERIOD_TO_RANGE_MAP } from '../chart/type';
import DashboardBoxs from '../dashboardDataBox/boxes';

const DashboardUserPage = () => {
  const skeletonId = useId();
  const cardListId = useId();
  const [sortPeriod, setSortPeriod] = useState(2);

  const { data: allActiveAssitance, isLoading } = useQuery({
    queryKey: [ReactQuery.allAssistantForCurrentUser],
    queryFn: () => {
      return UserDashboardService.apiServicesAppUserdashboardGetallactiveassistantsforcurrentuserPost(
        {
          maxResultCount: 1000000,
          skipCount: 0,
        },
      );
    },
  });

  const { permissions } = useAppSelector(state => state.userPermissions);
  const isAdminUser = useMemo(
    () => permissions && permissions?.length > 0,
    [permissions],
  );

  const currentRange =
    PERIOD_TO_RANGE_MAP[sortPeriod] ?? AssistantLogRange.Month;

  const callSerivce = isAdminUser
    ? AdminDashboardService.apiServicesAppAdmindashboardGetalluserquestionschartdataPost
    : UserDashboardService.apiServicesAppUserdashboardGetassistantquestionstimeseriesPost;

  const { data: chartResponse, isLoading: isChartLoading } = useQuery({
    queryKey: [ReactQuery.assistantChartData, sortPeriod, isAdminUser],
    queryFn: () =>
      callSerivce({
        range: currentRange,
      }),
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

  const { data: dashboardSubscription } = useAppSelector(
    state => state.dashboardSubscription,
  );
  const usedPercentage = dashboardSubscription?.usedSubPercentage ?? 0;

  return (
    <>
      <div className="pt-10 flex flex-col gap-16">
        <div className={cn('grid grid-cols-1 gap-6 lg:grid-cols-15')}>
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

          <div className="lg:col-span-4 w-full min-w-[320px] flex flex-col gap-6 border border-gray-800 rounded-xl">
            <div className="flex flex-col px-6  py-5 gap-1 pb-5 mb-2 border-b border-gray-800">
              <p className="text-lg text-gray-25 font-semibold">
                {dashboardSubscription?.assistantTitle || 'اشتراک دستیار پزشک'}
              </p>
              <p className="text-sm font-medium text-textSecondary">
                ٪{usedPercentage} از اشتراک شما مصرف شده است
              </p>
            </div>

            <div className="flex flex-col justify-center px-6 gap-8">
              <div className="w-fit mx-auto">
                <CircularProgress
                  showValue
                  indicatorClassName="text-primary-300"
                  max={100}
                  size={200}
                  strokeWidth={16}
                  trackClassName="text-gray-800"
                  value={usedPercentage}
                  valueClassName="text-3xl font-bold text-gray-25"
                  valueFormatter={percentage => `${Math.round(percentage)}%`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg text-gray-25 font-semibold">
                  به اتمام اشتراک خود نزدیک شدید{' '}
                </p>
                <p className="text-sm font-medium text-textSecondary">
                  شما از {usedPercentage} درصد اشتراک خود استفاده کرده اید. جهت
                  استفاده از دستیار صوتی اشتراک خود را تمدید کنید.
                </p>
              </div>
            </div>
            <div className="py-4 border-t px-6 text-left border-gray-800">
              <Button size="sm" variant="secondary">
                <FlashIcon />
                تمدید اشتراک
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <p className="text-lg font-semibold">دستیارهای صوتی فعال</p>
        <div
          className="grid gap-4 md:grid-cols-2
        lg:grid-cols-2
        xl:grid-cols-3 
        2xl:grid-cols-4"
        >
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <CardSkeleton key={`${skeletonId}-${index}`} />
              ))}
            </>
          ) : !allActiveAssitance?.items?.length ? (
            <p className="col-span-3 text-center text-textSecondary">
              دستیاری یافت نشد.
            </p>
          ) : (
            allActiveAssitance.items.map((card, index) => {
              return (
                <VoiceDashboardCard
                  key={`${cardListId}-${card.id || index}`}
                  badge={card.isActive ?? false}
                  category={card.category?.title || ''}
                  daysLeft={card.subDaysLeft}
                  description={card.description || ''}
                  percentage={card.subUsedPercentage}
                  progressLabel="اشتراک فعال"
                  subscriptionType={(card.subType as 0 | 1 | 2) ?? 0}
                  title={card.title || ''}
                  badges={
                    card.supportingTones?.map(tone => tone.title || '') || []
                  }
                  imageSrc={
                    getFileUrl(card.thumbnail) || '/images/product1.png'
                  }
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardUserPage;
