import type {
  FineTuningFile,
  ImagePreview,
  UploadedDoc,
} from '@/components/pages/user-dashboard/voice-assistants/type';
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import type { CreateEditAssistantFormData } from './schemas';

export interface AssistantFormProps {
  assistantId?: number;
  onSubmit: (data: {
    formData: CreateEditAssistantFormData;
    imageFileIds: string[];
    uploadedDocs: UploadedDoc[];
    fineTuningFiles: FineTuningFile[];
  }) => void;
  isPending?: boolean;
}

export interface ImageUploadSectionProps {
  control: Control<CreateEditAssistantFormData>;
  errors: FieldErrors<CreateEditAssistantFormData>;
  imagePreviews: ImagePreview[];
  imageFileIds: string[];
  isUploadingImages: boolean;
  onImagesChange: (
    files: File[],
  ) => Promise<{ shouldClearImages?: boolean } | void>;
  onImageRemove: (index: number) => void;
  watch: UseFormWatch<CreateEditAssistantFormData>;
  setValue: UseFormSetValue<CreateEditAssistantFormData>;
}

export interface BasicInfoSectionProps {
  register: UseFormRegister<CreateEditAssistantFormData>;
  errors: FieldErrors<CreateEditAssistantFormData>;
  control: Control<CreateEditAssistantFormData>;
  isActive: boolean;
  usePublicKnowledge: boolean;
  setValue: UseFormSetValue<CreateEditAssistantFormData>;
  languageOptions: Array<{ label: string; value: string }>;
}

export interface VoiceToneSectionProps {
  control: Control<CreateEditAssistantFormData>;
  errors: FieldErrors<CreateEditAssistantFormData>;
  voiceToneValues: string[];
  setValue: UseFormSetValue<CreateEditAssistantFormData>;
  watch: UseFormWatch<CreateEditAssistantFormData>;
}

export interface SubscriptionSectionProps {
  control: Control<CreateEditAssistantFormData>;
  errors: FieldErrors<CreateEditAssistantFormData>;
  subscriptionType: '0' | '1' | '2';
  pricingFields: Array<{ id: string }>;
  setValue: UseFormSetValue<CreateEditAssistantFormData>;
  watch: UseFormWatch<CreateEditAssistantFormData>;
  appendPricing: (item: {
    duration: string;
    price: string;
    discount: string;
  }) => void;
  removePricing: (index: number) => void;
}

export interface DocumentsSectionProps {
  uploadedDocs: UploadedDoc[];
  docCurrentPage: number;
  docPageSize: number;
  docTotalPages: number;
  docStartIndex: number;
  paginatedDocs: UploadedDoc[];
  onDocUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteDoc: (id: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface FormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  isPending: boolean;
  onCancel: () => void;
}
