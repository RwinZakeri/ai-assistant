'use client';

import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { DateRangePicker } from '@/components/ui/calendar/DateRangePicker';
import { useQuery } from '@tanstack/react-query';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { handleSearchInputChange, handleSearchKeyDown } from '../utils';
import { STATUS_OPTIONS } from '../constants';
import type { DateRange } from 'react-day-picker';

interface OrdersFiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  deviceModelValue?: string;
  onDeviceModelChange?: (value: string) => void;
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export default function OrdersFilters({
  searchValue,
  onSearchChange,
  deviceModelValue,
  onDeviceModelChange,
  statusValue,
  onStatusChange,
  dateRange,
  onDateRangeChange,
}: OrdersFiltersProps) {
  const { data: deviceModels = [] } = useQuery({
    queryKey: [ReactQuery.allSpeakerDeviceModels],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallspeakerdevicemodelsGet(),
  });

  const deviceModelOptions = deviceModels.map(model => ({
    value: model,
    label: model,
  }));

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 mb-6">
      <DropdownInput
        className="w-full"
        options={[]}
        placeholder="جستجو شماره سفارش"
        searchPlaceholder="جستجو شماره سفارش"
        type="search"
        value={searchValue}
        onInputChange={value => handleSearchInputChange(value, onSearchChange)}
        onKeyDown={handleSearchKeyDown}
      />
      <DropdownInput
        className="w-full"
        options={deviceModelOptions}
        placeholder="انتخاب مدل دستگاه"
        type="default"
        value={deviceModelValue}
        onValueChange={value => onDeviceModelChange?.(value as string)}
      />
      <DropdownInput
        className="w-full"
        options={STATUS_OPTIONS}
        placeholder="انتخاب وضعیت"
        type="default"
        value={statusValue}
        onValueChange={value => onStatusChange?.(value as string)}
      />

      <DateRangePicker
        dateRange={dateRange}
        placeholderText="انتخاب روز ارسال"
        triggerClassName="w-full justify-start text-textSecondary"
        onDateRangeChange={onDateRangeChange}
      />
    </div>
  );
}
