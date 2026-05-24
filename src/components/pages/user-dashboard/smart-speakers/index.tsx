'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { DashboardPlusIcon } from '@/assets/images/svg/DashboardPlus';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store';
import HeaderDashboard from '../components/HeaderDashboard';
import AdminSpeakerPage from './components/pages/adminSpeakerPage';
import UserSpeakerPage from './components/pages/userSpeakerPage';

const SmartSpeakersDashboardPage = () => {
  const router = useRouter();
  const { permissions } = useAppSelector(state => state.userPermissions);
  const isAdminUser = useMemo(
    () => permissions && permissions?.length > 0,
    [permissions],
  );
  const checkRoleComponent = (isAdmin: boolean) => {
    switch (isAdmin) {
      case true:
        return <AdminSpeakerPage />;
      default:
        return <UserSpeakerPage />;
    }
  };

  return (
    <HeaderDashboard
      label={isAdminUser ? 'اسپیکرها' : 'اسپیکرهای من'}
      actionButton={
        isAdminUser && (
          <div className="flex justify-end items-center gap-4">
            <Button
              className="gap-2 cursor-pointer"
              size="lg"
              onClick={() => {
                router.push('/dashboard/speakers/new');
              }}
            >
              <DashboardPlusIcon />
              افزودن اسپیکر
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

export default SmartSpeakersDashboardPage;
