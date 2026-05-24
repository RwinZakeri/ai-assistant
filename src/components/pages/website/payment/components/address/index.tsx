'use client';

import { UserDashboardService } from '@/apis';
import { Plus2Icon } from '@/assets/images/svg/Plus2';
import type { AccountDetailsFormValues } from '@/components/pages/user-dashboard/account/schemas';
import { accountDetailsSchema } from '@/components/pages/user-dashboard/account/schemas';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input/text-input';
import { TextAreaField } from '@/components/ui/input/textarea-input';
import MapPicker from '@/components/ui/map-picker';
import ReactQuery from '@/configs/react_query_keys';
import { useAppSelector } from '@/store';
import { persianToEnglish } from '@/utils/persianToEnglish';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const Address = ({
  addressEditMode,
  setAddressEditMode,
  userEnteredAddress,
}: {
  addressEditMode: boolean;
  setAddressEditMode: (value: boolean) => void;
  userEnteredAddress?: boolean;
}) => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { data: profileData } = useAppSelector(state => state.userProfile);

  const updateProfileMutation = useMutation({
    mutationFn: (data: AccountDetailsFormValues) => {
      const updateData = {
        name: data.firstName || null,
        lastName: data.lastName || null,
        emailAddress: data.email || null,
        fullAddress: data.addressLine || null,
        no: data.plaque || null,
        unit: data.unit ? parseInt(data.unit, 10) : null,
        postalCode: data.postalCode || null,
        latitude: lat,
        longitude: lng,
      };
      return UserDashboardService.apiServicesAppUserdashboardUpdatecurrentuserprofilePost(
        updateData,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.userProfileDetail],
      });
      setAddressEditMode(false);
      toast.success('تغییرات با موفقیت ذخیره شد.');
    },
    onError: () => {
      toast.error('خطا در ذخیره تغییرات. لطفاً دوباره تلاش کنید.');
    },
  });

  const onSubmit = (data: AccountDetailsFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const registerField = <T extends keyof AccountDetailsFormValues>(
    fieldName: T,
  ) => register(fieldName);

  const handleMapChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };
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

  useEffect(() => {
    if (profileData) {
      reset({
        firstName: profileData.name || '',
        lastName: profileData.lastName || '',
        phone: profileData.phoneNumber || '',
        email: profileData.emailAddress || '',
        addressLine: profileData.fullAddress || '',
        plaque: profileData.no || '',
        unit: profileData.unit?.toString() || '',
        postalCode: profileData.postalCode || '',
      });
      setLat(profileData.latitude ?? null);
      setLng(profileData.longitude ?? null);
    }
    console.log(profileData);
  }, [profileData, reset]);

  if (addressEditMode) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center items-start pb-5 gap-7">
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
        </div>

        <div className="flex flex-col justify-center items-start  pb-5">
          <div className="w-full flex flex-col justify-center items-start relative gap-7">
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
        </div>
      </form>
    );
  }
  if (userEnteredAddress) {
    return (
      <div className="flex justify-between items-start  gap-3">
        <TextAreaField
          className="w-[512px]"
          placeholder="نشانی دقیق خود را وارد کنید"
          textareaClassName="w-[512px] min-h-[110px] text-right resize-none"
          value={profileData?.fullAddress as string}
        />
        <Button
          size="sm"
          variant="linkColor"
          onClick={() => setAddressEditMode(true)}
        >
          تغییر آدرس
        </Button>
      </div>
    );
  }
  return (
    <Button onClick={() => setAddressEditMode(true)}>
      <Plus2Icon className="text-[10px]" />
    </Button>
  );
};

export default Address;
