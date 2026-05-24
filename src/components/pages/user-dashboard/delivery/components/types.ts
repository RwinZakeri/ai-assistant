export interface DeliveryTime {
  rowNumber: number;
  id: number;
  day: string;
  timeRange: string;
  cost: string;
}

export interface DeliveryTableProps {
  deliveryTimes: DeliveryTime[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export interface DeliveryTimeItem {
  id: number;
  day: string;
  timeRange: string;
  cost: string;
  rowNumber: number;
}

export const dayOfWeekLabels: Record<number, string> = {
  1: 'شنبه',
  2: 'یکشنبه',
  3: 'دوشنبه',
  4: 'سه‌شنبه',
  5: 'چهارشنبه',
  6: 'پنج‌شنبه',
  7: 'جمعه',
};
