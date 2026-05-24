'use client';

import * as React from 'react';
import { TextInput } from '@/components/ui/input/text-input';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { Button } from '@/components/ui/button';
import FormFieldGroup from '@/components/pages/user-dashboard/account/components/FormFieldGroup';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
import type { DeliveryTimeFormValues } from '../schemas';
import { dayOptions } from '../constants';
import {
  handleTimeInput,
  handleAmountInput,
  formatNumberWithCommas,
} from '../utils';

interface DeliveryTimeFormProps {
  errors: FieldErrors<DeliveryTimeFormValues>;
  register: UseFormRegister<DeliveryTimeFormValues>;
  setValue: UseFormSetValue<DeliveryTimeFormValues>;
  watch: UseFormWatch<DeliveryTimeFormValues>;
  trigger: UseFormTrigger<DeliveryTimeFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting?: boolean;
  isValid?: boolean;
}

const DeliveryTimeForm: React.FC<DeliveryTimeFormProps> = ({
  errors,
  register,
  setValue,
  watch,
  trigger,
  onSubmit,
  isSubmitting = false,
  isValid = false,
}) => {
  const dayValue = watch('day');
  const startTimeValue = watch('startTime');
  const endTimeValue = watch('endTime');
  const amountValue = watch('amount');
  const [localAmountValue, setLocalAmountValue] = React.useState<string>(
    amountValue || '',
  );
  const [isComponentMounted, setIsComponentMounted] = React.useState(false);

  React.useEffect(() => {
    setIsComponentMounted(true);
  }, []);

  React.useEffect(() => {
    if (amountValue !== undefined && amountValue !== localAmountValue) {
      setLocalAmountValue(amountValue || '');
    }
  }, [amountValue, localAmountValue]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <section className="flex justify-center w-full">
        <div className="flex flex-col items-center gap-5 w-full justify-center mt-6">
          <FormFieldGroup
            className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
            label="روز"
          >
            <DropdownInput
              className="w-[512px]"
              error={errors.day?.message}
              options={dayOptions}
              placeholder="روز را انتخاب کنید"
              type="default"
              value={dayValue ? String(dayValue) : undefined}
              onValueChange={async (value: string | string[]) => {
                if (!isComponentMounted) {
                  return;
                }
                if (
                  value === undefined ||
                  (Array.isArray(value) && value.length === 0)
                ) {
                  return;
                }
                if (typeof value === 'string' && value.trim() !== '') {
                  setValue('day', value);
                  await trigger('day');
                } else if (Array.isArray(value) && value.length > 0) {
                  setValue('day', String(value[0]));
                  await trigger('day');
                }
              }}
            />
          </FormFieldGroup>

          <FormFieldGroup
            className="gap-7 flex justify-center items-start border-b border-gray-800 pb-5"
            label={
              <div className="flex items-center gap-2">
                <span>بازه زمانی</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      aria-label="راهنمای فرمت بازه زمانی"
                      className="flex items-center justify-center text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
                      type="button"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" side="left">
                    فرمت صحیح انتخاب بازه ی زمانی 00:00 هست
                  </TooltipContent>
                </Tooltip>
              </div>
            }
          >
            <div className="w-[512px] flex flex-col">
              <div className="flex flex-row gap-7 items-start">
                <div className="flex-1 relative">
                  <TextInput
                    className="w-full"
                    error={undefined}
                    placeholder="09:00"
                    value={startTimeValue || ''}
                    inputClassName={cn(
                      'w-full text-right',
                      errors.startTime?.message &&
                        'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive',
                    )}
                    onChange={e => {
                      const value = e.target.value;
                      handleTimeInput(value, setValue, 'startTime');
                    }}
                  />
                </div>
                <span className="text-textSecondary text-md-regular whitespace-nowrap pt-2.5">
                  تا
                </span>
                <div className="flex-1 relative">
                  <TextInput
                    className="w-full"
                    error={undefined}
                    placeholder="18:00"
                    value={endTimeValue || ''}
                    inputClassName={cn(
                      'w-full text-right',
                      errors.endTime?.message &&
                        'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive',
                    )}
                    onChange={e => {
                      const value = e.target.value;
                      handleTimeInput(value, setValue, 'endTime');
                    }}
                  />
                </div>
              </div>
              {(errors.startTime?.message || errors.endTime?.message) && (
                <div className="flex flex-col gap-1 mt-2">
                  {errors.startTime?.message && (
                    <p
                      className="text-sm text-destructive flex items-center gap-1.5"
                      role="alert"
                    >
                      <span className="text-destructive">•</span>
                      {errors.startTime.message}
                    </p>
                  )}
                  {errors.endTime?.message && (
                    <p
                      className="text-sm text-destructive flex items-center gap-1.5"
                      role="alert"
                    >
                      <span className="text-destructive">•</span>
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </FormFieldGroup>

          <FormFieldGroup
            className="flex justify-center items-start border-b border-gray-800 pb-5"
            label="مبلغ (تومان)"
          >
            <div className="w-[512px] flex flex-col">
              <TextInput
                className="w-full"
                error={undefined}
                placeholder="مبلغ را وارد کنید"
                value={localAmountValue}
                inputClassName={cn(
                  'w-full text-right',
                  errors.amount?.message &&
                    'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive',
                )}
                onChange={e => {
                  const value = e.target.value;
                  handleAmountInput(
                    value,
                    setValue,
                    setLocalAmountValue,
                    amountValue,
                  );
                }}
              />
              {amountValue && (
                <p className="text-sm text-textSecondary mt-2 text-right">
                  {formatNumberWithCommas(amountValue)} تومان
                </p>
              )}
              {errors.amount?.message && (
                <p
                  className="text-sm text-destructive flex items-center gap-1.5 mt-2"
                  role="alert"
                >
                  <span className="text-destructive">•</span>
                  {errors.amount.message}
                </p>
              )}
            </div>
          </FormFieldGroup>
          <div className="flex justify-start w-full">
            <Button
              className="cursor-pointer "
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              size="lg"
              type="submit"
              variant="primary"
            >
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
};

export default DeliveryTimeForm;
