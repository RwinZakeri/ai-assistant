'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AdminDashboardService } from '@/apis';
import type { ApiError } from '@/apis/core/ApiError';
import type { CreateOrEditAssistantInput } from '@/apis/models/CreateOrEditAssistantInput';
import { DownloadIcon } from '@/assets/images/svg/Download';
import type { CreateEditAssistantPageProps } from '@/components/pages/user-dashboard/voice-assistants/type';
import { Button } from '@/components/ui/button';
import {
  UnderlineTabs,
  UnderlineTabsContent,
  UnderlineTabsList,
  UnderlineTabsTrigger,
} from '@/components/ui/tabs/underline';
import ReactQuery from '@/configs/react_query_keys';
import { getToken } from '@/utils/cookies';
import HeaderDashboard from '../../../../components/HeaderDashboard';
import AssistantForm from './components/AssistantForm';
import type { CreateEditAssistantFormData } from './schemas';
import Comments from './tabs/comment';
import Questions from './tabs/questions';

const isValidGuid = (id: string | null | undefined): boolean => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  const trimmed = id.trim();
  if (trimmed.length === 0) {
    return false;
  }
  const guidPattern = /^[0-9a-fA-F-]{32,36}$/;
  return guidPattern.test(
    trimmed.replace(/-/g, '').length >= 32 ? trimmed : trimmed,
  );
};

const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = getToken();
  const headers: HeadersInit = {
    'tenant.id': '1',
    'aspnetcore.culture': 'fa',
    'accept-language': 'fa',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://assist.isnode.ir';
  const response = await fetch(`${apiUrl}/File/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorText: string;
    try {
      const errorJson = await response.json();
      errorText =
        errorJson?.error?.message ||
        errorJson?.message ||
        JSON.stringify(errorJson);
    } catch {
      errorText = await response.text();
    }
    throw new Error(`Upload failed: ${response.status} ${errorText}`);
  }

  let result: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      result = await response.json();
    } catch (error) {
      const textResponse = await response.text();
      console.error('Failed to parse JSON response:', textResponse);
      throw new Error(`Invalid JSON response from server: ${textResponse}`);
    }
  } else {
    const textResponse = await response.text();
    if (textResponse.trim()) {
      result = textResponse.trim();
    } else {
      throw new Error('Empty response from server');
    }
  }

  let fileId: string | null = null;

  if (typeof result === 'string') {
    fileId = result;
  } else if (result && typeof result === 'object') {
    fileId =
      result?.result?.fileToken ||
      result?.result?.fileId ||
      result?.result?.id ||
      result?.fileToken ||
      result?.fileId ||
      result?.id ||
      result?.data?.fileToken ||
      result?.data?.fileId ||
      result?.data?.id ||
      (typeof result?.result === 'string' ? result.result : null) ||
      (typeof result?.data === 'string' ? result.data : null);
  }

  if (!fileId || typeof fileId !== 'string' || fileId.trim().length === 0) {
    console.error(
      'Upload response structure:',
      JSON.stringify(result, null, 2),
    );
    throw new Error(
      `File ID not found in upload response or is not a valid GUID. Response structure: ${JSON.stringify(
        result,
      )}`,
    );
  }

  return fileId.trim();
};

const CreateEditAssistantPage = ({
  assistantId,
}: CreateEditAssistantPageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const isEditMode = Boolean(assistantId);
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    return tabParam &&
      ['specifications', 'comments', 'questions'].includes(tabParam)
      ? tabParam
      : 'specifications';
  });
  const [exportQuestionsHandler, setExportQuestionsHandler] = useState<
    (() => void) | null
  >(null);
  const [isExportQuestionsLoading, setIsExportQuestionsLoading] =
    useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (
      tabParam &&
      ['specifications', 'comments', 'questions'].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      if ('status' in error && 'body' in error) {
        const apiError = error as ApiError;
        if (apiError.body) {
          if (typeof apiError.body === 'string') {
            try {
              const parsed = JSON.parse(apiError.body);
              return (
                parsed.error?.message ||
                parsed.message ||
                parsed.error ||
                apiError.message
              );
            } catch {
              return apiError.body;
            }
          }
          if (typeof apiError.body === 'object') {
            return (
              (apiError.body as any).error?.message ||
              (apiError.body as any).message ||
              (apiError.body as any).error ||
              apiError.message
            );
          }
        }
        return (
          apiError.message || `خطای ${apiError.status}: ${apiError.statusText}`
        );
      }
      return error.message;
    }
    return 'خطای نامشخص رخ داد';
  };

  const scrollToFirstError = () => {
    const firstErrorField = document.querySelector('[role="alert"]');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const firstInvalidInput = document.querySelector(
      '[aria-invalid="true"]',
    ) as HTMLElement | null;
    if (firstInvalidInput) {
      firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidInput.focus();
    }
  };

  const createEditMutation = useMutation({
    mutationFn: async (
      data: CreateEditAssistantFormData & {
        _imageFileIds?: string[];
        _learningDocFileIds?: string[];
        _tuningFileIds?: string[];
      },
    ) => {
      const validImageFileIds =
        data._imageFileIds && data._imageFileIds.length > 0
          ? data._imageFileIds.filter(isValidGuid)
          : [];

      const requestBody: CreateOrEditAssistantInput = {
        id: isEditMode ? (assistantId ?? undefined) : undefined,
        isActive: data.isActive,
        usePublicKnowledge: data.usePublicKnowledge,
        persianTitle: data.persianName || null,
        englishTitle: data.englishName || null,
        llmDescription: data.llmDescription || null,
        userDescription: data.userDescription || null,
        systemLlmPrompt: data.systemLlmPrompt || null,
        assistantRedLines: data.assistantRedLines || null,
        images: validImageFileIds.length > 0 ? validImageFileIds : null,
        selectedLanguages:
          data.selectedLanguages && data.selectedLanguages.length > 0
            ? data.selectedLanguages
            : null,
        assistantSubscriptions:
          data.subscriptionType === '0'
            ? [
                {
                  subscriptionType: 0,
                  title: null,
                  price: 0,
                  discoutPercent: 0,
                  durationInDays: 0,
                },
              ]
            : data.pricing &&
                Array.isArray(data.pricing) &&
                data.pricing.length > 0
              ? data.pricing.map(p => ({
                  subscriptionType: Number(data.subscriptionType) as 0 | 1 | 2,
                  title: null,
                  price: Number(p.price) || 0,
                  discoutPercent:
                    p.discount &&
                    p.discount.trim() &&
                    !isNaN(Number(p.discount))
                      ? Number(p.discount)
                      : null,
                  durationInDays: Number(p.duration) || 0,
                }))
              : null,
        selectedAssistantTones: null,
        assistantLearningDocs:
          data._learningDocFileIds && data._learningDocFileIds.length > 0
            ? data._learningDocFileIds
            : null,
        assistantTuningFiles:
          data._tuningFileIds && data._tuningFileIds.length > 0
            ? data._tuningFileIds
            : null,
      };

      return AdminDashboardService.apiServicesAppAdmindashboardCreateoreditassistantPost(
        requestBody,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.GetAllAssistantsForAdmin],
      });
      toast.success(
        isEditMode ? 'دستیار با موفقیت ویرایش شد' : 'دستیار با موفقیت ایجاد شد',
      );
      router.push('/dashboard/voice-assistants');
    },
    onError: (error: unknown) => {
      console.error('Error creating/editing assistant:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(
        `${
          isEditMode ? 'خطا در ویرایش دستیار' : 'خطا در ایجاد دستیار'
        }: ${errorMessage}`,
      );
    },
  });

  const handleFormSubmit = async (data: {
    formData: CreateEditAssistantFormData;
    imageFileIds: string[];
    uploadedDocs: Array<{
      id: string;
      file: File;
      fileName: string;
      uploadDate: Date;
    }>;
    fineTuningFiles: Array<{
      id: string;
      file: File;
      fileName: string;
      uploadDate: Date;
    }>;
  }) => {
    let learningDocIds: string[] = [];
    if (data.uploadedDocs.length > 0) {
      try {
        const uploadPromises = data.uploadedDocs.map(doc =>
          uploadFile(doc.file),
        );
        learningDocIds = await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Error uploading learning docs:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(`خطا در آپلود فایل‌های آموزشی: ${errorMessage}`);
        throw error;
      }
    }

    let tuningFileIds: string[] = [];
    if (data.fineTuningFiles.length > 0) {
      try {
        const uploadPromises = data.fineTuningFiles.map(file =>
          uploadFile(file.file),
        );
        tuningFileIds = await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Error uploading tuning files:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(`خطا در آپلود فایل‌های فاین تیون: ${errorMessage}`);
        throw error;
      }
    }

    const validImageFileIds =
      data.imageFileIds && data.imageFileIds.length > 0
        ? data.imageFileIds.filter(isValidGuid)
        : [];

    createEditMutation.mutate({
      ...data.formData,
      _imageFileIds: validImageFileIds,
      _learningDocFileIds: learningDocIds,
      _tuningFileIds: tuningFileIds,
    });
  };

  const handleExportReady = useCallback(
    (handler: () => void, isLoading: boolean) => {
      setExportQuestionsHandler(handler);
      setIsExportQuestionsLoading(isLoading);
    },
    [],
  );

  return (
    <HeaderDashboard
      label={isEditMode ? 'ویرایش دستیار' : 'افزودن دستیار'}
      actionButton={
        activeTab === 'questions' && exportQuestionsHandler ? (
          <Button
            disabled={isExportQuestionsLoading}
            variant="primary"
            onClick={exportQuestionsHandler}
          >
            <DownloadIcon />{' '}
            {isExportQuestionsLoading ? 'درحال دانلود' : 'دانلود'}
          </Button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-6">
        <UnderlineTabs value={activeTab} onValueChange={setActiveTab}>
          <UnderlineTabsList>
            <UnderlineTabsTrigger value="specifications">
              مشخصات
            </UnderlineTabsTrigger>
            {isEditMode && (
              <UnderlineTabsTrigger value="comments">
                نظرات
              </UnderlineTabsTrigger>
            )}
            {isEditMode && (
              <UnderlineTabsTrigger value="questions">
                سؤالات
              </UnderlineTabsTrigger>
            )}
          </UnderlineTabsList>
          <UnderlineTabsContent value="specifications">
            <AssistantForm
              assistantId={assistantId}
              isPending={createEditMutation.isPending}
              onSubmit={handleFormSubmit}
            />
          </UnderlineTabsContent>

          {isEditMode && <Comments assistantId={assistantId!} />}

          {isEditMode && (
            <Questions
              assistantId={assistantId}
              isEditMode={isEditMode}
              onExportReady={handleExportReady}
            />
          )}
        </UnderlineTabs>
      </div>
    </HeaderDashboard>
  );
};

export default CreateEditAssistantPage;
