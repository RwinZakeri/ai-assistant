import type * as React from 'react';
import { persianToEnglish } from '@/utils/persianToEnglish';
import type { UseFormSetValue } from 'react-hook-form';
import type { DeliveryTimeFormValues } from './schemas';
import { MAX_AMOUNT } from './constants';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ENGLISH_DIGITS = '0123456789';

const filterAllowedChars = (value: string, allowedChars: string): string => {
  return value
    .split('')
    .filter(char => allowedChars.includes(char))
    .join('');
};

export const handleTimeInput = (
  value: string,
  setValue: UseFormSetValue<DeliveryTimeFormValues>,
  fieldName: 'startTime' | 'endTime',
): string => {
  const allowedChars = PERSIAN_DIGITS + ENGLISH_DIGITS + ':';
  const filteredValue = filterAllowedChars(value, allowedChars);
  const englishValue = persianToEnglish(filteredValue);

  setValue(fieldName, englishValue, { shouldValidate: true });

  return englishValue;
};

export const handleAmountInput = (
  value: string,
  setValue: UseFormSetValue<DeliveryTimeFormValues>,
  setLocalValue: React.Dispatch<React.SetStateAction<string>>,
  currentValue: string | undefined,
): void => {
  const allowedChars = PERSIAN_DIGITS + ENGLISH_DIGITS;
  const filteredValue = filterAllowedChars(value, allowedChars);
  const englishValue = persianToEnglish(filteredValue);

  if (englishValue) {
    if (englishValue === '0' || /^0+$/.test(englishValue)) {
      setLocalValue('');
      setValue('amount', '', { shouldValidate: true });
      return;
    }

    const numericValue = Number(englishValue);
    if (!isNaN(numericValue) && numericValue > MAX_AMOUNT) {
      setLocalValue(currentValue || '');
      return;
    }
  }

  setLocalValue(englishValue);
  setValue('amount', englishValue, { shouldValidate: true });
};

export const formatNumberWithCommas = (
  value: string | number | undefined,
): string => {
  if (!value) {
    return '';
  }
  const numValue = typeof value === 'string' ? value : String(value);
  const cleaned = numValue.replace(/[^\d]/g, '');
  if (!cleaned) {
    return '';
  }
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
