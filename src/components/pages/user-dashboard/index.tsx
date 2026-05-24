'use client';

import { useAppSelector } from '@/store/index';
import { useMemo } from 'react';
import HeaderDashboard from './components/HeaderDashboard';
import DashboardAdminPage from './components/pages/dashboardAdminPage';
import DashboardUserPage from './components/pages/dashboardUserPage';

const Dashboard = () => {
  const { permissions, isLoading: isRoleLoading } = useAppSelector(
    state => state.userPermissions,
  );
  const isAdminUser = useMemo(
    () => permissions && permissions?.length > 0,
    [permissions],
  );

  const checkRoleComponent = (isAdmin: boolean) => {
    switch (isAdmin) {
      case true:
        return <DashboardAdminPage />;
      default:
        return <DashboardUserPage />;
    }
  };

  if (isRoleLoading) {
    return;
  }

  return (
    <HeaderDashboard label="داشبورد">
      {checkRoleComponent(isAdminUser as boolean)}
    </HeaderDashboard>
  );
};

export default Dashboard;
