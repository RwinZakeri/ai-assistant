import getSolarMonthName from "./numToMonth";

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ApiDataPoint {
  month?: string;
  day?: string;
  week?: string;
  year?: string | number;
  value: number;
}

export interface ApiResponse {
  result?: {
    range: "yearly" | "weekly" | "monthly";
    unit: "month" | "day" | "week" | "year";
    data: ApiDataPoint[];
  };
  points?: Array<{
    year?: number;
    month?: number;
    day?: number;
    value?: number;
  }>;
}

function parseMonthString(
  monthStr: string
): { year: number; month: number } | null {
  const match = monthStr.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
  };
}

function parseDayString(dayStr: string): Date | null {
  const date = new Date(dayStr);
  if (isNaN(date.getTime())) return null;
  return date;
}

function formatDayForDisplay(dayStr: string): string {
  const date = parseDayString(dayStr);
  if (!date) return dayStr;

  try {
    const persianDate = new Intl.DateTimeFormat("fa-IR", {
      month: "long",
      day: "numeric",
    }).format(date);
    return persianDate;
  } catch {
    return dayStr;
  }
}

function formatMonthForDisplay(monthStr: string): string {
  const parsed = parseMonthString(monthStr);
  if (!parsed) return monthStr;

  const monthName = getSolarMonthName(parsed.month);
  return monthName || monthStr;
}

function formatYearForDisplay(year: string | number): string {
  return String(year);
}

function parseWeekString(
  weekStr: string
): { year: number; week: number } | null {
  const match = weekStr.match(/^(\d{4})-W(\d{1,2})$/);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    week: parseInt(match[2], 10),
  };
}

function numberToPersianOrdinal(num: number): string {
  const persianOrdinals: Record<number, string> = {
    1: "اول",
    2: "دوم",
    3: "سوم",
    4: "چهارم",
    5: "پنجم",
    6: "ششم",
    7: "هفتم",
    8: "هشتم",
    9: "نهم",
    10: "دهم",
    11: "یازدهم",
    12: "دوازدهم",
    13: "سیزدهم",
    14: "چهاردهم",
    15: "پانزدهم",
    16: "شانزدهم",
    17: "هفدهم",
    18: "هجدهم",
    19: "نوزدهم",
    20: "بیستم",
    21: "بیست و یکم",
    22: "بیست و دوم",
    23: "بیست و سوم",
    24: "بیست و چهارم",
    25: "بیست و پنجم",
    26: "بیست و ششم",
    27: "بیست و هفتم",
    28: "بیست و هشتم",
    29: "بیست و نهم",
    30: "سی‌ام",
    31: "سی و یکم",
    32: "سی و دوم",
    33: "سی و سوم",
    34: "سی و چهارم",
    35: "سی و پنجم",
    36: "سی و ششم",
    37: "سی و هفتم",
    38: "سی و هشتم",
    39: "سی و نهم",
    40: "چهلم",
    41: "چهل و یکم",
    42: "چهل و دوم",
    43: "چهل و سوم",
    44: "چهل و چهارم",
    45: "چهل و پنجم",
    46: "چهل و ششم",
    47: "چهل و هفتم",
    48: "چهل و هشتم",
    49: "چهل و نهم",
    50: "پنجاهم",
    51: "پنجاه و یکم",
    52: "پنجاه و دوم",
  };

  if (persianOrdinals[num]) {
    return persianOrdinals[num];
  }

  return `${num}م`;
}

function formatWeekForDisplay(weekStr: string, index: number): string {
  const persianOrdinal = numberToPersianOrdinal(index + 1);
  return `هفته‌ی ${persianOrdinal}`;
}

function generateAllWeeksForYear(year: number): string[] {
  return Array.from({ length: 52 }, (_, i) => {
    const week = (i + 1).toString().padStart(2, "0");
    return `${year}-W${week}`;
  });
}

function generateAllWeeksForRange(data: ApiDataPoint[]): string[] {
  if (data.length === 0) {
    const currentYear = new Date().getFullYear();
    return generateAllWeeksForYear(currentYear);
  }

  const weeks = data
    .map((d) => d.week)
    .filter((w): w is string => !!w)
    .map((w) => parseWeekString(w))
    .filter((w): w is { year: number; week: number } => !!w)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.week - b.week;
    });

  if (weeks.length === 0) {
    const currentYear = new Date().getFullYear();
    return generateAllWeeksForYear(currentYear);
  }

  const firstWeek = weeks[0];
  const lastWeek = weeks[weeks.length - 1];

  const allWeeks: string[] = [];

  for (let year = firstWeek.year; year <= lastWeek.year; year++) {
    const startWeek = year === firstWeek.year ? firstWeek.week : 1;
    const endWeek = year === lastWeek.year ? lastWeek.week : 52;

    for (let week = startWeek; week <= endWeek; week++) {
      const weekStr = week.toString().padStart(2, "0");
      allWeeks.push(`${year}-W${weekStr}`);
    }
  }

  return allWeeks;
}

function generateAllMonths(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  });
}

function generateAllDaysForWeek(): string[] {
  const days: string[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    days.push(`${year}-${month}-${day}`);
  }

  return days;
}

function generateAllDaysForWeekRange(data: ApiDataPoint[]): string[] {
  if (data.length === 0) {
    return generateAllDaysForWeek();
  }

  const dates = data
    .map((d) => d.day)
    .filter((d): d is string => !!d)
    .map((d) => parseDayString(d))
    .filter((d): d is Date => !!d)
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) {
    return generateAllDaysForWeek();
  }

  const startDate = dates[0];
  const days: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    days.push(`${year}-${month}-${day}`);
  }

  return days;
}

function generateAllDaysForMonthRange(data: ApiDataPoint[]): string[] {
  if (data.length === 0) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return generateAllDaysForMonth(year, month);
  }

  const dates = data
    .map((d) => d.day)
    .filter((d): d is string => !!d)
    .map((d) => parseDayString(d))
    .filter((d): d is Date => !!d)
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return generateAllDaysForMonth(year, month);
  }

  const lastDate = dates[dates.length - 1];
  const year = lastDate.getFullYear();
  const month = lastDate.getMonth() + 1;

  return generateAllDaysForMonth(year, month);
}

function generateAllDaysForMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = month.toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    days.push(`${year}-${monthStr}-${dayStr}`);
  }

  return days;
}

function generateAllYears(data: ApiDataPoint[]): string[] {
  if (data.length === 0) {
    const currentYear = new Date().getFullYear();
    return [String(currentYear)];
  }

  const years = new Set<string>();

  data.forEach((point) => {
    if (point.year) {
      years.add(String(point.year));
    } else if (point.month) {
      const parsed = parseMonthString(point.month);
      if (parsed) {
        years.add(String(parsed.year));
      }
    } else if (point.day) {
      const date = parseDayString(point.day);
      if (date) {
        years.add(String(date.getFullYear()));
      }
    } else if (point.week) {
      const parsed = parseWeekString(point.week);
      if (parsed) {
        years.add(String(parsed.year));
      }
    }
  });

  if (years.size === 0) {
    const currentYear = new Date().getFullYear();
    return [String(currentYear)];
  }

  return Array.from(years).sort();
}

export function convertApiResponseToChartData(
  response: ApiResponse | null | undefined | Record<string, unknown>,
  range: "yearly" | "weekly" | "monthly" | string = "monthly"
): ChartDataPoint[] {
  if (!response) return [];

  const resultData = (response as Record<string, unknown>)?.result || response;

  if (
    resultData &&
    typeof resultData === "object" &&
    "unit" in resultData &&
    "data" in resultData &&
    Array.isArray(resultData.data)
  ) {
    const resultDataTyped = resultData as {
      unit: string;
      data: ApiDataPoint[];
      range?: string;
    };
    const unit = resultDataTyped.unit;
    const data = resultDataTyped.data;
    const actualRange = resultDataTyped.range || range;

    let allSlots: string[] = [];
    let xAxisKey = "";
    let formatFn: (slot: string) => string = (s) => s;

    if (unit === "month" || actualRange === "yearly") {
      let targetYear = new Date().getFullYear();
      if (data.length > 0 && data[0].month) {
        const parsed = parseMonthString(data[0].month);
        if (parsed) {
          targetYear = parsed.year;
        }
      }
      allSlots = generateAllMonths(targetYear);
      xAxisKey = "month";
      formatFn = formatMonthForDisplay;
    } else if (unit === "day") {
      if (actualRange === "monthly") {
        allSlots = generateAllDaysForMonthRange(data);
        xAxisKey = "day";
        formatFn = formatDayForDisplay;
      } else if (actualRange === "weekly") {
        allSlots = generateAllDaysForWeekRange(data);
        xAxisKey = "day";
        formatFn = formatDayForDisplay;
      } else {
        allSlots = generateAllDaysForWeekRange(data);
        xAxisKey = "day";
        formatFn = formatDayForDisplay;
      }
    } else if (actualRange === "weekly") {
      allSlots = generateAllDaysForWeekRange(data);
      xAxisKey = "day";
      formatFn = formatDayForDisplay;
    } else if (unit === "week") {
      allSlots = generateAllWeeksForRange(data);
      xAxisKey = "week";
      formatFn = () => "";
    } else if (unit === "year") {
      allSlots = generateAllYears(data);
      xAxisKey = "year";
      formatFn = formatYearForDisplay;
    } else {
      const rangeValue = actualRange as string;
      if (rangeValue === "yearly") {
        const currentYear = new Date().getFullYear();
        allSlots = generateAllMonths(currentYear);
        xAxisKey = "month";
        formatFn = formatMonthForDisplay;
      } else if (rangeValue === "weekly") {
        allSlots = generateAllDaysForWeek();
        xAxisKey = "day";
        formatFn = formatDayForDisplay;
      } else {
        const currentYear = new Date().getFullYear();
        allSlots = generateAllMonths(currentYear);
        xAxisKey = "month";
        formatFn = formatMonthForDisplay;
      }
    }

    const dataMap = new Map<string, number>();
    data.forEach((point: ApiDataPoint) => {
      let key = "";
      if (point.month) key = point.month;
      else if (point.day) key = point.day;
      else if (point.week) key = point.week;
      else if (point.year !== undefined) key = String(point.year);

      if (key) {
        dataMap.set(key, point.value || 0);
      }
    });

    return allSlots.map((slot, index) => {
      const value = dataMap.get(slot) || 0;
      let formattedLabel: string;
      if (xAxisKey === "week") {
        formattedLabel = formatWeekForDisplay(slot, index);
      } else {
        formattedLabel = formatFn(slot);
      }
      return {
        [xAxisKey]: formattedLabel,
        usage: value,
        income: value,
      };
    });
  }

  if (response.points && Array.isArray(response.points)) {
    const points = response.points;

    const hasDay = points.some((p: { day?: number }) => p.day !== undefined);
    const hasMonth = points.some(
      (p: { month?: number }) => p.month !== undefined
    );
    const hasYear = points.some((p: { year?: number }) => p.year !== undefined);

    let allSlots: string[] = [];
    let xAxisKey = "";
    let formatFn: (slot: string) => string = (s) => s;

    if (range === ("weekly" as string) || hasDay) {
      const dayStrings = points
        .filter((p: { day?: number }) => p.day !== undefined)
        .map((p: { day?: number; year?: number; month?: number }) => {
          const year = p.year || new Date().getFullYear();
          const month = p.month || new Date().getMonth() + 1;
          const day = p.day!;
          return `${year}-${month.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}`;
        });

      if (dayStrings.length > 0) {
        allSlots = generateAllDaysForWeekRange(
          dayStrings.map((d: string) => ({ day: d, value: 0 }))
        );
      } else {
        allSlots = generateAllDaysForWeek();
      }
      xAxisKey = "day";
      formatFn = formatDayForDisplay;
    } else if (range === ("yearly" as string) || hasMonth) {
      const year = points[0]?.year || new Date().getFullYear();
      allSlots = generateAllMonths(year);
      xAxisKey = "month";
      formatFn = formatMonthForDisplay;
    } else if (hasYear && !hasMonth && !hasDay) {
      allSlots = generateAllYears(
        points.map((p: { year?: number }) => ({
          year: String(p.year || ""),
          value: 0,
        }))
      );
      xAxisKey = "year";
      formatFn = formatYearForDisplay;
    } else {
      const year = new Date().getFullYear();
      allSlots = generateAllMonths(year);
      xAxisKey = "month";
      formatFn = formatMonthForDisplay;
    }

    const dataMap = new Map<string, number>();
    points.forEach(
      (point: {
        day?: number;
        month?: number;
        year?: number;
        value?: number;
      }) => {
        let key = "";
        if (point.day !== undefined) {
          const year = point.year || new Date().getFullYear();
          const month = point.month || new Date().getMonth() + 1;
          key = `${year}-${month.toString().padStart(2, "0")}-${point.day
            .toString()
            .padStart(2, "0")}`;
        } else if (point.month !== undefined) {
          const year = point.year || new Date().getFullYear();
          key = `${year}-${point.month.toString().padStart(2, "0")}`;
        } else if (point.year !== undefined && !hasMonth && !hasDay) {
          key = String(point.year);
        }

        if (key) {
          dataMap.set(key, point.value || 0);
        }
      }
    );

    return allSlots.map((slot, index) => {
      const value = dataMap.get(slot) || 0;
      const formattedLabel =
        xAxisKey === "week"
          ? formatWeekForDisplay(slot, index)
          : formatFn(slot);
      return {
        [xAxisKey]: formattedLabel,
        usage: value,
        income: value,
      };
    });
  }

  return [];
}
