import type { DropdownOption } from '@/components/pages/user-dashboard/support/type';

export const CUSTOM_ASSISTANT_SORTING = {
  TopSelling: 1,
  Popular: 2,
  Newest: 3,
  Cheapest: 4,
  MostExpensive: 5,
} as const;

export const SubscribtionType_enum = {
  Free: 0,
  TimeBased: 1,
  PayToUse: 2,
} as const;

export const LifecycleBounds = {
  Newest: 0,
  Oldest: 1,
} as const;

export enum DayOfWeek {
  Saturday = 1,
  Sunday = 2,
  Monday = 3,
  Tuesday = 4,
  Wednesday = 5,
  Thursday = 6,
  Friday = 7,
}

export const SubscriptionType = {
  0: 'رایگان',
  1: 'بر اساس زمان',
  2: 'پرداختی',
} as const;

export const SubscriptionType_enum = {
  Free: 0,
  TimeBased: 1,
  PayToUse: 2,
} as const;

export type CustomAssistantSorting =
  (typeof CUSTOM_ASSISTANT_SORTING)[keyof typeof CUSTOM_ASSISTANT_SORTING];

export const AssistantLogRange = {
  Week: 0,
  Month: 1,
  Year: 2,
};

export const ResponseSpeed = {
  Default: 0,
  Kardo: 1,
  Langourously: 2,
} as const;

export const CommentAction_enum = {
  Approve: 1,
  Reject: 2,
} as const;

export type ResponseSpeedType =
  (typeof ResponseSpeed)[keyof typeof ResponseSpeed];

export const CommentStatus = {
  Pending: 0,
  Accepted: 1,
  Rejected: 2,
};

export enum ProductType {
  None = 0,
  Subscription = 1,
  Credit = 2,
  Speaker = 3,
  Assistant = 4,
}

export enum TicketStatus {
  Pending = 0,
  Checking = 1,
  Done = 2,
}

export const topicOptions: DropdownOption[] = [
  {
    label: 'همه',
    value: '0',
  },
  {
    label: 'خرید اشتراک',
    value: '1',
  },
  {
    label: 'شارژ حساب',
    value: '2',
  },
  {
    label: 'اسپیکر',
    value: '3',
  },
  {
    label: 'دستیار صوتی',
    value: '4',
  },
] as const;

export const ProductTypeObj = {
  0: 'همه',
  1: 'خرید اشتراک',
  2: 'شارژ حساب',
  3: 'اسپیکر',
  4: 'دستیار صوتی',
};
