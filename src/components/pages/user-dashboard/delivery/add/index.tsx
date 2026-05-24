'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import HeaderDashboard from '@/components/pages/user-dashboard/components/HeaderDashboard';
import DeliveryTimeForm from '../components/DeliveryTimeForm';
import { deliveryTimeSchema } from '../schemas';
import type { DeliveryTimeFormValues } from '../schemas';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';

const AddDeliveryTimePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const saveMutation = useMutation({
    mutationFn: async (data: DeliveryTimeFormValues) => {
      const requestBody = {
        id: null,
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
      toast.success('زمان ارسال با موفقیت ایجاد شد');
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.allDeliveringHours],
      });
      reset();
      router.push('/dashboard/delivery');
    },
    onError: () => {
      toast.error('خطا در ایجاد زمان ارسال. لطفاً دوباره تلاش کنید.');
    },
  });

  const onSubmit = async (data: DeliveryTimeFormValues) => {
    saveMutation.mutate(data);
  };

  return (
    <HeaderDashboard label="افزودن زمان ارسال">
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

export default AddDeliveryTimePage;
