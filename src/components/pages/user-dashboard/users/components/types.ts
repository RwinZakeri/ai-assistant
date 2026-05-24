export type UserRole = "user" | "admin";

export interface UserProfileFormFieldsProps {
  userId: string;
}

export interface WalletCardProps {
  userId: string;
}

export interface WalletChartPoint {
  label: string;
  balance: number;
}

export interface User {
  rowNumber: number;
  userId: number;
  fullname: string;
  emailAddress: string;
  phoneNumber: string;
  roleName: string;
}

export interface Speaker {
  id: string;
  name: string;
  deviceModel: string;
  connectedAccount: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  account: string;
  title: string;
  subject: string;
  date: string;
  status: import("@/enums/enum").TicketStatus;
}

export interface Question {
  id: string;
  number: number;
  fullName: string;
  voiceAssistantId: string;
  questions: string[];
  answers: string[];
  date: string | undefined;
}

export interface SpeakerDetailsFormValues {
  speakerName: string;
  deviceModel: string;
  responseSpeed: string;
  activeAssistants: string[];
}

export interface SpeakerDetailsProps {
  userId: string;
  speakerId: string;
}

export interface VoiceAssistantsTableProps {
  userId: string;
}

export interface SpeakersTableProps {
  userId: string;
}

export interface PaymentHistoryTableProps {
  userId?: string;
}

export interface SupportTicketsTableProps {
  userId: string;
}

export interface QuestionsTableProps {}

export interface UserProfileProps {
  userId: string;
}

export interface UserTableProps {
  users: User[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}
