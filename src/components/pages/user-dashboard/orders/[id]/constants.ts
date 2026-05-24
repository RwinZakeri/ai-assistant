export const ORDER_MESSAGES = {
  LOADING: 'در حال بارگذاری...',
  ERROR: 'خطا در دریافت اطلاعات سفارش. لطفاً دوباره تلاش کنید.',
  STATUS_UPDATE_SUCCESS: 'وضعیت سفارش با موفقیت به‌روزرسانی شد.',
  STATUS_UPDATE_ERROR:
    'خطا در به‌روزرسانی وضعیت سفارش. لطفاً دوباره تلاش کنید.',
} as const;

export const ORDER_LABELS = {
  PAGE_TITLE: 'جزئیات سفارش',
} as const;

export const BUYER_TABLE_HEADERS = {
  BUYER: 'خریدار',
  NATIONAL_ID: 'کد ملی',
  PHONE_NUMBER: 'شماره تلفن',
  ADDRESS: 'آدرس',
  POSTAL_CODE: 'کد پستی',
} as const;

export const ORDER_ITEMS_TABLE_HEADERS = {
  DEVICE_NAME: 'نام و مدل دستگاه',
  QUANTITY: 'تعداد',
  UNIT_PRICE: 'مبلغ واحد (تومان)',
  DISCOUNT: 'تخفیف (تومان)',
} as const;

export const TABLE_CELL_CLASSES = {
  PRIMARY_TEXT: 'text-sm font-semibold text-gray-25',
  SECONDARY_TEXT: 'text-sm text-textTertiary',
} as const;
