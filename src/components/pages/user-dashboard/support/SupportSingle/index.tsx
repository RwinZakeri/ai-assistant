'use client';

import { AdminDashboardService, UserDashboardService } from '@/apis';
import ReactQuery from '@/configs/react_query_keys';
import { useAppSelector } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import HeaderDashboard from '../../components/HeaderDashboard';
import { MessageDirection } from '../type';
import type { ChatBoxProps, SupportMessage } from '../type';
import ChatBox from './components/chatBox';
import Conversation from './components/conversation';
import type { ConversationRef } from './components/conversation';
import TicketChatSkeleton from './components/TicketChatSkeleton';

const formatDate = (dateString?: string | null): string => {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
    return persianDate;
  } catch {
    return dateString;
  }
};

const SupportSingle = ({ ticketChatId }: ChatBoxProps) => {
  const conversationRef = useRef<ConversationRef>(null);

  const { permissions, isLoading: isRoleLoading } = useAppSelector(
    state => state.userPermissions,
  );
  const isAdminUser = useMemo(
    () => permissions && permissions?.length > 0,
    [permissions],
  );

  const {
    data: ticketData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ReactQuery.ticketChatMessages, ticketChatId],
    queryFn: () => {
      if (isAdminUser) {
        return AdminDashboardService.apiServicesAppAdmindashboardGetticketchatmessagesforadminGet(
          ticketChatId,
        );
      } else {
        return UserDashboardService.apiServicesAppUserdashboardGetticketchatmessagesGet(
          ticketChatId,
        );
      }
    },
    enabled: !!ticketChatId,
  });

  const messages: SupportMessage[] =
    ticketData?.messages?.map((message, index) => ({
      id: String(index),
      type: message.isCurrentUserMessage
        ? MessageDirection.Send
        : MessageDirection.Receive,
      content: message.messageText || '',
      timestamp: formatDate(message.sentAt),
      attachmentUrls: message.attachmentUrls || [],
    })) || [];

  const supportName = ticketData?.supportName || 'پشتیبانی';

  return (
    <HeaderDashboard
      contentClassName="pr-8  pl-0"
      headerClassName="mb-0"
      label="مشاهده تیکت"
      wrapperClassName="p-0"
    >
      {isLoading ? (
        <TicketChatSkeleton messageCount={8} />
      ) : (
        <>
          <div className="h-[70px] px-8 right-0 z-50  w-full border-b border-gray-800 flex absolute items-center gap-3 bg-surfacePrimary">
            <div className="w-3 h-3 rounded-full bg-success-500">
              <div className="w-3 h-3 rounded-full bg-success-500 animate-ping" />
            </div>
            <p className="text-lg font-semibold">{supportName}</p>
          </div>
          <div className="w-full h-[calc(100vh-141px)] pb-12 flex flex-col relative">
            {error ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-destructive">
                  خطا در بارگذاری پیام‌ها. لطفاً دوباره تلاش کنید.
                </p>
              </div>
            ) : (
              <>
                <Conversation ref={conversationRef} messages={messages} />
                <ChatBox
                  ticketChatId={ticketChatId}
                  onScrollToBottom={() =>
                    conversationRef.current?.scrollToBottom()
                  }
                />
              </>
            )}
          </div>
        </>
      )}
    </HeaderDashboard>
  );
};

export default SupportSingle;
