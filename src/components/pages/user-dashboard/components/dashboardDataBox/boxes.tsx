import { AdminDashboardService, UserDashboardService } from '@/apis';
import type {
  GetAdminDashboardDataOutput,
  GetUserDashboardDataOutput,
} from '@/apis';
import { Skeleton } from '@/components/ui/skeleton';
import ReactQuery from '@/configs/react_query_keys';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';
import numberSeprator from '@/utils/numberSeprator';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import DashboardDataBox from '.';

interface DashboardBoxsProps {
  className?: string;
}

const DashboardBoxsSkeleton = ({ className }: DashboardBoxsProps) => {
  return (
    <div className={cn('w-full grid grid-cols-7 gap-6', className)}>
      <div className="col-span-3 w-full rounded-xl p-6 border border-gray-800 flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <div className="w-full flex items-center justify-between">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <div className="col-span-2 w-full rounded-xl p-6 border border-gray-800 flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <div className="w-full flex items-center justify-between">
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
      <div className="col-span-2 w-full rounded-xl p-6 border border-gray-800 flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <div className="w-full flex items-center justify-between">
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
};

const DashboardBoxs = ({ className }: DashboardBoxsProps) => {
  const { permissions } = useAppSelector(state => state.userPermissions);
  const isAdminUser = useMemo(
    () => permissions && permissions?.length > 0,
    [permissions],
  );

  const { data, isLoading } = useQuery<
    GetAdminDashboardDataOutput | GetUserDashboardDataOutput
  >({
    queryKey: [
      isAdminUser ? ReactQuery.adminDashboard : ReactQuery.userDashboard,
      isAdminUser,
    ],
    queryFn: async () => {
      if (isAdminUser) {
        return await AdminDashboardService.apiServicesAppAdmindashboardGetadmindashboarddataGet();
      }
      return await UserDashboardService.apiServicesAppUserdashboardGetuserdashboarddataGet();
    },
  });

  if (isLoading) {
    return <DashboardBoxsSkeleton className={className} />;
  }

  if (isAdminUser) {
    const adminData = data as GetAdminDashboardDataOutput | undefined;
    return (
      <div className={cn('w-full grid grid-cols-7 gap-6', className)}>
        <DashboardDataBox className="col-span-3" label="تعداد کاربران">
          {numberSeprator(String(adminData?.usersCount || 0))}
        </DashboardDataBox>
        <DashboardDataBox className="col-span-2" label="تعداد پروفایل های فعال">
          {numberSeprator(String(adminData?.activeProfilesCount || 0))}
        </DashboardDataBox>
        <DashboardDataBox className="col-span-2" label="تعداد اسپیکر های متصل">
          {numberSeprator(String(adminData?.connectedSpeakersCount || 0))}
        </DashboardDataBox>
      </div>
    );
  }

  const userData = data as GetUserDashboardDataOutput | undefined;
  return (
    <div className={cn('w-full grid grid-cols-7 gap-6', className)}>
      <DashboardDataBox className="col-span-3" label="موجودی">
        {numberSeprator(String(userData?.userBalance || 0))}
        <span className="text-xs font-semibold text-textSecondary pb-1">
          تومان
        </span>
      </DashboardDataBox>
      <DashboardDataBox className="col-span-2" label="تعداد دستیار های فعال">
        {userData?.activeAssistantsCount || '0'}
      </DashboardDataBox>

      <DashboardDataBox className="col-span-2" label="تعداد اسپیکر های متصل">
        {userData?.activeSpeakersCount || '0'}
      </DashboardDataBox>
    </div>
  );
};

export default DashboardBoxs;
