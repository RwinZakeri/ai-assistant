"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { CalendarLeftIcon } from "@/assets/images/svg/CalendarLeft";
import { CalendarRightIcon } from "@/assets/images/svg/CalendarRight";
import { getDefaultClassNames } from "react-day-picker";
import { DayPicker } from "react-day-picker/persian";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CalendarDayButton } from "./CalendarDayButton";
import type { CalendarProps } from "./types";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "tertiary",
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-[var(--color-surfacePrimary)] group/calendar rounded-xl [--cell-size:40px] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit mx-auto", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative ",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute  top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-10 aria-disabled:opacity-50 p-0 select-none text-white hover:bg-gray-700/50 rounded-md transition-colors",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-10 aria-disabled:opacity-50 p-0 select-none text-white hover:bg-gray-700/50 rounded-md transition-colors",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center   h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium text-white text-lg",
          captionLayout === "label"
            ? "text-lg"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex ", defaultClassNames.weekdays),
        weekday: cn(
          "text-gray-400 rounded-md flex-1  text-sm-medium select-none h-[var(--cell-size)] flex items-center justify-center",
          defaultClassNames.weekday
        ),
        week: cn(
          "flex w-full mt-1 rounded-r-full rounded-l-full overflow-hidden",
          defaultClassNames.week
        ),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-[40px] p-0 text-center group/day aspect-square text-sm-regular select-none flex items-center justify-center",
          "[&[data-range-middle=true]]:w-full [&[data-range-middle=true]]:h-[40px] [&[data-range-middle=true]]:aspect-auto",
          defaultClassNames.day
        ),
        range_start: cn(
          "absolute bg-surfaceSecondary w-1/2 left-0 h-[40px] text-sm-medium  rounded-r-full ",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "bg-surfaceSecondary w-full h-[40px] text-sm-medium rounded-none",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "absolute bg-surfaceSecondary w-1/2 right-0 h-[40px] text-sm-medium  rounded-l-full ",
          defaultClassNames.range_end
        ),
        today: cn(
          " after:content=[''] after:absolute after:bottom-1 after:w-[5px] after:h-[5px] after:z-10 after:bg-primary-500 after:rounded-full rounded-3xl  hover:bg-surfaceSecondary bg-surfaceTertiary data-[selected=true]:bg-surfaceSecondary",
          defaultClassNames.today
        ),
        outside: cn(
          "text-textSecondary aria-selected:text-gray-600",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50 ",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <CalendarLeftIcon />;
          }
          if (orientation === "right") {
            return <CalendarRightIcon />;
          }
          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}
