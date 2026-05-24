import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface SubscriptionProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  daysLeft: number;
  percentage: number;
  width?: number | string;
  height?: number | string;
}

export const SubscriptionProgress: React.FC<SubscriptionProgressProps> = ({
  label,
  daysLeft,
  percentage,
  className,
  style,
  width,
  height = 48,
  ...props
}) => {
  const resolvedWidth =
    width !== undefined
      ? typeof width === "number"
        ? `${width}px`
        : width
      : undefined;
  const resolvedHeight =
    typeof height === "number" ? `${height}px` : height ?? undefined;

  return (
    <div
      className={cn("h-12 w-full", className)}
      style={{ width: resolvedWidth, height: resolvedHeight, ...style }}
      {...props}
    >
      {/* ========Header with label and days left========= */}
      <div className="flex justify-between items-center mb-2">
        {/* ========Label========= */}
        <div className="text-base-white text-sm-demibold">{label}</div>
        {/* ========Days left========= */}
        <div className="text-primary-300 ttext-sm-demibold">
          {daysLeft} روز مانده
        </div>
      </div>

      {/* ========Progress bar container========= */}
      <div className="flex items-center gap-3">
        {/* ========Percentage display========= */}
        <div className="text-gray-300 text-sm-medium ">{percentage}٪</div>
        <div className="flex-1 w-full">
          <ProgressPrimitive.Root
            className="relative overflow-hidden bg-surfaceTertiary rounded-full w-full h-2"
            value={percentage}
          >
            <ProgressPrimitive.Indicator
              className="h-full w-full bg-primary-300 transition-transform rounded-full duration-300 ease-in-out"
              style={{ transform: `translateX(-${100 - percentage}%)` }}
            />
          </ProgressPrimitive.Root>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionProgress;

export { CircularProgress } from "./circular-progress";
export type { CircularProgressProps } from "./circular-progress";
