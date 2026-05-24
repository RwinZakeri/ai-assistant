import type { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { SpeakerAvailableColors } from '@/apis';
import type { AddSpeakerFormData } from './schemas';

export interface AddOrEditSpeakerProps {
  speakerId?: number | undefined;
}

export interface ImagePreview {
  imageUrl: string;
  imageName: string;
  imageSize: number;
}

export interface ImageUploadSectionProps {
  control: Control<AddSpeakerFormData>;
  errors: FieldErrors<AddSpeakerFormData>;
  thumbnailPreview: ImagePreview | null;
  imagePreviews: ImagePreview[];
  thumbnailFileId: string | undefined;
  imageFileIds: string[];
  isUploadingThumbnail: boolean;
  isUploadingImages: boolean;
  isEditMode: boolean;
  onThumbnailUpload: (file: File) => Promise<{ shouldClearThumbnail?: boolean } | void>;
  onImagesUpload: (files: File[]) => Promise<{ shouldClearImages?: boolean } | void>;
  onThumbnailRemove: () => void;
  onImageRemove: (index: number) => void;
  watch: UseFormWatch<AddSpeakerFormData>;
  setValue: UseFormSetValue<AddSpeakerFormData>;
}

export interface BasicInfoSectionProps {
  control: Control<AddSpeakerFormData>;
  errors: FieldErrors<AddSpeakerFormData>;
  allColors: SpeakerAvailableColors[] | undefined;
}

export interface TechnicalSpecsSectionProps {
  control: Control<AddSpeakerFormData>;
  errors: FieldErrors<AddSpeakerFormData>;
  technicalSpecs: Array<{ title: string; description: string; showontop: boolean }>;
  onSpecChange: (index: number, field: 'title' | 'description' | 'showontop', value: string | boolean) => void;
  onAddSpec: () => void;
  onDeleteSpec: (index: number) => void;
  setValue: UseFormSetValue<AddSpeakerFormData>;
}

export interface FormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  isPending: boolean;
  isValid: boolean;
  thumbnailFileId: string | undefined;
  onReset: () => void;
}

