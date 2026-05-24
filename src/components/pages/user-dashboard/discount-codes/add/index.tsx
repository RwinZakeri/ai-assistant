'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import HeaderDashboard from '../../components/HeaderDashboard';
import DiscountCodeForm from '../components/DiscountCodeForm';
import type { DiscountCodeFormData } from '../schemas';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { ApiError } from '@/apis/core/ApiError';

const AddDiscountCodePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: assistantsData } = useQuery({
    queryKey: ['all-assistants-lightweight'],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallassistantslightweightGet(),
  });

  const { data: speakersData } = useQuery({
    queryKey: ['all-speakers-lightweight'],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallspeakerslightweightGet(),
  });

  const voiceAssistantOptions =
    assistantsData?.map(assistant => ({
      value: String(assistant.assistantId ?? ''),
      label: assistant.title ?? '',
    })) ?? [];

  const deviceOptions =
    speakersData?.map(speaker => ({
      value: String(speaker.speakerId ?? ''),
      label: speaker.title ?? '',
    })) ?? [];

  const createDiscountCodeMutation = useMutation({
    mutationFn: (data: DiscountCodeFormData) => {
      const assistants = data.voiceAssistants
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));
      const speakers = data.devices
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));

      return AdminDashboardService.apiServicesAppAdmindashboardCreateoreditdiscountcodePost(
        {
          id: null,
          discountCode: data.code,
          discountPercentage: String(data.percentage),
          assistants: assistants.length > 0 ? assistants : null,
          speakers: speakers.length > 0 ? speakers : null,
          startDate: data.startDate || null,
          endDate: data.endDate || null,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.allDiscountCodes],
      });
      router.push('/dashboard/discount-codes');
    },
    onError: (error: unknown) => {
      let errorMessage = 'خطا در ثبت کد تخفیف. لطفاً دوباره تلاش کنید.';

      if (error instanceof ApiError && error.body) {
        if (typeof error.body === 'object' && error.body !== null) {
          const body = error.body as any;
          if (body.error?.message && typeof body.error.message === 'string') {
            errorMessage = body.error.message;
          }
        }
      }

      toast.error(errorMessage);
    },
  });

  const handleSubmit = (data: DiscountCodeFormData) => {
    createDiscountCodeMutation.mutate(data);
  };

  return (
    <HeaderDashboard label="افزودن کد">
      <div className="flex flex-col gap-6">
        <DiscountCodeForm
          deviceOptions={deviceOptions}
          isEdit={false}
          isLoading={createDiscountCodeMutation.isPending}
          voiceAssistantOptions={voiceAssistantOptions}
          onSubmit={handleSubmit}
        />
      </div>
    </HeaderDashboard>
  );
};

export default AddDiscountCodePage;
