'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm } from 'react-hook-form';

import HeaderDashboard from '../../components/HeaderDashboard';
import BasicInfoSection from './components/BasicInfoSection';
import FormActions from './components/FormActions';
import ImageUploadSection from './components/ImageUploadSection';
import TechnicalSpecsSection from './components/TechnicalSpecsSection';
import {
  useFormInitialization,
  useImageHandling,
  useSpeakerMutation,
} from './hooks';
import { addSpeakerSchema } from './schemas';
import type { AddSpeakerFormData } from './schemas';
import type { AddOrEditSpeakerProps } from './types';

const AddOrEditSpeaker = ({ speakerId }: AddOrEditSpeakerProps) => {
  const isEditMode = Boolean(speakerId);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<AddSpeakerFormData>({
    resolver: zodResolver(addSpeakerSchema) as Resolver<AddSpeakerFormData>,
    mode: 'onChange',
    defaultValues: {
      thumbnail: undefined,
      images: [],
      name: '',
      deviceModel: '',
      price: '',
      discountPercent: '',
      quantity: '',
      description: '',
      colors: [],
      technicalSpecs: [{ title: '', description: '', showontop: false }],
    },
  });

  const thumbnail = watch('thumbnail');
  const images = watch('images');
  const technicalSpecs = watch('technicalSpecs');

  const {
    AllColors,
    speakerDetailData,
    isLoadingSpeaker,
    hasSetInitialFileIds,
    setHasSetInitialFileIds,
  } = useFormInitialization(speakerId, isEditMode, setValue);

  const {
    thumbnailPreview,
    imagePreviews,
    thumbnailFileId,
    imageFileIds,
    isUploadingThumbnail,
    isUploadingImages,
    setThumbnailFileId,
    setImageFileIds,
    handleThumbnailUpload,
    handleImagesUpload,
  } = useImageHandling(
    thumbnail,
    images,
    isEditMode,
    speakerDetailData,
    hasSetInitialFileIds,
    setHasSetInitialFileIds,
  );

  const createSpeakerMutation = useSpeakerMutation(
    isEditMode,
    speakerId,
    thumbnailFileId,
    imageFileIds,
    speakerDetailData,
    reset,
    setThumbnailFileId,
    setImageFileIds,
  );

  const handleThumbnailRemove = () => {
    setValue('thumbnail', undefined as unknown as File);
    setThumbnailFileId(undefined);
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = (images || []).filter(
      (_: File, i: number) => i !== index,
    );
    setValue('images', updatedImages);
    const updatedFileIds = imageFileIds.filter(
      (_: string, i: number) => i !== index,
    );
    setImageFileIds(updatedFileIds);
  };

  const handleSpecChange = (
    index: number,
    field: 'title' | 'description' | 'showontop',
    value: string | boolean,
  ) => {
    const currentSpecs = technicalSpecs || [];
    const updatedSpecs = [...currentSpecs];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setValue('technicalSpecs', updatedSpecs, { shouldValidate: true });
  };

  const handleAddSpec = () => {
    const currentSpecs = technicalSpecs || [];
    setValue(
      'technicalSpecs',
      [...currentSpecs, { title: '', description: '', showontop: false }],
      { shouldValidate: true },
    );
  };

  const handleDeleteSpec = (index: number) => {
    const currentSpecs = technicalSpecs || [];
    const updatedSpecs = currentSpecs.filter((_, i) => i !== index);
    setValue('technicalSpecs', updatedSpecs, { shouldValidate: true });
  };

  const onSubmit = async (data: AddSpeakerFormData) => {
    try {
      await createSpeakerMutation.mutateAsync(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (isEditMode && isLoadingSpeaker) {
    return (
      <HeaderDashboard label="ویرایش اسپیکر">
        <div className="flex justify-center items-center py-12">
          <p className="text-xl-regular text-textSecondary">
            در حال بارگذاری اطلاعات اسپیکر...
          </p>
        </div>
      </HeaderDashboard>
    );
  }

  return (
    <HeaderDashboard label={isEditMode ? 'ویرایش اسپیکر' : 'افزودن اسپیکر'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
        <ImageUploadSection
          control={control}
          errors={errors}
          thumbnailPreview={thumbnailPreview}
          imagePreviews={imagePreviews}
          thumbnailFileId={thumbnailFileId}
          imageFileIds={imageFileIds}
          isUploadingThumbnail={isUploadingThumbnail}
          isUploadingImages={isUploadingImages}
          isEditMode={isEditMode}
          onThumbnailUpload={handleThumbnailUpload}
          onImagesUpload={handleImagesUpload}
          onThumbnailRemove={handleThumbnailRemove}
          onImageRemove={handleImageRemove}
          watch={watch}
          setValue={setValue}
        />

        <BasicInfoSection
          control={control}
          errors={errors}
          allColors={AllColors}
        />

        <TechnicalSpecsSection
          control={control}
          errors={errors}
          technicalSpecs={technicalSpecs}
          onSpecChange={handleSpecChange}
          onAddSpec={handleAddSpec}
          onDeleteSpec={handleDeleteSpec}
          setValue={setValue}
        />

        <FormActions
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          isPending={createSpeakerMutation.isPending}
          isValid={isValid}
          thumbnailFileId={thumbnailFileId}
          onReset={reset}
        />
      </form>
    </HeaderDashboard>
  );
};

export default AddOrEditSpeaker;
