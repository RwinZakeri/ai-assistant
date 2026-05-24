'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormFieldGroup from '@/components/pages/user-dashboard/account/components/FormFieldGroup';
import type { FineTuningFile } from '@/components/pages/user-dashboard/voice-assistants/type';
import { Button } from '@/components/ui/button';
import { TextAreaField } from '@/components/ui/input/textarea-input';
import {
  useDocumentHandling,
  useFormInitialization,
  useImageHandling,
} from '../hooks';
import type { CreateEditAssistantFormData } from '../schemas';
import { createEditAssistantSchema } from '../schemas';
import type { AssistantFormProps } from '../types';
import AssistantTestChat from './AssistantTestChat';
import BasicInfoSection from './BasicInfoSection';
import DocumentsSection from './DocumentsSection';
import FineTuningUploadWithPreview from './FineTuningUploadWithPreview';
import FormActions from './FormActions';
import ImageUploadSection from './ImageUploadSection';
import SubscriptionSection from './SubscriptionSection';
import { isValidGuid, scrollToFirstError } from './utils';
import VoiceToneSection from './VoiceToneSection';

const AssistantForm = ({
  assistantId,
  onSubmit,
  isPending = false,
}: AssistantFormProps) => {
  const isEditMode = Boolean(assistantId);

  const form = useForm<CreateEditAssistantFormData>({
    resolver: zodResolver(createEditAssistantSchema),
    mode: 'onChange',
    defaultValues: {
      images: [],
      isActive: true,
      usePublicKnowledge: false,
      persianName: '',
      englishName: '',
      llmDescription: '',
      userDescription: '',
      voiceTone: [],
      characteristics: [],
      systemLlmPrompt: '',
      selectedLanguages: [],
      subscriptionType: '0',
      pricing: undefined,
      assistantRedLines: '',
    },
  });

  const {
    control,
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const {
    imageFileIds,
    setImageFileIds,
    isUploadingImages,
    imagePreviews,
    handleImagesUpload,
  } = useImageHandling(watch('images'), isEditMode);

  const {
    uploadedDocs,
    docCurrentPage,
    docPageSize,
    setDocCurrentPage,
    setDocPageSize,
    docTotalPages,
    docStartIndex,
    paginatedDocs,
    handleDocUpload,
    handleDeleteDoc,
  } = useDocumentHandling();

  const { languageOptions, isLoadingAssistant } = useFormInitialization(
    assistantId,
    isEditMode,
    reset,
    setImageFileIds,
  );

  const [fineTuningFiles, setFineTuningFiles] = useState<FineTuningFile[]>([]);

  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({
    control,
    name: 'pricing',
    rules: { minLength: 0 },
  });

  const subscriptionType = watch('subscriptionType');
  const isActive = watch('isActive');
  const usePublicKnowledge = watch('usePublicKnowledge');
  const images = watch('images');
  const voiceToneValues = watch('voiceTone') || [];

  const handleImageRemove = (index: number) => {
    const currentImages = watch('images') || [];
    const updatedImages = currentImages.filter(
      (_: File, i: number) => i !== index,
    );
    setValue('images', updatedImages);
    const updatedFileIds =
      imageFileIds.length === currentImages.length
        ? imageFileIds.filter((_: string, i: number) => i !== index)
        : imageFileIds.slice(0, updatedImages.length);
    const validFileIds = updatedFileIds.filter(isValidGuid);
    setImageFileIds(validFileIds);
  };

  const handleFormSubmit = async (data: CreateEditAssistantFormData) => {
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      setTimeout(() => scrollToFirstError(), 100);
      toast.error('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    onSubmit({
      formData: data,
      imageFileIds,
      uploadedDocs,
      fineTuningFiles,
    });
  };

  if (isEditMode && isLoadingAssistant) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-textSecondary">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(handleFormSubmit, validationErrors => {
        console.log('validationErrors', validationErrors);
        console.error('Form validation errors:', validationErrors);
        toast.error('لطفاً خطاهای فرم را برطرف کنید');
        setTimeout(() => scrollToFirstError(), 100);
      })}
    >
      <ImageUploadSection
        control={control}
        errors={errors}
        imageFileIds={imageFileIds}
        imagePreviews={imagePreviews}
        isUploadingImages={isUploadingImages}
        setValue={setValue}
        watch={watch}
        onImageRemove={handleImageRemove}
        onImagesChange={handleImagesUpload}
      />

      <div className="flex flex-col items-center gap-5 w-full justify-center">
        <BasicInfoSection
          control={control}
          errors={errors}
          isActive={isActive}
          languageOptions={languageOptions}
          register={register}
          setValue={setValue}
          usePublicKnowledge={usePublicKnowledge}
        />

        <VoiceToneSection
          control={control}
          errors={errors}
          setValue={setValue}
          voiceToneValues={voiceToneValues}
          watch={watch}
        />

        <SubscriptionSection
          appendPricing={appendPricing}
          control={control}
          errors={errors}
          pricingFields={pricingFields}
          removePricing={removePricing}
          setValue={setValue}
          subscriptionType={subscriptionType}
          watch={watch}
        />

        <FormFieldGroup
          className="gap-7 flex justify-center items-center border-b border-gray-800 pb-5"
          label="خط قرمزهای دستیار"
        >
          <TextAreaField
            className="w-[512px]"
            error={errors.assistantRedLines?.message}
            placeholder="خط قرمزهای دستیار"
            textareaClassName="w-[512px] text-right min-h-[150px]"
            {...register('assistantRedLines')}
          />
        </FormFieldGroup>
      </div>

      <DocumentsSection
        docCurrentPage={docCurrentPage}
        docPageSize={docPageSize}
        docStartIndex={docStartIndex}
        docTotalPages={docTotalPages}
        paginatedDocs={paginatedDocs}
        uploadedDocs={uploadedDocs}
        onDeleteDoc={handleDeleteDoc}
        onDocUpload={handleDocUpload}
        onPageChange={setDocCurrentPage}
        onPageSizeChange={setDocPageSize}
      />

      <div className="flex flex-col gap-4 mt-10">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">فاین تیون دستیار صوتی</p>
          <Button
            size="lg"
            type="button"
            variant="primary"
            onClick={() => {
              console.log('افزودن فایل فاین تیون clicked');
            }}
          >
            <p className="font-semibold text-lg">شروع فاین تیون</p>
          </Button>
        </div>

        <FineTuningUploadWithPreview
          className="w-full"
          files={fineTuningFiles}
          onChange={setFineTuningFiles}
        />
      </div>

      <div className="my-4">
        <p className="font-semibold text-lg">تست متن به متن (یا صوت)</p>

        <FormFieldGroup
          className="gap-2 flex flex-col justify-center items-center  pb-5 mt-4"
          label=""
        >
          <div className="w-full ">
            <AssistantTestChat assistantId={assistantId} />
          </div>
        </FormFieldGroup>
      </div>

      <FormActions
        isEditMode={isEditMode}
        isPending={isPending}
        isSubmitting={isSubmitting}
        onCancel={() => {}}
      />
    </form>
  );
};

export default AssistantForm;
