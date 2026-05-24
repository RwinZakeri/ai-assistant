"use client";

import { cn } from "@/lib/utils";
import type { DateRangePresetsProps } from "./types";
import { PredefinedRange } from "./utils";

const PREDEFINED_OPTIONS: { key: PredefinedRange; label: string }[] = [
  { key: "today", label: "امروز" },
  { key: "yesterday", label: "دیروز" },
  { key: "currentWeek", label: "هفته جاری" },
  { key: "lastWeek", label: "هفته گذشته" },
  { key: "currentMonth", label: "ماه جاری" },
  { key: "lastMonth", label: "ماه گذشته" },
  { key: "currentYear", label: "سال جاری" },
  { key: "lastYear", label: "سال گذشته" },
  { key: "all", label: "همه" },
];

export function DateRangePresets({
  selectedRange,
  onSelectRange,
  className,
}: DateRangePresetsProps) {
  return (
    <div
      className={cn("flex flex-col gap-1 px min-w-[160px]", className)}
      dir="rtl"
    >
      {PREDEFINED_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onSelectRange(option.key)}
          className={cn(
            "px-4 py-[10px] rounded-lg text-right text-sm font-medium transition-colors",
            "text-white cursor-pointer",
            selectedRange === option.key
              ? "bg-surfaceSecondary"
              : "hover:bg-surfaceSecondary"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
