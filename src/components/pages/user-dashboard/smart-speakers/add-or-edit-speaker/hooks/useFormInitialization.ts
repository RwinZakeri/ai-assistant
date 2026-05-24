import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminDashboardService, CancelablePromise, SpeakerAvailableColors, SpeakerDetailsViewOutput } from '@/apis';
import { SpeakersService } from '@/apis/services/SpeakersService';
import ReactQuery from '@/configs/react_query_keys';
import type { UseFormSetValue } from 'react-hook-form';
import type { AddSpeakerFormData } from '../schemas';

export const useFormInitialization = (
  speakerId: number | undefined,
  isEditMode: boolean,
  setValue: UseFormSetValue<AddSpeakerFormData>,
) => {
  const [hasSetInitialFileIds, setHasSetInitialFileIds] = useState(false);
  const { data: AllColors } = useQuery({
    queryKey: [ReactQuery.allColors],
    queryFn: (): CancelablePromise<Array<SpeakerAvailableColors>> => {
      return AdminDashboardService.apiServicesAppAdmindashboardGetallcolorsGet();
    },
  });

  const { data: speakerDetailData, isLoading: isLoadingSpeaker } = useQuery({
    queryKey: [ReactQuery.speakerDetail, speakerId],
    queryFn: (): CancelablePromise<SpeakerDetailsViewOutput> => {
      if (!speakerId) throw new Error('Speaker ID is required');
      return SpeakersService.apiServicesAppSpeakersGetspeakerdetailbyidPost(
        speakerId,
      );
    },
    enabled: isEditMode && !!speakerId,
  });

  useEffect(() => {
    if (speakerId && isEditMode) {
      setHasSetInitialFileIds(false);
    }
  }, [speakerId, isEditMode]);

  useEffect(() => {
    if (
      isEditMode &&
      speakerDetailData &&
      !isLoadingSpeaker
    ) {
      setValue('name', speakerDetailData.title || '');
      setValue('deviceModel', speakerDetailData.deviceModel || '');
      setValue('price', speakerDetailData.originalPrice?.toString() || '');
      setValue(
        'discountPercent',
        speakerDetailData.discountPercent?.toString() || '',
      );
      setValue(
        'quantity',
        speakerDetailData.quantityInStorage?.toString() || '',
      );
      setValue('description', speakerDetailData.description || '');

      if (
        speakerDetailData.availableColors &&
        speakerDetailData.availableColors.length > 0
      ) {
        setValue(
          'colors',
          speakerDetailData.availableColors
            .map(color => color.id?.toString() || '')
            .filter(id => id !== ''),
        );
      }

      if (
        speakerDetailData.allTechnicalDetails &&
        speakerDetailData.allTechnicalDetails.length > 0
      ) {
        const topDetailTitles = new Set(
          (speakerDetailData.topTechnicalDetails || []).map(d => d.title),
        );
        const specs = speakerDetailData.allTechnicalDetails.map(detail => ({
          title: detail.title || '',
          description: detail.value || '',
          showontop: topDetailTitles.has(detail.title || ''),
        }));
        setValue('technicalSpecs', specs);
      } else if (
        speakerDetailData.topTechnicalDetails &&
        speakerDetailData.topTechnicalDetails.length > 0
      ) {
        const specs = speakerDetailData.topTechnicalDetails.map(detail => ({
          title: detail.title || '',
          description: detail.value || '',
          showontop: true,
        }));
        setValue('technicalSpecs', specs);
      }
    }
  }, [
    speakerDetailData,
    isEditMode,
    isLoadingSpeaker,
    setValue,
  ]);

  return {
    AllColors,
    speakerDetailData,
    isLoadingSpeaker,
    hasSetInitialFileIds,
    setHasSetInitialFileIds,
  };
};

