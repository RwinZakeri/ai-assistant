"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Button } from "@/components/ui/button-groups/button";
import { ButtonGroup } from "@/components/ui/button-groups/button-group";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart/chart";
import React, { useState } from "react";

export interface WalletChartData {
  [key: string]: string | number;
}

export interface WalletChartProps {
  data: WalletChartData[];
  dataKey: string;
  xAxisKey: string;
  title: string;
  description?: string;
  chartConfig: ChartConfig;
  showTimeSelector?: boolean;
  className?: string;
  chartHeight?: string;
  onTimePeriodChange?: (period: number) => void;
}

const WalletChart: React.FC<WalletChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  title,
  description,
  chartConfig,
  showTimeSelector = true,
  className = "",
  chartHeight = "h-60",
  onTimePeriodChange,
}) => {
  const [sort, setSort] = useState(1);

  const handleTimePeriodChange = (nextValue: React.Key) => {
    if (Number.isFinite(Number(nextValue))) {
      setSort(Number(nextValue));
      onTimePeriodChange?.(Number(nextValue));
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-6 flex justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">{title}</p>
          {description && (
            <p className="text-textSecondary text-sm">{description}</p>
          )}
        </div>
        {showTimeSelector && (
          <ButtonGroup value={sort} onValueChange={handleTimePeriodChange}>
            <Button value={1}>۱ سال</Button>
            <Button value={2}>۱ ماه</Button>
            <Button value={3}>۱ هفته</Button>
          </ButtonGroup>
        )}
      </div>
      <ChartContainer className={`w-full ${chartHeight}`} config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} stroke="var(--color-gray-800)" />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            padding={{ left: 12, right: 12 }}
          />
          <Line
            dataKey={dataKey}
            type="linear"
            stroke={chartConfig[dataKey]?.color || "var(--color-primary-300)"}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default WalletChart;
