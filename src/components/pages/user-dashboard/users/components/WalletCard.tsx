'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Line, LineChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart/chart';
import type { ChartConfig } from '@/components/ui/chart/chart';
import { AdminDashboardService } from '@/apis';
import WalletCardSkeleton from './skeletons/WalletCardSkeleton';
import type { WalletChartPoint } from './types';
import { parseUserIdWithFallback, formatBalance } from '../utils';
import { useUserProfile } from './UserProfileContext';

const fallbackChartData: WalletChartPoint[] = [
  { label: '۱', balance: 0 },
  { label: '۲', balance: 123 },
  { label: '۳', balance: 110 },
  { label: '۴', balance: 205 },
  { label: '۵', balance: 230 },
  { label: '۶', balance: 20 },
  { label: '۷', balance: 210 },
  { label: '۸', balance: 10 },
  { label: '۹', balance: 51 },
  { label: '۱۰', balance: 61 },
  { label: '۱۱', balance: 210 },
  { label: '۱۲', balance: 8 },
  { label: '۱۳', balance: 91 },
  { label: '۱۴', balance: 110 },
  { label: '۱۵', balance: 120 },
  { label: '۱۶', balance: 300 },
];

const chartConfig = {
  balance: {
    label: 'موجودی',
    color: 'var(--color-success-400)',
  },
} satisfies ChartConfig;

const normalizeChartPoint = (
  item: unknown,
  index: number,
): WalletChartPoint | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const record = item as Record<string, unknown>;

  const rawLabel = record.label ?? record.month ?? record.index;
  const label =
    typeof rawLabel === 'string' && rawLabel.trim()
      ? rawLabel
      : rawLabel != null
        ? String(rawLabel)
        : String(index + 1);

  const rawBalance = record.balance ?? record.value;
  const balance =
    typeof rawBalance === 'number'
      ? rawBalance
      : typeof rawBalance === 'string'
        ? Number(rawBalance)
        : NaN;

  if (!Number.isFinite(balance)) {
    return null;
  }
  return { label, balance };
};

const WalletCard = () => {
  const { userId } = useUserProfile();
  const userIdNumber = parseUserIdWithFallback(userId);

  const { data, isLoading } = useQuery({
    queryKey: ['user-available-balance', userId],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetuseravailablebalanceGet(
        userIdNumber,
      ),
    enabled: !!userId && userIdNumber > 0,
  });

  const balance = data?.userBalance ?? 0;

  const chartData = useMemo(() => {
    const raw = data?.chartData;
    if (!Array.isArray(raw) || raw.length === 0) {
      return fallbackChartData;
    }

    const normalized = raw
      .map(normalizeChartPoint)
      .filter((p): p is WalletChartPoint => p != null);

    return normalized.length > 0 ? normalized : fallbackChartData;
  }, [data?.chartData]);

  return (
    <div className="w-full  p-6 overflow-visible">
      <div className="w-fit h-fit bg-surfacePrimary flex-col rounded-2xl  px-6 py-8 overflow-visible">
        <p className=" text-right text-sm font-medium text-textSecondary mb-2">
          موجودی
        </p>
        <div className="flex items-start gap-6 w-full justify-between overflow-visible">
          {isLoading ? (
            <WalletCardSkeleton />
          ) : (
            <>
              <div className="flex h-fit flex-col gap-3  ">
                <div className="flex items-end gap-1">
                  <p className="text-3xl font-semibold text-white">
                    {formatBalance(balance)}
                  </p>
                  <span className="text-sm font-semibold text-textSecondary mb-1">
                    تومان
                  </span>
                </div>
              </div>
              <div className="w-32 h-16 overflow-visible relative">
                <ChartContainer
                  className="h-full w-full overflow-visible"
                  config={chartConfig}
                >
                  <LineChart
                    data={chartData}
                    margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                  >
                    <ChartTooltip
                      content={<ChartTooltipContent hideLabel />}
                      cursor={false}
                    />
                    <Line
                      dataKey="balance"
                      dot={false}
                      stroke="var(--color-success-400)"
                      strokeWidth={2}
                      type="monotone"
                      activeDot={{
                        r: 6,
                        fill: 'var(--color-success-400)',
                        strokeWidth: 0,
                        className: 'drop-shadow-lg',
                      }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
