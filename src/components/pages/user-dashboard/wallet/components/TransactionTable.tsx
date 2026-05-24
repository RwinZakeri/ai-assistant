'use client';

import { UserDashboardService } from '@/apis';
import { BalanceRangeFilter } from '@/apis/models/BalanceRangeFilter';
import { ReciveWalletIcon } from '@/assets/images/svg/ReciveWallet';
import { SendWalletIcon } from '@/assets/images/svg/SendWallet';
import { TableSkeleton } from '@/components/ui/table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import ReactQuery from '@/configs/react_query_keys';
import { formatPersianDate } from '@/utils/formatPersianDate';
import numberSeprator from '@/utils/numberSeprator';
import { useQuery } from '@tanstack/react-query';

const BALANCE_PERIOD_TO_RANGE_MAP: Record<number, BalanceRangeFilter> = {
  1: BalanceRangeFilter._2, // Year -> _2
  2: BalanceRangeFilter._1, // Month -> _1
  3: BalanceRangeFilter._0, // Week -> _0
} as const;

interface TransactionTableProps {
  sortPeriod: number;
}

const TransactionTable = ({ sortPeriod }: TransactionTableProps) => {
  const currentRange =
    BALANCE_PERIOD_TO_RANGE_MAP[sortPeriod] ?? BalanceRangeFilter._1;

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: [ReactQuery.walletBalanceTransactions, sortPeriod],
    queryFn: () => {
      return UserDashboardService.apiServicesAppUserdashboardGetuserbalancetransactionsGet(
        currentRange,
      );
    },
  });

  const transactions = transactionsData?.items || [];

  return (
    <div>
      <p className="text-lg font-semibold mb-6">تراکنش ها</p>
      {isLoading ? (
        <TableSkeleton columns={3} rows={5} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="text-textTertiary font-semibold">
              <TableHead>موضوع</TableHead>
              <TableHead>مبلغ</TableHead>
              <TableHead>تاریخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => {
                const isPositive = (transaction.amount || 0) >= 0;
                const Icon = isPositive ? ReciveWalletIcon : SendWalletIcon;
                const title = transaction.subject || 'بدون موضوع';
                const amount = transaction.amount || 0;
                const formattedAmount = `${numberSeprator(
                  Math.abs(amount).toString(),
                )} ریال`;
                const date = transaction.date
                  ? formatPersianDate(transaction.date)
                  : '-';

                return (
                  <TableRow key={index}>
                    <TableCell className="flex items-center gap-2">
                      <Icon />
                      {title}
                    </TableCell>
                    <TableCell
                      className={
                        isPositive ? 'text-success-400' : 'text-error-400'
                      }
                    >
                      {isPositive ? '+' : '-'}
                      {formattedAmount}
                    </TableCell>
                    <TableCell className="text-textSecondary">{date}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell className="text-center" colSpan={3}>
                  <p className="text-sm font-medium text-textSecondary">
                    تراکنشی ثبت نشده است
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TransactionTable;
