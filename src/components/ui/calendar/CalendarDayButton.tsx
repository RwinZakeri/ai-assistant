"use client";

import * as React from "react";
import { DayButton, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSingleDayInRange = modifiers.range_start && modifiers.range_end;
  const isSelectedSingle =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;

  return (
    <Button
      ref={ref}
      variant="tertiary"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={isSelectedSingle || isSingleDayInRange}
      data-range-start={modifiers.range_start && !isSingleDayInRange}
      data-range-end={modifiers.range_end && !isSingleDayInRange}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex items-center justify-center relative",
        "bg-transparent",
        // Default size for non-selected days
        "size-[40px] rounded-full",
        // Selected single day (including single day in range mode)
        "data-[selected-single=true]:bg-[var(--color-primary-500)] data-[selected-single=true]:text-white data-[selected-single=true]:text-sm-medium data-[selected-single=true]:size-[40px] data-[selected-single=true]:rounded-full data-[selected-single=true]:overflow-hidden",
        // Range start - circular with purple background (only when not single day)
        "data-[range-start=true]:bg-primary-500 data-[range-start=true]:!text-surfacePrimary data-[range-start=true]:rounded-full data-[range-start=true]:text-sm-medium data-[range-start=true]:size-[40px] data-[range-start=true]:overflow-hidden",
        // Range end - circular with purple background (only when not single day)
        "data-[range-end=true]:bg-[var(--color-primary-500)] data-[range-end=true]:!text-surfacePrimary data-[range-end=true]:rounded-full data-[range-end=true]:text-sm-medium data-[range-end=true]:size-[40px] data-[range-end=true]:overflow-hidden",
        // Range middle - full width rectangle with darker background
        "data-[range-middle=true]:bg-[var(--color-surfaceSecondary)] data-[range-middle=true]:w-full data-[range-middle=true]:h-[40px] data-[range-middle=true]:rounded-none data-[range-middle=true]:z-[9] data-[range-middle=true]:overflow-hidden",
        " [&>span]:text-sm-medium [&>span]:relative [&>span]:z-10",
        " transition-all duration-200",
        "data-[range-middle=true]:hover:bg-surfaceTertiary data-[range-middle=true]:hover:rounded-full ",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}
