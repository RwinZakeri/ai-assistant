import type { DateRange } from 'react-day-picker';
import {
  toJalaali,
  toGregorian,
  jalaaliMonthLength,
  isLeapJalaaliYear,
} from 'jalaali-js';

export type PredefinedRange =
  | 'today'
  | 'yesterday'
  | 'currentWeek'
  | 'lastWeek'
  | 'currentMonth'
  | 'lastMonth'
  | 'currentYear'
  | 'lastYear'
  | 'all';

export function formatPersianDate(date: Date | undefined): string {
  if (!date) {
    return 'همه';
  }

  try {
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
    return persianDate;
  } catch {
    return 'خطا در نمایش تاریخ';
  }
}

export function getDateRangeForPredefinedOption(
  option: PredefinedRange,
): DateRange | undefined {
  const now = new Date();
  const jNow = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());

  switch (option) {
    case 'today': {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);
      return {
        from: today,
        to: todayEnd,
      };
    }
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);
      return {
        from: yesterday,
        to: yesterdayEnd,
      };
    }
    case 'currentWeek': {
      const dayOfWeek = now.getDay();
      const persianDayOfWeek = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - persianDayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return {
        from: startOfWeek,
        to: endOfWeek,
      };
    }
    case 'lastWeek': {
      const dayOfWeek = now.getDay();
      const persianDayOfWeek = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
      const startOfLastWeek = new Date(now);
      startOfLastWeek.setDate(now.getDate() - persianDayOfWeek - 7);
      startOfLastWeek.setHours(0, 0, 0, 0);

      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
      endOfLastWeek.setHours(23, 59, 59, 999);

      return {
        from: startOfLastWeek,
        to: endOfLastWeek,
      };
    }
    case 'currentMonth': {
      const greg1 = toGregorian(jNow.jy, jNow.jm, 1);
      const firstDay = new Date(greg1.gy, greg1.gm - 1, greg1.gd);
      firstDay.setHours(0, 0, 0, 0);

      const lastDayOfMonth = jalaaliMonthLength(jNow.jy, jNow.jm);
      const greg2 = toGregorian(jNow.jy, jNow.jm, lastDayOfMonth);
      const lastDay = new Date(greg2.gy, greg2.gm - 1, greg2.gd);
      lastDay.setHours(23, 59, 59, 999);

      return {
        from: firstDay,
        to: lastDay,
      };
    }
    case 'lastMonth': {
      let lastMonth = jNow.jm - 1;
      let lastYear = jNow.jy;
      if (lastMonth < 1) {
        lastMonth = 12;
        lastYear -= 1;
      }

      const greg1 = toGregorian(lastYear, lastMonth, 1);
      const firstDay = new Date(greg1.gy, greg1.gm - 1, greg1.gd);
      firstDay.setHours(0, 0, 0, 0);

      const lastDayOfMonth = jalaaliMonthLength(lastYear, lastMonth);
      const greg2 = toGregorian(lastYear, lastMonth, lastDayOfMonth);
      const lastDay = new Date(greg2.gy, greg2.gm - 1, greg2.gd);
      lastDay.setHours(23, 59, 59, 999);

      return {
        from: firstDay,
        to: lastDay,
      };
    }
    case 'currentYear': {
      const greg1 = toGregorian(jNow.jy, 1, 1);
      const firstDay = new Date(greg1.gy, greg1.gm - 1, greg1.gd);
      firstDay.setHours(0, 0, 0, 0);

      const lastDayOfYear = isLeapJalaaliYear(jNow.jy) ? 30 : 29;
      const greg2 = toGregorian(jNow.jy, 12, lastDayOfYear);
      const lastDay = new Date(greg2.gy, greg2.gm - 1, greg2.gd);
      lastDay.setHours(23, 59, 59, 999);

      return {
        from: firstDay,
        to: lastDay,
      };
    }
    case 'lastYear': {
      const lastYear = jNow.jy - 1;

      const greg1 = toGregorian(lastYear, 1, 1);
      const firstDay = new Date(greg1.gy, greg1.gm - 1, greg1.gd);
      firstDay.setHours(0, 0, 0, 0);

      const lastDayOfYear = isLeapJalaaliYear(lastYear) ? 30 : 29;
      const greg2 = toGregorian(lastYear, 12, lastDayOfYear);
      const lastDay = new Date(greg2.gy, greg2.gm - 1, greg2.gd);
      lastDay.setHours(23, 59, 59, 999);

      return {
        from: firstDay,
        to: lastDay,
      };
    }
    case 'all': {
      return undefined;
    }
    default:
      return undefined;
  }
}

export function formatDateForBackend(date: Date | undefined): string | null {
  if (!date) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDateWithTimeForBackend(
  date: Date | undefined,
  includeTime: boolean = false,
  isEndOfDay: boolean = false,
): string | null {
  if (!date) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (!includeTime) {
    return `${year}-${month}-${day}`;
  }

  const hours = isEndOfDay ? '23' : '00';
  const minutes = isEndOfDay ? '59' : '00';
  const seconds = isEndOfDay ? '59' : '00';

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
