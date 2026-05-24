'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Percent } from 'lucide-react';
import { TextInput } from '@/components/ui/input/text-input';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import {
  DateRangePicker,
  formatDateForBackend,
  formatDateWithTimeForBackend,
} from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import type { DateRange } from 'react-day-picker';
import { persianToEnglish } from '@/utils/persianToEnglish';
import FormFieldGroup from '../../account/components/FormFieldGroup';
import { discountCodeSchema } from '../schemas';
import type { DiscountCodeFormData } from '../schemas';

interface DiscountCodeFormProps {
  initialData?: DiscountCodeFormData;
  onSubmit: (data: DiscountCodeFormData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  voiceAssistantOptions?: Array<{ value: string; label: string }>;
  deviceOptions?: Array<{ value: string; label: string }>;
}

const DiscountCodeForm: React.FC<DiscountCodeFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  isEdit = false,
  voiceAssistantOptions = [],
  deviceOptions = [],
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<DiscountCodeFormData>({
    resolver: zodResolver(discountCodeSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      code: '',
      percentage: 1,
      voiceAssistants: [],
      devices: [],
      startDate: null,
      endDate: null,
    },
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [percentageValue, setPercentageValue] = useState<string>(
    initialData?.percentage ? String(initialData.percentage) : '1',
  );

  const code = watch('code');
  const percentage = watch('percentage');
  const voiceAssistants = watch('voiceAssistants');
  const devices = watch('devices');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const parseBackendDateToLocalDate = (
    dateStr?: string | null,
  ): Date | undefined => {
    if (!dateStr) {
      return undefined;
    }
    const normalized = String(dateStr).split('T')[0].replace(/\//g, '-');
    const parts = normalized.split('-').map(Number);
    if (parts.length === 3 && parts.every(n => Number.isFinite(n))) {
      const [y, m, d] = parts;
      if (y && m && d) {
        const local = new Date(y, m - 1, d);
        return isNaN(local.getTime()) ? undefined : local;
      }
    }
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? undefined : fallback;
  };

  useEffect(() => {
    if (initialData) {
      setValue('code', initialData.code);
      setValue('percentage', initialData.percentage);
      setPercentageValue(String(initialData.percentage));
      setValue('voiceAssistants', initialData.voiceAssistants);
      setValue('devices', initialData.devices);
      setValue('startDate', initialData.startDate);
      setValue('endDate', initialData.endDate);

      const from = parseBackendDateToLocalDate(initialData.startDate);
      const to = parseBackendDateToLocalDate(initialData.endDate);
      if (from || to) {
        const safeFrom = from ?? to;
        const safeTo = to ?? from ?? to;
        if (safeFrom) {
          setDateRange({ from: safeFrom, to: safeTo ?? safeFrom });
        }
      }
    }
  }, [initialData, setValue]);

  const handleFormSubmit = (data: DiscountCodeFormData) => {
    onSubmit(data);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from) {
      setValue('startDate', null, { shouldValidate: true });
      setValue('endDate', null, { shouldValidate: true });
      return;
    }

    const isSingleDay =
      !range.to ||
      (range.from.getDate() === range.to.getDate() &&
        range.from.getMonth() === range.to.getMonth() &&
        range.from.getFullYear() === range.to.getFullYear());

    if (isSingleDay) {
      const startDateWithTime = formatDateWithTimeForBackend(
        range.from,
        true,
        false,
      );
      const endDateWithTime = formatDateWithTimeForBackend(
        range.from,
        true,
        true,
      );
      setValue('startDate', startDateWithTime, { shouldValidate: true });
      setValue('endDate', endDateWithTime, { shouldValidate: true });
      return;
    }

    const from = formatDateForBackend(range.from);
    const to = formatDateForBackend(range.to);

    setValue('startDate', from, { shouldValidate: true });
    setValue('endDate', to, { shouldValidate: true });
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const englishValue = persianToEnglish(value);
    const numbersOnly = englishValue.replace(/\D/g, '');

    if (numbersOnly === '') {
      setPercentageValue('');
      setValue('percentage', 0, { shouldValidate: false });
      return;
    }

    const numValue = Number(numbersOnly);
    const limitedValue = Math.max(1, Math.min(100, numValue));

    setPercentageValue(String(limitedValue));
    setValue('percentage', limitedValue, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <section className="flex justify-center w-full">
        <div className="flex flex-col items-center gap-5 w-full justify-center">
          <FormFieldGroup
            className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
            label="کد تخفیف"
          >
            <TextInput
              className="w-[512px]"
              error={errors.code?.message}
              inputClassName="w-[512px] text-right"
              placeholder="کد تخفیف"
              {...register('code')}
            />
          </FormFieldGroup>

          <FormFieldGroup
            className="flex justify-center items-center border-b border-gray-800 pb-5"
            label="درصد تخفیف کد"
          >
            <div className="relative w-[512px]">
              <TextInput
                className="w-full"
                error={errors.percentage?.message}
                inputClassName="w-full text-right pr-7"
                placeholder="درصد تخفیف"
                type="text"
                value={percentageValue}
                onChange={handlePercentageChange}
              />
              <div className="absolute right-3 top-[14px] pointer-events-none z-10 text-gray-400">
                <Percent className="h-4 w-4" />
              </div>
            </div>
          </FormFieldGroup>

          <FormFieldGroup
            className="flex justify-center items-center border-b border-gray-800 pb-5"
            label="مدل دستگاه"
          >
            <div className="w-[512px]">
              <DropdownInput
                multiple
                className="w-full"
                error={errors.devices?.message}
                options={deviceOptions}
                placeholder="انتخاب کنید"
                type="tags"
                value={devices}
                onValueChange={value =>
                  setValue('devices', value as string[], {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </FormFieldGroup>

          <FormFieldGroup
            className="flex justify-center items-center border-b border-gray-800 pb-5"
            label="دستیار صوتی"
          >
            <div className="w-[512px]">
              <DropdownInput
                multiple
                className="w-full"
                options={voiceAssistantOptions}
                placeholder="انتخاب کنید"
                type="tags"
                value={voiceAssistants}
                onValueChange={value =>
                  setValue('voiceAssistants', value as string[], {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </FormFieldGroup>

          <FormFieldGroup
            className="flex justify-center items-center border-b border-gray-800 pb-5"
            label="تاریخ اعتبار"
          >
            <div className="w-[512px]">
              <DateRangePicker
                dateRange={dateRange}
                error={errors.endDate?.message || errors.startDate?.message}
                placeholderText="انتخاب تاریخ"
                triggerClassName="w-full text-textSecondary justify-start"
                onDateRangeChange={handleDateRangeChange}
              />
              {(errors.startDate || errors.endDate) && (
                <p className="text-sm text-destructive mt-1.5" role="alert">
                  {errors.endDate?.message || errors.startDate?.message}
                </p>
              )}
            </div>
          </FormFieldGroup>

          <div className="flex w-full mt-6">
            <Button
              className="cursor-pointer"
              loading={isLoading}
              size="lg"
              type="submit"
              variant="primary"
              disabled={
                isLoading ||
                !isValid ||
                !code ||
                !percentage ||
                (!startDate && !endDate) ||
                (voiceAssistants.length === 0 && devices.length === 0)
              }
            >
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
};

export default DiscountCodeForm;
