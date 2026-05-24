export enum MessageDirection {
  Send = 'send',
  Receive = 'receive',
}

export interface SupportMessage {
  id: string;
  type: MessageDirection;
  content: string;
  timestamp: string;
  attachmentUrls?: string[];
}

export enum TicketStatus {
  Pending = 0,
  Checking = 1,
  Done = 2,
}

export const ticketStatusOptions: DropdownOption[] = [
  { label: 'همه', value: '' },
  { label: 'در انتظار بررسی', value: '0' },
  { label: 'در حال انجام', value: '1' },
  { label: 'بررسی شده', value: '2' },
];

export const API_TICKET_STATUS_MAP: Record<number, TicketStatus> = {
  0: TicketStatus.Pending,
  1: TicketStatus.Checking,
  2: TicketStatus.Done,
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.Pending]: 'در انتظار بررسی',
  [TicketStatus.Checking]: 'در حال انجام',
  [TicketStatus.Done]: 'بررسی شده',
};

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  subject: string;
  date: string;
  status: TicketStatus;
  userName?: string;
}

export interface ChatBoxProps {
  ticketChatId: string;
}

export interface MessageProps {
  type: MessageDirection;
  content: string;
  timestamp: string;
  attachmentUrls?: string[];
}

export interface ConversationProps {
  messages: SupportMessage[];
}

export interface TicketTableProps {
  tickets: Ticket[];
}

export interface SupportSinglePageProps {
  params: {
    slug: string;
  };
}

export type { CreateTicketFormData } from './schemas';

export interface DropdownOption {
  value: string;
  label: string;
}

export type StatusLabel = Record<TicketStatus, string>;
export type StatusVariant = Record<
  TicketStatus,
  'primary' | 'gray' | 'success' | 'destructive' | 'warning'
>;
