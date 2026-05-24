'use client';

import { useQuery } from '@tanstack/react-query';
import { useId, useMemo, useState } from 'react';

import type { GetAllAssistantCategoriesOutput } from '@/apis/models/GetAllAssistantCategoriesOutput';
import type { GetUserAssistantsDashboardOutput } from '@/apis/models/GetUserAssistantsDashboardOutput';
import type { SubscriptionType } from '@/apis/models/SubscriptionType';
import { CategoriesService } from '@/apis/services/CategoriesService';
import { UserDashboardService } from '@/apis/services/UserDashboardService';
import { DashboardPlusIcon } from '@/assets/images/svg/DashboardPlus';
import { Button } from '@/components/ui/button';
import { VoiceDashboardCard } from '@/components/ui/cards/voice-assistants/dashboard-card';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import ReactQuery from '@/configs/react_query_keys';
import { SubscribtionType_enum } from '@/enums/enum';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppSelector } from '@/store';
import getFileUrl from '@/utils/getFileUrl';
import Link from 'next/link';
import HeaderDashboard from '../components/HeaderDashboard';
import { CardSkeleton } from './components/CardSkeleton';
import AdminAssistantsPage from './components/pages/adminAssistantsPage';

const SUBSCRIPTION_OPTIONS = [
  { label: 'همه اشتراک‌ها', value: 'all' },
  { label: 'رایگان', value: String(SubscribtionType_enum.Free) },
  { label: 'اشتراک زماندار', value: String(SubscribtionType_enum.TimeBased) },
  { label: 'اعتباری', value: String(SubscribtionType_enum.PayToUse) },
];

const UserVoiceAssistantsPage = () => {
  const skeletonId = useId();
  const [subscriptionFilter, setSubscriptionFilter] = useState<string | null>(
    null,
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchInput, setSearchInput] = useState<string>('');

  const subscriptionTypeFilter = useMemo(() => {
    if (subscriptionFilter === 'all' || !subscriptionFilter) {
      return undefined;
    }
    const numValue = Number(subscriptionFilter);
    return isNaN(numValue) ? undefined : (numValue as SubscriptionType);
  }, [subscriptionFilter]);

  const categoryIdFilter = useMemo(() => {
    if (categoryFilter === 'all') {
      return undefined;
    }
    const numValue = Number(categoryFilter);
    return isNaN(numValue) ? undefined : numValue;
  }, [categoryFilter]);

  const searchFilter = useDebounce(searchInput, 400);

  const { data: categories } = useQuery<GetAllAssistantCategoriesOutput[]>({
    queryKey: [ReactQuery.allMenuChildren],
    queryFn: () =>
      CategoriesService.apiServicesAppCategoriesGetallassistantcategoriesGet(),
  });

  const {
    data: assistants,
    isLoading,
    isError,
  } = useQuery<GetUserAssistantsDashboardOutput[]>({
    queryKey: [
      ReactQuery.userAssistantsDashboard,
      searchFilter,
      categoryIdFilter,
      subscriptionTypeFilter,
    ],
    queryFn: () =>
      UserDashboardService.apiServicesAppUserdashboardGetuserassistantsdashboardGet(
        searchFilter || undefined,
        categoryIdFilter,
        subscriptionTypeFilter,
      ),
  });

  const categoryOptions = useMemo(() => {
    if (!categories) {
      return [];
    }
    return categories
      .filter(item => item.category?.id && item.category?.title)
      .map(item => ({
        label: item.category!.title!,
        value: String(item.category!.id!),
      }));
  }, [categories]);

  const searchOptions = useMemo(() => {
    if (!assistants) {
      return [];
    }
    return assistants.map(assistant => ({
      label: assistant.title || '',
      value: assistant.title || '',
    }));
  }, [assistants]);

  const mappedAssistants = useMemo(() => {
    if (!assistants) {
      return [];
    }

    // Filter assistants based on assistantSubscriptions being strictly null (not array or object)
    // when free is selected or filter is nullish
    const isFreeSelected =
      subscriptionFilter === String(SubscribtionType_enum.Free);
    const isFilterNullish = !subscriptionFilter || subscriptionFilter === null;
    const isAllSelected = subscriptionFilter === 'all';

    const filteredAssistants =
      (isFreeSelected || isFilterNullish) && !isAllSelected
        ? assistants.filter(assistant => {
            // Only show assistants where assistantSubscriptions is strictly null (not array or object)
            const subscriptions = (assistant as any).assistantSubscriptions;
            return subscriptions === null;
          })
        : assistants;

    return filteredAssistants.map(assistant => {
      const imageUrl = getFileUrl(assistant.tumbnail) || '/images/product1.png';
      const subscriptionType =
        assistant.subscriptionType !== undefined
          ? (assistant.subscriptionType as 0 | 1 | 2)
          : 0;

      const badges = [...(assistant.tones || [])];

      if (subscriptionType === SubscribtionType_enum.Free) {
        badges.push('رایگان');
      } else if (subscriptionType === SubscribtionType_enum.TimeBased) {
        badges.push('اشتراک زماندار');
      } else if (subscriptionType === SubscribtionType_enum.PayToUse) {
        badges.push('اعتباری');
      }

      return {
        id: String(assistant.id || ''),
        imageSrc: imageUrl,
        category: assistant.category?.title || '',
        title: assistant.title || '',
        badge: assistant.isActive ?? false,
        badges,
        description: assistant.description || '',
        subscriptionType,
        progressLabel:
          subscriptionType === SubscribtionType_enum.TimeBased
            ? 'اشتراک مصرف شده'
            : undefined,
        daysLeft: assistant.subDaysLeft,
        percentage: assistant.subUsedPercentage,
        subscriptionLabel:
          subscriptionType === SubscribtionType_enum.PayToUse
            ? 'اعتبار باقی‌مانده'
            : undefined,
        amount:
          subscriptionType === SubscribtionType_enum.PayToUse &&
          assistant.subAmountUsed !== null
            ? String(assistant.subAmountUsed)
            : undefined,
        currency:
          subscriptionType === SubscribtionType_enum.PayToUse
            ? 'تومان'
            : undefined,
      };
    });
  }, [assistants, subscriptionFilter]);

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div
          className="grid gap-4 grid-cols-1 md:[grid-template-columns:1.5fr_1fr_1fr]"
          dir="rtl"
        >
          <DropdownInput
            className="w-full"
            label="جست و جو"
            options={searchOptions}
            placeholder="عنوان دستیار صوتی"
            searchPlaceholder="جستجو کنید"
            type="search"
            value={searchInput || undefined}
            onInputChange={value => {
              setSearchInput(value);
            }}
            onValueChange={value => {
              setSearchInput(value as string);
            }}
          />
          <DropdownInput
            className="w-full"
            label="نوع اشتراک"
            options={SUBSCRIPTION_OPTIONS}
            placeholder="همه"
            value={subscriptionFilter || 'all'}
            onValueChange={value => {
              setSubscriptionFilter(value as string);
            }}
          />
          <DropdownInput
            className="w-full"
            label="دسته‌بندی"
            placeholder="همه"
            value={categoryFilter}
            options={[
              { label: 'همه دسته‌بندی‌ها', value: 'all' },
              ...categoryOptions,
            ]}
            onValueChange={value => setCategoryFilter(value as string)}
          />
        </div>
      </div>

      {isLoading ? (
        <div
          dir="rtl"
          className="grid gap-6
    md:grid-cols-2
    lg:grid-cols-2
    xl:grid-cols-3
    2xl:grid-cols-4
    
    "
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={`${skeletonId}-${index}`} />
          ))}
        </div>
      ) : mappedAssistants.length > 0 ? (
        <div
          dir="rtl"
          className="grid gap-6
    md:grid-cols-2
    lg:grid-cols-2
    xl:grid-cols-3
    2xl:grid-cols-4
    
    "
        >
          {mappedAssistants.map(assistant => (
            <VoiceDashboardCard key={assistant.id} {...assistant} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center py-12 ">
          <p className="text-xl-regular text-error-400">
            خطا در بارگذاری دستیاران صوتی. لطفاً دوباره تلاش کنید.
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center py-12">
          <p className="text-textTertiary">موردی یافت نشد</p>
        </div>
      )}
    </>
  );
};

const VoiceAssistantsDashboardPage = () => {
  const { permissions } = useAppSelector(state => state.userPermissions);
  const isAdminUser = useMemo(
    () => permissions && permissions?.length > 0,
    [permissions],
  );

  const checkRoleComponent = (isAdmin: boolean) => {
    switch (isAdmin) {
      case true:
        return <AdminAssistantsPage />;
      default:
        return <UserVoiceAssistantsPage />;
    }
  };

  return (
    <HeaderDashboard
      label={isAdminUser ? 'مدیریت دستیاران صوتی' : 'دستیاران صوتی'}
      actionButton={
        isAdminUser && (
          <div className="flex justify-end items-center gap-4">
            <Button
              asChild
              aria-label="افزودن دستیار صوتی"
              className="gap-2 cursor-pointer w-full sm:w-auto"
              size="lg"
            >
              <Link href="/dashboard/voice-assistants/new">
                <DashboardPlusIcon />
                افزودن دستیاران صوتی
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

export default VoiceAssistantsDashboardPage;
