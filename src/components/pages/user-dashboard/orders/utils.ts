import { persianToEnglish } from '@/utils/persianToEnglish';
import { OrderState } from '@/apis/models/OrderState';

export const handleSearchInputChange = (
  value: string,
  onSearchChange?: (value: string) => void,
) => {
  const convertedValue = persianToEnglish(value);
  const digitsOnly = convertedValue.replace(/\D/g, '');
  onSearchChange?.(digitsOnly);
};

export const handleSearchKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  const allowedKeys = new Set([
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    'Home',
    'End',
    'Enter',
  ]);

  if (allowedKeys.has(e.key)) {
    return;
  }

  const isEnglishDigit = /^\d$/.test(e.key);
  const isPersianDigit = /^[۰-۹]$/.test(e.key);

  if (!isEnglishDigit && !isPersianDigit) {
    e.preventDefault();
  }
};

export const getStatusConfig = (status?: OrderState) => {
  switch (status) {
    case OrderState._1:
      return {
        label: 'در حال آماده سازی',
        variant: 'primary' as const,
      };
    case OrderState._2:
      return {
        label: 'در حال ارسال',
        variant: 'warning' as const,
      };
    case OrderState._3:
      return {
        label: 'تحویل شده',
        variant: 'success' as const,
      };
    default:
      return {
        label: 'نامشخص',
        variant: 'gray' as const,
      };
  }
};
