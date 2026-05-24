import * as React from "react";

import { cn } from "@/lib/utils";

export interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  trackClassName?: string;
  indicatorClassName?: string;
  valueClassName?: string;
  valueFormatter?: (
    percentage: number,
    value: number,
    max: number
  ) => React.ReactNode;
}

export const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    {
      value,
      max = 100,
      size = 64,
      strokeWidth = 10,
      showValue = true,
      trackClassName,
      indicatorClassName,
      valueClassName,
      valueFormatter,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(value, 0), max);
    const radius = Math.max((size - strokeWidth) / 2, 0);
    const circumference = 2 * Math.PI * radius;
    const percentage = max === 0 ? 0 : (clampedValue / max) * 100;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clampedValue}
        className={cn(
          "relative w-12 h-12 inline-flex items-center justify-center text-foreground",
          className
        )}
        style={{ width: size, height: size, ...style }}
        {...props}
      >
        <svg
          className="block h-full w-full -rotate-90"
          width={size}
          height={size}
        >
          <circle
            className={cn("text-muted-foreground/20", trackClassName)}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={cn(
              "text-primary-300 transition-[stroke-dashoffset] duration-300 ease-linear",
              indicatorClassName
            )}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {children ??
          (showValue && (
            <span
              className={cn(
                "absolute text-sm font-medium text-foreground",
                valueClassName
              )}
            >
              {valueFormatter
                ? valueFormatter(percentage, clampedValue, max)
                : `${Math.round(percentage)}%`}
            </span>
          ))}
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";

export default CircularProgress;
