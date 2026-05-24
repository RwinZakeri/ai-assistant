'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import HeaderDashboard from '../../../components/HeaderDashboard';
import DiscountCodeForm from '../../components/DiscountCodeForm';
import type { DiscountCodeFormData } from '../../schemas';
import { AdminDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/apis/core/ApiError';

const EditDiscountCodePage: React.FC<{ params: { id: string } }> = ({
  params,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const discountCodeId = parseInt(params.id, 10);

  const { data: discountCodeData, isLoading: isLoadingDiscountCode } = useQuery(
    {
      queryKey: [ReactQuery.discountCodeById, discountCodeId],
      queryFn: () =>
        AdminDashboardService.apiServicesAppAdmindashboardGetdiscountcodebyidGet(
          discountCodeId,
        ),
      enabled: !isNaN(discountCodeId),
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
    },
  );

  const { data: assistantsData, isLoading: isLoadingAssistants } = useQuery({
    queryKey: ['all-assistants-lightweight'],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallassistantslightweightGet(),
  });

  const { data: speakersData, isLoading: isLoadingSpeakers } = useQuery({
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

  const initialData: DiscountCodeFormData | undefined = useMemo(() => {
    if (!discountCodeData) {
      return undefined;
    }

    return {
      code: discountCodeData.code ?? '',
      percentage: discountCodeData.discountPercentage ?? 0,
      voiceAssistants:
        discountCodeData.assistants
          ?.filter(a => a.isActive === true)
          .map(a => String(a.id ?? ''))
          .filter(Boolean) ?? [],
      devices:
        discountCodeData.speakers
          ?.filter(s => s.isActive === true)
          .map(s => String(s.speakerId ?? ''))
          .filter(Boolean) ?? [],
      startDate:
        (discountCodeData as any).startDate ??
        (discountCodeData as any).start ??
        null,
      endDate:
        (discountCodeData as any).endDate ??
        (discountCodeData as any).end ??
        null,
    };
  }, [discountCodeData]);

  const saveDiscountCodeMutation = useMutation({
    mutationFn: (data: DiscountCodeFormData) => {
      const assistants = data.voiceAssistants
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));
      const speakers = data.devices
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));

      return AdminDashboardService.apiServicesAppAdmindashboardCreateoreditdiscountcodePost(
        {
          id: isNaN(discountCodeId) ? null : discountCodeId,
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
      let errorMessage = 'خطا در ویرایش کد تخفیف. لطفاً دوباره تلاش کنید.';

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
    saveDiscountCodeMutation.mutate(data);
  };

  const isLoadingData =
    isLoadingDiscountCode || isLoadingAssistants || isLoadingSpeakers;

  return (
    <HeaderDashboard label="ویرایش کد">
      <div className="flex flex-col gap-6">
        {isLoadingData ? (
          <div className="flex flex-col items-center gap-5 w-full justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex justify-center items-center border-b border-gray-800 pb-5 w-full gap-7"
              >
                <Skeleton className="w-[120px] h-5" />
                <Skeleton className="w-[512px] h-10" />
              </div>
            ))}
            <div className="flex w-full mt-6">
              <Skeleton className="w-[140px] h-10" />
            </div>
          </div>
        ) : (
          <DiscountCodeForm
            isEdit
            deviceOptions={deviceOptions}
            initialData={initialData}
            isLoading={saveDiscountCodeMutation.isPending}
            voiceAssistantOptions={voiceAssistantOptions}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </HeaderDashboard>
  );
};

export default EditDiscountCodePage;
