'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import HeaderDashboard from '@/components/pages/user-dashboard/components/HeaderDashboard';
import DeliveryTimeForm from '../components/DeliveryTimeForm';
import DeliveryTimeFormSkeleton from '../components/skeletons/DeliveryTimeFormSkeleton';
import { deliveryTimeSchema } from '../schemas';
import type { DeliveryTimeFormValues } from '../schemas';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';

const EditDeliveryTimePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient();
  const deliveryId = id ? Number(id) : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DeliveryTimeFormValues>({
    resolver: zodResolver(deliveryTimeSchema),
    defaultValues: {
      day: '',
      startTime: '',
      endTime: '',
      amount: '',
    },
    mode: 'onChange',
  });

  const { data: deliveryHourData, isLoading } = useQuery({
    queryKey: ['delivery-hour', deliveryId],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetdeliveryhourbyidGet(
        deliveryId,
      ),
    enabled: !!deliveryId,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  useEffect(() => {
    if (deliveryHourData) {
      reset({
        day: deliveryHourData.day ? String(deliveryHourData.day) : '',
        startTime: deliveryHourData.from || '',
        endTime: deliveryHourData.to || '',
        amount: deliveryHourData.price ? String(deliveryHourData.price) : '',
      });
    }
  }, [deliveryHourData, reset]);
  const saveMutation = useMutation({
    mutationFn: async (data: DeliveryTimeFormValues) => {
      const requestBody = {
        id: deliveryId || null,
        day: Number(data.day) as number,
        from: data.startTime || null,
        to: data.endTime || null,
        price: Number(data.amount),
      };

      return AdminDashboardService.apiServicesAppAdmindashboardCreateoreditdeliveringhourPost(
        requestBody,
      );
    },
    onSuccess: () => {
      toast.success('زمان ارسال با موفقیت ذخیره شد');
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.allDeliveringHours],
      });
      queryClient.invalidateQueries({
        queryKey: ['delivery-hour', deliveryId],
      });
      queryClient.removeQueries({
        queryKey: ['delivery-hour', deliveryId],
      });
      router.push('/dashboard/delivery');
    },
    onError: () => {
      toast.error('خطا در ذخیره زمان ارسال. لطفاً دوباره تلاش کنید.');
    },
  });

  const onSubmit = async (data: DeliveryTimeFormValues) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <HeaderDashboard label="ویرایش زمان ارسال">
        <DeliveryTimeFormSkeleton />
      </HeaderDashboard>
    );
  }

  return (
    <HeaderDashboard label="ویرایش زمان ارسال">
      <DeliveryTimeForm
        errors={errors}
        isSubmitting={isSubmitting || saveMutation.isPending}
        isValid={isValid}
        register={register}
        setValue={setValue}
        trigger={trigger}
        watch={watch}
        onSubmit={handleSubmit(onSubmit)}
      />
    </HeaderDashboard>
  );
};

export default EditDeliveryTimePage;
