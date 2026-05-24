import type { ChartConfig } from '@/components/ui/chart/chart';
import { AssistantLogRange } from '@/enums/enum';

export interface ChartData {
  [key: string]: string | number;
}

export interface ChartProps {
  data?: ChartData[];
  dataKey: string | string[];
  xAxisKey: string;
  title: string;
  description?: string;
  chartConfig: ChartConfig;
  showTimeSelector?: boolean;
  className?: string;
  chartHeight?: string;
  onTimePeriodChange?: (period: number) => void;
  isLoading?: boolean;
  chartResponse?: Record<string, unknown>;
  rangeType?: 'yearly' | 'monthly' | 'weekly';
  sortPeriod?: number;
}

export type PeriodToRangeMap = Record<number, number>;

export const PERIOD_TO_RANGE_MAP: PeriodToRangeMap = {
  1: AssistantLogRange.Year,
  2: AssistantLogRange.Month,
  3: AssistantLogRange.Week,
} as const;
