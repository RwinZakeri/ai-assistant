import { AlarmClockCheckIcon } from '@/assets/images/svg/AlarmClockCheck';
import { BarChartSquare02Icon } from '@/assets/images/svg/BarChartSquare02';
import { ClockRewindIcon } from '@/assets/images/svg/ClockRewind';
import { LifeBuoy01Icon } from '@/assets/images/svg/LifeBuoy01';

import { Modem02Icon } from '@/assets/images/svg/Modem02';
import { OffPercentageIcon } from '@/assets/images/svg/OffPercentage';
import { SettingsIcon } from '@/assets/images/svg/Settings';
import { ShoppingBagIcon } from '@/assets/images/svg/ShoppingBag';
import { Speaker01Icon } from '@/assets/images/svg/Speaker01';
import { UsersEditIcon } from '@/assets/images/svg/UsersEdit';
import { Wallet04Icon } from '@/assets/images/svg/Wallet04';
import { User2Icon } from 'lucide-react';

export const UserDashboardSidebarItems = [
  {
    label: 'داشبورد',
    icon: <BarChartSquare02Icon className="size-6" />,
    href: '/dashboard',
    key: '',
  },
  {
    label: 'اسپیکر‌ها',
    icon: <Speaker01Icon className="size-6" />,
    href: '/dashboard/speakers',
    key: '',
  },
  {
    label: 'دستیاران صوتی',
    icon: <Modem02Icon className="size-6" />,
    href: '/dashboard/voice-assistants',
    key: '',
  },
  {
    label: 'کیف پول',
    icon: <Wallet04Icon className="size-6" />,
    href: '/dashboard/wallet',
    key: '',
  },
  {
    label: 'تاریخچه',
    icon: <ClockRewindIcon className="size-6" />,
    href: '/dashboard/history',
    key: '',
  },
  {
    label: 'پشتیبانی',
    icon: <LifeBuoy01Icon className="size-6" />,
    href: '/dashboard/support',
    key: '',
  },
];

export const AdminDashboardSidebarItems = [
  {
    label: 'داشبورد',
    icon: <BarChartSquare02Icon className="size-6" />,
    href: '/dashboard',
    key: 'Pages.AdminPanel.Dashboard',
  },
  {
    label: 'اسپیکر‌ها',
    icon: <Speaker01Icon className="size-6" />,
    href: '/dashboard/speakers',
    key: 'Pages.AdminPanel.Speakers',
  },
  {
    label: 'دستیاران صوتی',
    icon: <Modem02Icon className="size-6" />,
    href: '/dashboard/voice-assistants',
    key: 'Pages.AdminPanel.VoiceAssistants',
  },
  {
    label: 'کاربران',
    icon: <User2Icon className="size-6" />,
    href: '/dashboard/users',
    key: 'Pages.AdminPanel.Users',
  },
  {
    label: 'مدیریت نقش ها',
    icon: <UsersEditIcon className="size-6" />,
    href: '/dashboard/role-management',
    key: 'Pages.AdminPanel.RoleManagement',
  },

  {
    label: 'سفارشات',
    icon: <ShoppingBagIcon className="size-6" />,
    href: '/dashboard/orders',
    key: 'Pages.AdminPanel.Orders',
  },

  {
    label: 'تاریخچه پرداخت ها',
    icon: <ClockRewindIcon className="size-6" />,
    href: '/dashboard/payment-history',
    key: 'Pages.AdminPanel.PaymentHistory',
  },
  {
    label: 'کد تخفیف',
    icon: <OffPercentageIcon className="size-6" />,
    href: '/dashboard/discount-codes',
    key: 'Pages.AdminPanel.DiscountCodes',
  },
  {
    label: 'زمان ارسال',
    icon: <AlarmClockCheckIcon className="size-6" />,
    href: '/dashboard/delivery',
    key: 'Pages.AdminPanel.ShippingSchedule',
  },
  {
    label: 'تیکت‌های پشتیبانی',
    icon: <LifeBuoy01Icon className="size-6" />,
    href: '/dashboard/support',
    key: 'Pages.AdminPanel.SupportTickets',
  },
  {
    label: 'تنظیمات چت بات',
    icon: <SettingsIcon className="size-6" />,
    href: '/',
    key: 'Pages.AdminPanel.ChatbotSettings',
  },
];
