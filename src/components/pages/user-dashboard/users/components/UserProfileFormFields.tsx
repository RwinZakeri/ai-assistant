// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TextInput } from '@/components/ui/input/text-input';
import { TextAreaField } from '@/components/ui/input/textarea-input';
import { Button } from '@/components/ui/button';
import { AdminDashboardService } from '@/apis';
import UserProfileFormFieldsSkeleton from './skeletons/UserProfileFormFieldsSkeleton';
import FormFieldGroup from '../../account/components/FormFieldGroup';
import { accountDetailsSchema } from '../../account/schemas';
import type { AccountDetailsFormValues } from '../../account/schemas';
import dynamic from 'next/dynamic';
import WithBorderTabs from '@/components/ui/tabs/with-border';
import { useUserProfile } from './UserProfileContext';
import { persianToEnglish } from '@/utils/persianToEnglish';

const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
  ssr: false,
});

const UserProfileFormFields: React.FC = () => {
  const { userId } = useUserProfile();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const { data: userData, isLoading } = useQuery({
    queryKey: ['userProfileDetail', userId],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetuserprofiledetailGet(
        parseInt(userId),
      ),
    enabled: !!userId,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AccountDetailsFormValues>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      addressLine: '',
      plaque: '',
      unit: '',
      postalCode: '',
    },
  });

  const roleTabs =
    userData?.allRolesForUser?.map(role => ({
      label: role.roleName ?? '',
      value: String(role.roleId ?? ''),
    })) ?? [];

  const activeRoleId =
    selectedRoleId ??
    userData?.allRolesForUser?.find(r => r.isActive)?.roleId ??
    userData?.allRolesForUser?.[0]?.roleId ??
    null;

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.name || '',
        lastName: userData.lastName || '',
        phone: userData.phoneNumber || '',
        email: userData.emailAddress || '',
        addressLine: userData.fullAddress || '',
        plaque: userData.no || '',
        unit: userData.unit?.toString() || '',
        postalCode: userData.postalCode || '',
      });
      setLat(userData.latitude ?? null);
      setLng(userData.longitude ?? null);
    }
  }, [userData, reset]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(Number(roleId) || null);
  };

  const handleMapChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  const registerField = <T extends keyof AccountDetailsFormValues>(
    fieldName: T,
  ) => register(fieldName);

  const handlePlaqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const convertedValue = persianToEnglish(value);
    setValue('plaque', convertedValue);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const convertedValue = persianToEnglish(value);
    const digitsOnly = convertedValue.replace(/\D/g, '');
    setValue('unit', digitsOnly);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const convertedValue = persianToEnglish(value);
    const digitsOnly = convertedValue.replace(/\D/g, '');
    setValue('postalCode', digitsOnly);
  };

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = new Set([
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
      'Enter',
    ]);
    if (allowedKeys.has(e.key)) {
      return;
    }
    const isEnglishDigit = /^\d$/.test(e.key);
    const isPersianDigit = /^[۰-۹]$/.test(e.key);
    if (!isEnglishDigit && !isPersianDigit) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data: AccountDetailsFormValues) => {
    setIsSubmitting(true);
    try {
      await AdminDashboardService.apiServicesAppAdmindashboardUpdateuserprofiledetailbyadminPost(
        {
          userId: parseInt(userId),
          name: data.firstName || null,
          lastName: data.lastName || null,
          phoneNumber: data.phone || null,
          emailAddress: data.email || null,
          fullAddress: data.addressLine || null,
          no: data.plaque || null,
          unit: data.unit ? parseInt(data.unit, 10) : null,
          postalCode: data.postalCode || null,
          latitude: lat,
          longitude: lng,
          roleId: activeRoleId,
        },
      );

      queryClient.invalidateQueries({
        queryKey: ['userProfileDetail', userId],
      });
      toast.success('تغییرات با موفقیت ذخیره شد.');
    } catch (error) {
      toast.error('خطا در ذخیره تغییرات. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <UserProfileFormFieldsSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="flex justify-center w-full">
        <div className="flex flex-col items-center gap-5 w-full justify-center ">
          <FormFieldGroup
            className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
            label="نام"
          >
            <div className="w-[512px] flex flex-row gap-7">
              <TextInput
                className="w-full"
                error={errors.firstName?.message}
                inputClassName="text-right"
                placeholder="نام"
                {...registerField('firstName')}
              />
              <TextInput
                className="w-full"
                error={errors.lastName?.message}
                inputClassName="text-right"
                placeholder="نام خانوادگی"
                {...registerField('lastName')}
              />
            </div>
          </FormFieldGroup>

          <FormFieldGroup
            className="flex justify-center items-center border-b border-gray-800 pb-5"
            label="شماره موبایل"
          >
            <TextInput
              disabled
              className="w-[512px]"
              error={errors.phone?.message}
              inputClassName="w-[512px] text-right"
              placeholder="شماره موبایل"
              type="number"
              {...registerField('phone')}
            />
          </FormFieldGroup>

          <FormFieldGroup
            className="flex justify-center items-center border-b border-gray-800 pb-5"
            label="ایمیل"
          >
            <TextInput
              className="w-[512px]"
              error={errors.email?.message}
              inputClassName="w-[512px] text-right"
              placeholder="ایمیل"
              {...registerField('email')}
            />
          </FormFieldGroup>

          <FormFieldGroup
            className="flex flex-col justify-center items-center pb-5 gap-7"
            label="آدرس"
          >
            <div className="w-[512px] h-[288px] bg-surfacePrimary rounded-2xl overflow-hidden">
              <MapPicker
                initialLat={lat}
                initialLng={lng}
                onChange={handleMapChange}
              />
            </div>
            <Button className="w-[512px]" size="xl" variant="primary">
              ثبت آدرس
            </Button>
          </FormFieldGroup>

          <FormFieldGroup
            className="flex flex-col justify-center items-center border-b border-gray-800 pb-5"
            label=""
          >
            <div className="w-full flex flex-col justify-center items-center relative gap-7">
              <TextAreaField
                className="w-[512px]"
                error={errors.addressLine?.message}
                placeholder="نشانی دقیق خود را وارد کنید"
                textareaClassName="w-[512px] min-h-[110px] text-right resize-none"
                {...registerField('addressLine')}
              />
              <div className="w-[512px] flex flex-row gap-7">
                <TextInput
                  className="w-full"
                  error={errors.plaque?.message}
                  inputClassName="text-right"
                  placeholder="پلاک"
                  {...registerField('plaque')}
                  onChange={handlePlaqueChange}
                />
                <TextInput
                  className="w-full"
                  error={errors.unit?.message}
                  inputClassName="text-right"
                  placeholder="واحد"
                  {...registerField('unit')}
                  onChange={handleUnitChange}
                  onKeyDown={handleNumericKeyDown}
                />
              </div>
              <TextInput
                className="w-[512px]"
                error={errors.postalCode?.message}
                inputClassName="w-[512px] text-right"
                placeholder="کد پستی"
                {...registerField('postalCode')}
                onChange={handlePostalCodeChange}
                onKeyDown={handleNumericKeyDown}
              />
            </div>
          </FormFieldGroup>

          <FormFieldGroup
            className="flex flex-col justify-center items-center border-b border-gray-800 pb-5 gap-5"
            label="نقش"
          >
            <div className="w-[512px] flex flex-col gap-5">
              {roleTabs.length > 0 && (
                <WithBorderTabs
                  activeTab={String(activeRoleId ?? '')}
                  activeTabClassName="text-textSecondary bg-surfaceSecondary"
                  containerClassName="p-[4px] h-[46px]"
                  inactiveTabClassName="text-textSecondary"
                  setActiveTab={handleRoleChange}
                  tabClassName="h-[36px]"
                  tabs={roleTabs}
                />
              )}
            </div>
          </FormFieldGroup>

          <div className="flex  w-full  mt-6">
            <Button
              className="cursor-pointer"
              disabled={isSubmitting}
              size="lg"
              type="submit"
              variant="primary"
            >
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
};

export default UserProfileFormFields;
