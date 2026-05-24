'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getDateRangeForPredefinedOption,
  formatDateForBackend,
  formatPersianDate,
} from './utils';
import type { PredefinedRange } from './utils';
import { Calendar } from './Calendar';
import { DateRangeLabel } from './DateRangeLabel';
import { DateRangePresets } from './DateRangePresets';
import { DateRangeActions } from './DateRangeActions';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { DateRangePickerProps } from './types';

// function for getting todays date
function getTodayDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function formatDateRangeDisplay(
  dateRange: DateRange | undefined,
  placeholder?: string,
): string {
  if (!dateRange?.from && !dateRange?.to) {
    return placeholder || 'انتخاب تاریخ';
  }

  if (dateRange.from && dateRange.to) {
    return `${formatPersianDate(dateRange.from)} - ${formatPersianDate(
      dateRange.to,
    )}`;
  }

  if (dateRange.from) {
    return `از ${formatPersianDate(dateRange.from)}`;
  }

  return placeholder || 'انتخاب تاریخ';
}

export function DateRangePicker({
  dateRange: externalDateRange,
  onDateRangeChange: externalOnDateRangeChange,
  onConfirm,
  onCancel,
  className,
  placeholderText,
  triggerClassName,
  error,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const [confirmedDateRange, setConfirmedDateRange] = React.useState<
    DateRange | undefined
  >(externalDateRange);

  const [tempDateRange, setTempDateRange] = React.useState<
    DateRange | undefined
  >(confirmedDateRange);

  const displayDateRange =
    externalDateRange !== undefined ? externalDateRange : confirmedDateRange;

  const [selectedPredefinedRange, setSelectedPredefinedRange] =
    React.useState<PredefinedRange | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTempDateRange(displayDateRange);
      setSelectedPredefinedRange(null);
    } else {
      setTempDateRange(displayDateRange);
      setSelectedPredefinedRange(null);
    }
  }, [isOpen, displayDateRange]);

  const handlePredefinedRangeSelect = (range: PredefinedRange) => {
    setSelectedPredefinedRange(range);
    const calculatedRange = getDateRangeForPredefinedOption(range);
    setTempDateRange(calculatedRange);
  };

  const handleCalendarRangeChange = (range: DateRange | undefined) => {
    setSelectedPredefinedRange(null);
    setTempDateRange(range);
  };

  const handleConfirm = () => {
    setConfirmedDateRange(tempDateRange);

    if (externalOnDateRangeChange) {
      externalOnDateRangeChange(tempDateRange);
    }

    const formattedRange = {
      from: formatDateForBackend(tempDateRange?.from),
      to: formatDateForBackend(tempDateRange?.to),
    };

    if (onConfirm) {
      onConfirm(formattedRange);
    }

    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempDateRange(displayDateRange);
    setSelectedPredefinedRange(null);

    if (onCancel) {
      onCancel();
    }

    setIsOpen(false);
  };

  const displayText = formatDateRangeDisplay(displayDateRange, placeholderText);
  const isPlaceholder = !displayDateRange?.from && !displayDateRange?.to;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          aria-invalid={!!error}
          size="lg"
          variant="secondary"
          className={cn(
            'flex items-center gap-2 text-sm-medium',
            error &&
              'outline-destructive border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive',
            triggerClassName,
          )}
        >
          <CalendarIcon />
          <span
            className={cn(
              isPlaceholder ? 'text-textSecondary' : 'text-textTertiary',
            )}
          >
            {displayText}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">انتخاب بازه زمانی</DialogTitle>
        <div
          dir="rtl"
          className={cn(
            'flex flex-row bg-[var(--color-surfacePrimary)] rounded-xl h-full max-w-[544px]',
            className,
          )}
        >
          <div className="flex flex-row h-full">
            <div className="py-3 px-4">
              <DateRangePresets
                selectedRange={selectedPredefinedRange}
                onSelectRange={handlePredefinedRangeSelect}
              />
            </div>
          </div>
          <div className="border-l border-gray-700" />

          <div className="flex flex-col h-full">
            <div className="flex flex-col h-full py-5 px-6">
              <Calendar
                className="rounded-xl"
                defaultMonth={tempDateRange?.from || getTodayDate()}
                mode="range"
                selected={tempDateRange}
                onSelect={handleCalendarRangeChange}
              />
              <DateRangeLabel dateRange={tempDateRange} />
            </div>
            <div className="border-t border-gray-700" />
            <DateRangeActions
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
