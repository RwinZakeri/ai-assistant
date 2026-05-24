import { DayOfWeek, LifecycleBounds } from '@/enums/enum';

export const dayOptions = [
  { value: String(DayOfWeek.Saturday), label: 'شنبه' },
  { value: String(DayOfWeek.Sunday), label: 'یکشنبه' },
  { value: String(DayOfWeek.Monday), label: 'دوشنبه' },
  { value: String(DayOfWeek.Tuesday), label: 'سه‌شنبه' },
  { value: String(DayOfWeek.Wednesday), label: 'چهارشنبه' },
  { value: String(DayOfWeek.Thursday), label: 'پنج‌شنبه' },
  { value: String(DayOfWeek.Friday), label: 'جمعه' },
];

export const sortOptions = [
  { value: String(LifecycleBounds.Newest), label: 'جدیدترین' },
  { value: String(LifecycleBounds.Oldest), label: 'قدیمی‌ترین' },
];

export const MAX_AMOUNT = 1000000000000;
