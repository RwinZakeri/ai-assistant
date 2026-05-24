// @ts-nocheck

'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input/text-input';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import WithBorderTabs from '@/components/ui/tabs/with-border';
import HeaderDashboard from '../../components/HeaderDashboard';
import FormFieldGroup from '../../account/components/FormFieldGroup';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import type { ResponseSpeedType } from '@/enums/enum';
import type { SpeakerDetailsFormValues, SpeakerDetailsProps } from './types';
import {
  parseUserIdWithFallback,
  getResponseSpeedValue,
  getResponseSpeedFromValue,
} from '../utils';
import SpeakerDetailsSkeleton from './skeletons/SpeakerDetailsSkeleton';
import { useUserProfile } from './UserProfileContext';

const SpeakerDetails = ({ speakerId }: Omit<SpeakerDetailsProps, 'userId'>) => {
  const { userId } = useUserProfile();
  const userIdNumber = parseUserIdWithFallback(userId);
  const speakerIdNumber = parseUserIdWithFallback(speakerId);
  const queryClient = useQueryClient();

  const { data: speakerData, isLoading } = useQuery({
    queryKey: [ReactQuery.userSpeakerDetail, userId, speakerId],
    queryFn: () => {
      return AdminDashboardService.apiServicesAppAdmindashboardGetuserspeakerdetailGet(
        userIdNumber,
        speakerIdNumber,
      );
    },
    enabled:
      !!userIdNumber &&
      userIdNumber > 0 &&
      !!speakerIdNumber &&
      speakerIdNumber > 0,
  });

  const assistantOptions =
    speakerData?.userAssistants?.map(assistant => ({
      value: assistant.assistantId?.toString() || '',
      label: assistant.persianTitle || '',
    })) || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SpeakerDetailsFormValues>({
    defaultValues: {
      speakerName: '',
      deviceModel: '',
      responseSpeed: 'deliberate',
      activeAssistants: [],
    },
  });

  useEffect(() => {
    if (speakerData) {
      reset({
        speakerName: speakerData.speakerName || '',
        deviceModel: speakerData.speakerModel || '',
        responseSpeed: getResponseSpeedValue(speakerData.responseSpeed),
        activeAssistants:
          speakerData.userAssistants
            ?.filter(a => a.isActive)
            .map(a => a.assistantId?.toString() || '')
            .filter(Boolean) || [],
      });
    }
  }, [speakerData, reset]);

  const responseSpeed = watch('responseSpeed');
  const activeAssistants = watch('activeAssistants');

  const handleResponseSpeedChange = (value: string) => {
    setValue('responseSpeed', value);
  };

  const updateSpeakerMutation = useMutation({
    mutationFn: (input: {
      userId: number;
      speakerId: number;
      speakerName?: string;
      speakerModel?: string;
      responseSpeed?: ResponseSpeedType;
      assistantIds?: number[];
    }) =>
      AdminDashboardService.apiServicesAppAdmindashboardUpdateuserspeakerdetailPut(
        input,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.userSpeakerDetail, userId, speakerId],
      });

      queryClient.invalidateQueries({
        queryKey: [ReactQuery.userSpeakers, userId],
      });
      toast.success('اطلاعات اسپیکر با موفقیت ویرایش شد.');
    },
    onError: () => {
      toast.error('خطا در ویرایش اطلاعات اسپیکر. لطفاً دوباره تلاش کنید.');
    },
  });

  const onSubmit = (data: SpeakerDetailsFormValues) => {
    const assistantIds = data.activeAssistants
      .map(id => parseInt(id, 10))
      .filter(id => !isNaN(id));

    const responseSpeed = getResponseSpeedFromValue(data.responseSpeed);

    updateSpeakerMutation.mutate({
      userId: userIdNumber,
      speakerId: speakerIdNumber,
      speakerName: data.speakerName || undefined,
      speakerModel: data.deviceModel || undefined,
      responseSpeed,
      assistantIds: assistantIds.length > 0 ? assistantIds : undefined,
    });
  };

  if (isLoading) {
    return (
      <HeaderDashboard label="جزئیات اسپیکر">
        <div className="flex flex-col gap-6">
          <SpeakerDetailsSkeleton />
        </div>
      </HeaderDashboard>
    );
  }

  return (
    <HeaderDashboard label="جزئیات اسپیکر">
      <div className="flex flex-col gap-6">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <section className="flex justify-center w-full">
            <div className="flex flex-col items-center gap-5 w-full justify-center">
              <FormFieldGroup
                className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
                label="نام اسپیکر"
              >
                <TextInput
                  className="w-[512px]"
                  error={errors.speakerName?.message}
                  inputClassName="w-[512px] text-right"
                  placeholder="نام اسپیکر"
                  {...register('speakerName', {
                    required: 'نام اسپیکر الزامی است',
                  })}
                />
              </FormFieldGroup>

              <FormFieldGroup
                className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
                label="مدل دستگاه"
              >
                <TextInput
                  className="w-[512px]"
                  error={errors.deviceModel?.message}
                  inputClassName="w-[512px] text-right"
                  placeholder="مدل دستگاه"
                  {...register('deviceModel', {
                    required: 'مدل دستگاه الزامی است',
                  })}
                />
              </FormFieldGroup>

              <FormFieldGroup
                className="flex flex-col justify-center items-center border-b border-gray-800 pb-5 gap-5"
                label="سرعت پاسخ‌گویی"
              >
                <div className="w-[512px]">
                  <WithBorderTabs
                    activeTab={responseSpeed}
                    activeTabClassName="text-textSecondary bg-surfaceSecondary"
                    containerClassName="p-[4px] h-[46px]"
                    inactiveTabClassName="text-textSecondary"
                    setActiveTab={handleResponseSpeedChange}
                    tabClassName="h-[36px]"
                    tabs={[
                      { label: 'حاضر جواب', value: 'quick' },
                      { label: 'با طمانینه', value: 'deliberate' },
                    ]}
                  />
                </div>
              </FormFieldGroup>

              <FormFieldGroup
                className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
                label="دستیارهای فعال"
              >
                <DropdownInput
                  className="w-[512px]"
                  options={assistantOptions}
                  placeholder="انتخاب کنید"
                  type="tags"
                  value={activeAssistants}
                  onValueChange={value =>
                    setValue('activeAssistants', value as string[])
                  }
                />
              </FormFieldGroup>
            </div>
          </section>

          <div className="flex w-full">
            <Button
              className="cursor-pointer"
              disabled={updateSpeakerMutation.isPending}
              loading={updateSpeakerMutation.isPending}
              size="lg"
              type="submit"
              variant="primary"
            >
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </div>
    </HeaderDashboard>
  );
};

export default SpeakerDetails;
