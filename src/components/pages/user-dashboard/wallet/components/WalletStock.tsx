'use client';

import { Line, LineChart } from 'recharts';

import { UserDashboardService } from '@/apis';
import { ApiError } from '@/apis/core/ApiError';
import type { WalletSummaryOutput } from '@/apis/models/WalletSummaryOutput';
import { GetIcon } from '@/assets/images/svg/Get';
import { InvestIcon } from '@/assets/images/svg/Invest';
import { Button } from '@/components/ui/button';
import type { ChartConfig } from '@/components/ui/chart/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart/chart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input/text-input/components/TextField';
import ReactQuery from '@/configs/react_query_keys';
import numberSeprator from '@/utils/numberSeprator';
import { rialToTomanText } from '@/utils/numberTopersian';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const chartData = [
  { label: '۱', stock: 0 },
  { label: '۲', stock: 123 },
  { label: '۳', stock: 110 },
  { label: '۴', stock: 205 },
  { label: '۵', stock: 230 },
  { label: '۶', stock: 20 },
  { label: '۶', stock: 210 },
  { label: '۶', stock: 10 },
  { label: '۶', stock: 51 },
  { label: '۶', stock: 61 },
  { label: '۶', stock: 210 },
  { label: '۶', stock: 8 },
  { label: '۶', stock: 91 },
  { label: '۶', stock: 110 },
  { label: '۶', stock: 120 },
  { label: '۷', stock: 300 },
];

const chartConfig = {
  stock: {
    label: 'موجودی',
    color: 'var(--color-success-400)',
  },
} satisfies ChartConfig;

interface WalletStockProps {
  walletData?: WalletSummaryOutput | null;
}

const WalletStock = ({ walletData }: WalletStockProps) => {
  const [investAmount, setInvestAmount] = useState('');
  const [investAmountDisplay, setInvestAmountDisplay] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [correlationId, setCorrelationId] = useState<string>('');
  const router = useRouter();
  const availableBalance = walletData?.availableBalance || 0;
  const activeProfilesCount = walletData?.activeProfilesCount || 0;
  const activeSpeakersCount = walletData?.activeSpeakersCount || 0;

  const balanceInTomans = Math.floor(availableBalance / 10);
  const formattedBalance = numberSeprator(balanceInTomans.toString());
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isModalOpen) {
      setCorrelationId(crypto.randomUUID());
    }
  }, [isModalOpen]);

  const startWalletTransactionMutation = useMutation({
    mutationFn: (data: { amount: number; correlationId: string }) => {
      return UserDashboardService.apiServicesAppUserdashboardStartwallettransactionPost(
        {
          amount: data.amount,
          correlationId: data.correlationId,
        },
      );
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [ReactQuery.paymentHistory] });
      router.push(data.startUrl || '');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error instanceof ApiError &&
          typeof error.body === 'object' &&
          error.body !== null &&
          ((error.body as any)?.error?.message ||
            (error.body as any)?.message)) ||
        (error instanceof Error && error.message) ||
        'خطایی رخ داده است';
      toast.error(errorMessage);
    },
  });

  const handleInvestClick = () => {
    if (investAmount) {
      const amount = Number(investAmount);
      startWalletTransactionMutation.mutate({
        amount,
        correlationId,
      });
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <div className="flex flex-col gap-2">
          <p className="text-textSecondary text-sm">تعداد پروفایل های فعال</p>
          <p className="text-3xl font-semibold">
            {numberSeprator(activeProfilesCount.toString())}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-textSecondary text-sm">تعداد اسپیکر های متصل</p>
          <p className="text-3xl font-semibold">
            {numberSeprator(activeSpeakersCount.toString())}
          </p>
        </div>
      </div>
      <div className="w-full mt-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-textSecondary">موجودی</p>
          <div className="flex shrink-0 items-center gap-8 justify-between">
            <div className="flex shrink-0  flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-3xl flex gap-1 items-center">
                  {formattedBalance}{' '}
                  <span className="text-xs font-semibold text-textSecondary">
                    تومان
                  </span>
                </p>
              </div>
            </div>
            <ChartContainer className="h-10 w-full" config={chartConfig}>
              <LineChart
                data={chartData}
                margin={{ left: 0, right: 0, top: 4, bottom: 4 }}
              >
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={false}
                />
                <Line
                  activeDot={{ r: 4 }}
                  dataKey="stock"
                  dot={false}
                  stroke="var(--color-success-400)"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
        <div className="w-full flex gap-2">
          <div className="w-full">
            <Button
              className="w-full flex gap-2 items-center"
              size="xl"
              onClick={() => {
                router.push('/dashboard/support/new?withdraw=true');
              }}
            >
              <GetIcon /> <span>برداشت</span>
            </Button>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-1/2 flex gap-2 items-center"
                size="xl"
                variant="secondary"
              >
                <InvestIcon /> <span className="font-semibold">واریز</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="p-7 text-right" dir="rtl">
              <DialogHeader className="flex flex-col gap-4 items-end text-right">
                <DialogTitle>واریز</DialogTitle>
                <DialogDescription>
                  لطفاً مبلغ مورد نظر برای واریز را وارد کنید.{' '}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-1.5">
                <div className="relative">
                  <Input
                    className="w-full"
                    placeholder="مبلغ"
                    type="text"
                    value={investAmountDisplay}
                    onChange={e => {
                      setInvestAmountDisplay(
                        numberSeprator(e.target.value.replace(/[^0-9]/g, '')),
                      );
                      setInvestAmount(e.target.value.replace(/[^0-9]/g, ''));
                    }}
                  />
                  <span className="absolute left-1 bg-base-black px-1 top-1/2 -translate-y-1/2 ">
                    ریال
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-400">
                  {rialToTomanText(Number(investAmount))}
                </span>
              </div>
              <DialogFooter className="w-full pt-6 ">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleInvestClick}
                >
                  واریز
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default WalletStock;
