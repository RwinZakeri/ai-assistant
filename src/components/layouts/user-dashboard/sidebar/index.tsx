'use client';

import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading, setPermission } from '@/store/userPermissionsSlice';
import { getToken } from '@/utils/cookies';
import { getPermissionsFromToken } from '@/utils/jwtDecoder';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import SidbarProfileInfo from './components/SidbarProfileInfo';
import SubscriptionUsageAlert from './components/SubscriptionUsageAlert';
import { AdminDashboardSidebarItems, UserDashboardSidebarItems } from './type';

const UserDashboardSidebard = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { permissions, isLoading } = useAppSelector(
    state => state.userPermissions,
  );

  useEffect(() => {
    const token = getToken();
    if (!token) {
      dispatch(setLoading(false));
      return undefined;
    }
    const permissions = getPermissionsFromToken(token);
    if (!permissions) {
      dispatch(setLoading(false));
      return undefined;
    }
    dispatch(setPermission(permissions));
  }, [dispatch]);

  const sidebarItems = useMemo(
    () =>
      permissions && permissions.length > 0
        ? AdminDashboardSidebarItems
        : UserDashboardSidebarItems,
    [permissions],
  );

  if (isLoading) {
    return;
  }

  return (
    <div className="w-[312px] h-screen shrink-0 overflow-y-auto flex flex-col bg-base-black border-l border-gray-800">
      <div className="flex flex-col gap-6 py-8 px-6 justify-between min-h-full">
        <div className="flex flex-col gap-6">
          <Image
            alt="ai assistant"
            height={40}
            src="/images/logo.svg"
            width={40}
          />
          <DropdownInput
            options={[{ label: 'search', value: '1' }]}
            type="search"
          />

          <div className="flex flex-col gap-2">
            {sidebarItems.map(item => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              if (permissions && permissions.length > 0) {
                if (permissions.includes(item.key)) {
                  return (
                    <Link
                      key={item.label}
                      aria-current={isActive ? 'page' : undefined}
                      href={item.href}
                      className={`flex rounded-md items-center gap-3 py-2 px-3 transition-colors ${
                        isActive
                          ? 'bg-surfaceSecondary text-white'
                          : 'text-gray-400 hover:bg-surfaceSecondary hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                }
              } else {
                return (
                  <Link
                    key={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    href={item.href}
                    className={`flex rounded-md items-center gap-3 py-2 px-3 transition-colors ${
                      isActive
                        ? 'bg-surfaceSecondary text-white'
                        : 'text-gray-400 hover:bg-surfaceSecondary hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              }
            })}
          </div>
          <div className="flex flex-col gap-6" />
        </div>
        <div className="flex flex-col gap-4">
          {permissions?.length == 0 && <SubscriptionUsageAlert />}
          <SidbarProfileInfo />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardSidebard;
