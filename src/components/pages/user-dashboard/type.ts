import { ChartConfig } from "@/components/ui/chart/chart";

export const dashboardChartConfig = {
  usage: {
    label: "استفاده",
    color: "var(--color-primary-300)",
  },
  income: {
    label: "درآمد",
    color: "var(--color-primary-200)",
  },
} satisfies ChartConfig;

export interface TableHeaderConfig {
  id: string;
  label: string;
}

export const adminDashboardTableHeaders: TableHeaderConfig[] = [
  { id: "rowNumber", label: "#" },
  { id: "persianName", label: "نام فارسی" },
  { id: "englishName", label: "نام انگلیسی" },
  { id: "status", label: "وضعیت" },
  { id: "userDescription", label: "توضیحات برای کاربر" },
  { id: "category", label: "دسته‌بندی" },
  { id: "languages", label: "زبان ها" },
];
