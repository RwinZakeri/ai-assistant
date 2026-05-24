import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminDashboardService, LanguageService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { isValidGuid } from '../components/utils';

export const useFormInitialization = (
  assistantId: number | undefined,
  isEditMode: boolean,
  reset: (values: any) => void,
  setImageFileIds: (ids: string[]) => void,
) => {
  const { data: languagesData } = useQuery({
    queryKey: [ReactQuery.allLanguages],
    queryFn: () => LanguageService.apiServicesAppLanguageAppgetlanguagesGet(),
  });

  const { data: assistantData, isLoading: isLoadingAssistant } = useQuery({
    queryKey: ['GetAssistantDetailForEdit', assistantId],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetassistantdetailforeditGet(
        assistantId!,
      ),
    enabled: isEditMode && !!assistantId,
  });

  useEffect(() => {
    if (isEditMode && assistantData && !isLoadingAssistant) {
      const data = assistantData;

      let subscriptionType: '0' | '1' | '2' = '0';
      let pricing:
        | Array<{ duration: string; price: string; discount: string }>
        | undefined = undefined;

      if (
        data.assistantSubscriptions &&
        data.assistantSubscriptions.length > 0
      ) {
        const firstSubscription = data.assistantSubscriptions[0];
        subscriptionType = String(firstSubscription.subscriptionType || 0) as
          | '0'
          | '1'
          | '2';
        pricing = data.assistantSubscriptions.map(sub => ({
          duration: String(sub.durationInDays || ''),
          price: String(sub.price || ''),
          discount: '',
        }));
      }

      reset({
        isActive: data.isActive ?? true,
        usePublicKnowledge: data.usePublicKnowledge ?? false,
        persianName: data.persianTitle || '',
        englishName: data.englishTitle || '',
        llmDescription: data.llmDescription || '',
        userDescription: data.userDescription || '',
        systemLlmPrompt: data.systemLlmPrompt || '',
        assistantRedLines: data.assistantRedLines || '',
        selectedLanguages:
          data.selectedLanguages
            ?.map(lang => lang.id)
            .filter((id): id is number => id !== undefined) || [],
        subscriptionType,
        pricing,
        characteristics: [],
        voiceTone:
          data.selectedAssistantTones?.map(tone => tone.title || '') || [],
        images: [],
      });

      if (data.images && data.images.length > 0) {
        setImageFileIds(data.images.filter(isValidGuid));
      }
    }
  }, [assistantData, isEditMode, isLoadingAssistant, reset, setImageFileIds]);

  const languageOptions = languagesData
    ? languagesData
        .filter(lang => lang.id != null && lang.displayName)
        .map(lang => ({
          label: lang.displayName ?? '',
          value: String(lang.id!),
        }))
    : [];

  return {
    languageOptions,
    isLoadingAssistant,
  };
};
