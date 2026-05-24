'use client';

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Button } from '@/components/ui/button-groups/button';
import { ButtonGroup } from '@/components/ui/button-groups/button-group';
import { ChartContainer } from '@/components/ui/chart/chart';
import { convertApiResponseToChartData } from '@/utils/chartDataHelpers';
import React, { useMemo, useState } from 'react';
import ChartSkeleton from './ChartSkeleton';
import type { ChartProps } from './type';

const Chart: React.FC<ChartProps> = ({
  data: propData,
  dataKey,
  xAxisKey,
  title,
  description,
  chartConfig,
  showTimeSelector = true,
  className = '',
  chartHeight = 'h-60',
  onTimePeriodChange,
  isLoading: propIsLoading,
  chartResponse,
  rangeType: propRangeType,
  sortPeriod: propSortPeriod,
}) => {
  const [internalSortPeriod, setInternalSortPeriod] = useState(2);
  const sortPeriod = propSortPeriod ?? internalSortPeriod;

  const rangeType = useMemo(() => {
    if (propRangeType) {
      return propRangeType;
    }
    if (sortPeriod === 1) {
      return 'yearly';
    }
    if (sortPeriod === 2) {
      return 'monthly';
    }
    if (sortPeriod === 3) {
      return 'weekly';
    }
    return 'monthly';
  }, [sortPeriod, propRangeType]);

  const chartData = useMemo(() => {
    if (propData && propData.length > 0) {
      return propData;
    }
    if (chartResponse) {
      return convertApiResponseToChartData(
        chartResponse as Record<string, unknown>,
        rangeType,
      );
    }
    return [];
  }, [propData, chartResponse, rangeType]);

  const isLoading = propIsLoading ?? false;

  const dynamicXAxisKey = useMemo(() => {
    // Check propData first if available
    if (propData && propData.length > 0) {
      const firstKey = Object.keys(propData[0]).find(
        key => key !== 'usage' && key !== 'income' && key !== 'balance',
      );
      return firstKey || xAxisKey;
    }
    // Fallback to chartData
    if (chartData.length > 0) {
      const firstKey = Object.keys(chartData[0]).find(
        key => key !== 'usage' && key !== 'income' && key !== 'balance',
      );
      return firstKey || xAxisKey;
    }
    return xAxisKey;
  }, [propData, chartData, xAxisKey]);

  const handleTimePeriodChange = (nextValue: React.Key) => {
    if (Number.isFinite(Number(nextValue))) {
      const period = Number(nextValue) as number;
      if (!propSortPeriod) {
        setInternalSortPeriod(period);
      }
      onTimePeriodChange?.(period);
    }
  };

  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];

  if (isLoading && !propData && !chartResponse) {
    return (
      <ChartSkeleton
        chartHeight={chartHeight}
        className={className}
        showTimeSelector={showTimeSelector}
      />
    );
  }

  return (
    <div className={`w-full ${className} border-none flex flex-col gap-12`}>
      <div className="mb-6 flex justify-between mx-3 border-b border-gray-800 pb-6">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">{title}</p>
          {description && (
            <p className="text-textSecondary text-sm">{description}</p>
          )}
        </div>
        {showTimeSelector && (
          <ButtonGroup
            value={sortPeriod}
            onValueChange={handleTimePeriodChange}
          >
            <Button className="cursor-pointer" value={1}>
              ۱ سال
            </Button>
            <Button className="cursor-pointer" value={2}>
              ۱ ماه
            </Button>
            <Button className="cursor-pointer" value={3}>
              ۱ هفته
            </Button>
          </ButtonGroup>
        )}
      </div>

      <div className="w-full" dir="rtl">
        <ChartContainer
          className={`w-full ${chartHeight}`}
          config={chartConfig}
        >
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid stroke="var(--color-gray-800)" vertical={false} />
            <XAxis
              reversed
              angle={sortPeriod === 2 ? -45 : 0}
              axisLine={false}
              dataKey={dynamicXAxisKey}
              height={sortPeriod === 2 ? 60 : 40}
              interval={0}
              padding={{ left: 30, right: 30 }}
              textAnchor={sortPeriod === 2 ? 'end' : 'middle'}
              tickLine={false}
              tickMargin={8}
            />
            {dataKeys.map(key => (
              <Line
                key={key}
                dataKey={key}
                dot={false}
                stroke={chartConfig[key]?.color || 'var(--color-primary-300)'}
                strokeWidth={2}
                type="linear"
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default Chart;
