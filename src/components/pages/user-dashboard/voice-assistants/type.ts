type SubscriptionPlan = 'freemium' | 'time-based' | 'credit';
type AssistantCategory =
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'customer-service';
type AssistantVoiceStyle = 'calm' | 'formal' | 'friendly' | 'energetic';

interface VoiceAssistantMock {
  id: string;
  imageSrc: string;
  category: AssistantCategory;
  title: string;
  badge: boolean;
  badges: string[];
  description: string;
  subscriptionType: 0 | 1 | 2;
  subscriptionPlan: SubscriptionPlan;
  voiceStyle: AssistantVoiceStyle;
  language: 'fa' | 'en';
  progressLabel?: string;
  daysLeft?: number;
  percentage?: number;
  subscriptionLabel?: string;
  amount?: string;
  currency?: string;
}

interface UploadedDoc {
  id: string;
  file: File;
  fileName: string;
  uploadDate: Date;
}

interface FineTuningFile {
  id: string;
  file: File;
  fileName: string;
  uploadDate: Date;
}

interface ImagePreview {
  imageName: string;
  imageUrl: string;
  imageSize: number;
}

interface CreateEditAssistantPageProps {
  assistantId?: number;
}

interface QuestionsProps {
  assistantId?: number;
  isEditMode: boolean;
  onExportReady?: (handler: () => void, isLoading: boolean) => void;
}

interface Comment {
  commentId?: number;
  fullname?: string | null;
  comment?: string | null;
  date?: string | null;
  status?: number;
  rowNumber?: number;
}

interface CommentsProps {
  assistantId: number;
}

interface AssistantTestChatProps {
  assistantId?: number;
}

interface ConversationRef {
  scrollToBottom: () => void;
}

export type { SubscriptionPlan, AssistantCategory, AssistantVoiceStyle };
export type { VoiceAssistantMock };
export type { UploadedDoc, FineTuningFile, ImagePreview };
export type { CreateEditAssistantPageProps };
export type { QuestionsProps, Comment, CommentsProps };
export type { AssistantTestChatProps, ConversationRef };
