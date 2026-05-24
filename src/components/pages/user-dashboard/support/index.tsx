'use client';

import { useMemo } from 'react';

import { DashboardPlusIcon } from '@/assets/images/svg/DashboardPlus';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import HeaderDashboard from '../components/HeaderDashboard';
import AdminSupportPage from './components/pages/adminSupportPage';
import UserSupportPage from './components/pages/userSupportPage';
import { useAppSelector } from '@/store';

const Support = () => {
  const { permissions } = useAppSelector(state => state.userPermissions);
  const isAdminUser = useMemo(
    () => permissions && permissions?.length > 0,
    [permissions],
  );

  const checkRoleComponent = (isAdmin: boolean) => {
    switch (isAdmin) {
      case true:
        return <AdminSupportPage />;
      default:
        return <UserSupportPage />;
    }
  };

  return (
    <HeaderDashboard
      label={isAdminUser ? 'تیکت های پشتیبانی' : 'پشتیبانی'}
      actionButton={
        !isAdminUser && (
          <div className="flex justify-end items-center gap-4">
            <Button
              asChild
              aria-label="افزودن تیکت جدید"
              className="gap-2 cursor-pointer w-full sm:w-auto"
              size="lg"
            >
              <Link href="/dashboard/support/new">
                <DashboardPlusIcon />
                افزودن تیکت
              </Link>
            </Button>
          </div>
        )
      }
    >
      <section className="flex flex-col gap-8">
        {checkRoleComponent(isAdminUser as boolean)}
      </section>
    </HeaderDashboard>
  );
};

export default Support;
