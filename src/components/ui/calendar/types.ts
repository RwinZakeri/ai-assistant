import type * as React from 'react';
import type { DateRange } from 'react-day-picker';
import type { DayPicker } from 'react-day-picker/persian';
import type { Button } from '@/components/ui/button';
import type { PredefinedRange } from './utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
};

export interface DateRangeLabelProps {
  dateRange: DateRange | undefined;
  className?: string;
}

export interface DateRangePresetsProps {
  selectedRange: PredefinedRange | null;
  onSelectRange: (range: PredefinedRange) => void;
  className?: string;
}

export interface FormattedDateRange {
  from: string | null;
  to: string | null;
}

export interface DateRangePickerProps {
  /** External date range state (optional - component manages its own state if not provided) */
  dateRange?: DateRange | undefined;
  /** Callback when date range changes */
  onDateRangeChange?: (range: DateRange | undefined) => void;
  /** Callback when user confirms the selection */
  onConfirm?: (range: FormattedDateRange) => void;
  /** Callback when user cancels the selection */
  onCancel?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Initial placeholder text to display when no date range is selected */
  placeholderText?: string;
  /** Custom className for the trigger button (input modal) */
  triggerClassName?: string;
  /** Error message to display */
  error?: string;
}
