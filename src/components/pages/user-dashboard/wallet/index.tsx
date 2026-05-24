'use client';

import { UserDashboardService } from '@/apis';
import { BalanceRangeFilter } from '@/apis/models/BalanceRangeFilter';
import type { ChartConfig } from '@/components/ui/chart/chart';
import ReactQuery from '@/configs/react_query_keys';
import { convertApiResponseToChartData } from '@/utils/chartDataHelpers';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import HeaderDashboard from '../components/HeaderDashboard';
import Chart from '../components/chart';
import CardOverView from './components/CardOveview';
import TransactionTable from './components/TransactionTable';
import WalletStock from './components/WalletStock';

const walletChartConfig = {
  balance: {
    label: 'تراز',
    color: 'var(--color-primary-300)',
  },
} satisfies ChartConfig;

const BALANCE_PERIOD_TO_RANGE_MAP: Record<number, BalanceRangeFilter> = {
  1: BalanceRangeFilter._2,
  2: BalanceRangeFilter._1,
  3: BalanceRangeFilter._0,
} as const;

const Wallet = () => {
  const [sortPeriod, setSortPeriod] = useState(2);

  const { data: walletData } = useQuery({
    queryKey: [ReactQuery.myWallet],
    queryFn: () => {
      return UserDashboardService.apiServicesAppUserdashboardGetmywalletGet();
    },
  });

  const currentRange =
    BALANCE_PERIOD_TO_RANGE_MAP[sortPeriod] ?? BalanceRangeFilter._1;

  const { data: chartResponse, isLoading: isChartLoading } = useQuery({
    queryKey: [ReactQuery.walletBalanceChart, sortPeriod],
    queryFn: () => {
      return UserDashboardService.apiServicesAppUserdashboardGetuserbalancechartGet(
        currentRange,
      );
    },
  });

  const rangeType = (sortPeriod: number): 'yearly' | 'monthly' | 'weekly' => {
    const mapping: Record<number, 'yearly' | 'monthly' | 'weekly'> = {
      1: 'yearly',
      2: 'monthly',
      3: 'weekly',
    };
    return mapping[sortPeriod] ?? 'monthly';
  };

  const transformedChartResponse = useMemo(() => {
    if (!chartResponse) {
      return undefined;
    }

    return {
      result: {
        range: chartResponse.range || rangeType,
        unit: chartResponse.unit || 'month',
        data: chartResponse.chartData || [],
      },
    };
  }, [chartResponse, rangeType]);

  const chartData = useMemo(() => {
    if (!transformedChartResponse) {
      return undefined;
    }
    const convertedData = convertApiResponseToChartData(
      transformedChartResponse,
      rangeType(sortPeriod),
    );

    return convertedData.map(item => ({
      ...item,
      balance: item.usage || item.income || 0,
    }));
  }, [transformedChartResponse, rangeType]);

  return (
    <HeaderDashboard label="کیف پول">
      <div className="w-full flex justify-end">
        <div className="w-fit pl-8 border-l border-gray-800 flex flex-col">
          <CardOverView walletData={walletData} />
          <WalletStock walletData={walletData} />
        </div>
        <div className="w-full flex flex-col gap-12 pr-8">
          <Chart
            showTimeSelector
            chartConfig={walletChartConfig}
            data={chartData}
            dataKey="balance"
            description="مقایسه هزینه‌ها در طول زمان"
            isLoading={isChartLoading}
            rangeType={rangeType(sortPeriod)}
            sortPeriod={sortPeriod}
            title="موجودی"
            xAxisKey="month"
            onTimePeriodChange={period => setSortPeriod(period)}
          />
          <TransactionTable sortPeriod={sortPeriod} />
        </div>
      </div>
    </HeaderDashboard>
  );
};

export default Wallet;
