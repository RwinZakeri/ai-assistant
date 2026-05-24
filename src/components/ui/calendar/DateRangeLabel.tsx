'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatPersianDate } from './utils';
import type { DateRangeLabelProps } from './types';

export function DateRangeLabel({ dateRange, className }: DateRangeLabelProps) {
  return (
    <div
      className={cn('flex items-center gap-3 justify-center mt-4', className)}
      dir="rtl"
    >
      <Button className={cn('px-[14px] text-md-regular')} variant="secondary">
        {formatPersianDate(dateRange?.from)}
      </Button>
      <span className="text-textSecondary">-</span>
      <Button className={cn('px-[14px] text-md-regular')} variant="secondary">
        {formatPersianDate(dateRange?.to)}
      </Button>
    </div>
  );
}
