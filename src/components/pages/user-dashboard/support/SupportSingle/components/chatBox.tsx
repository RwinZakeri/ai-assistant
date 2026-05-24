'use client';

import {
  AdminDashboardService,
  TicketStatus,
  UserDashboardService,
} from '@/apis';
import type { UpdateTicketStatusInput } from '@/apis';
import { AttachFileIcon } from '@/assets/images/svg/AttachFile';
import { SendIcon } from '@/assets/images/svg/Send';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CustomRadioItem, RadioGroup } from '@/components/ui/radio-group';
import ReactQuery from '@/configs/react_query_keys';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAppSelector } from '@/store';
import type { ChatBoxProps } from '../../type';

interface ChatBoxComponentProps extends ChatBoxProps {
  onScrollToBottom?: () => void;
}

const ChatBox = ({ ticketChatId, onScrollToBottom }: ChatBoxComponentProps) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | null>(
    null,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { permissions, isLoading: isRoleLoading } = useAppSelector(
    state => state.userPermissions,
  );
  const isAdminUser = useMemo(
    () => permissions && permissions?.length > 0,
    [permissions],
  );
  const sendMessageMutation = useMutation({
    mutationFn: async (data: {
      files?: File[];
      TicketChatID?: string;
      Content?: string;
    }) => {
      if (isAdminUser) {
        return AdminDashboardService.apiServicesAppAdmindashboardSendmessagetochatbyadminPost(
          data,
        );
      } else {
        return UserDashboardService.apiServicesAppUserdashboardSendmessagetochatbyuserPost(
          data,
        );
      }
    },
    onSuccess: () => {
      setMessage('');
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.ticketChatMessages, ticketChatId],
      });
      toast.success('پیام با موفقیت ارسال شد');
      setTimeout(() => {
        onScrollToBottom?.();
      }, 200);
    },
    onError: () => {
      toast.error('خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
    },
  });

  const updateTicketStatusMutation = useMutation({
    mutationFn: async (status: TicketStatus) => {
      const input: UpdateTicketStatusInput = {
        ticketChatId,
        ticketStatus: status,
      };
      return AdminDashboardService.apiServicesAppAdmindashboardUpdateticketstatusPost(
        input,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ReactQuery.ticketChatMessages,
          ReactQuery.GetTicketCategoriesForAdmin,
          ticketChatId,
        ],
      });
      toast.success('وضعیت تیکت با موفقیت به‌روزرسانی شد');
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی وضعیت تیکت. لطفاً دوباره تلاش کنید.');
    },
  });

  const handleStatusChange = (value: string) => {
    const status = Number(value) as TicketStatus;
    setSelectedStatus(status);
    updateTicketStatusMutation.mutate(status);
  };

  const handleSend = () => {
    if (!message.trim() && files.length === 0) {
      return;
    }

    const data: {
      files?: File[];
      TicketChatID?: string;
      Content?: string;
    } = {
      TicketChatID: ticketChatId,
    };

    if (message.trim()) {
      data.Content = message.trim();
    }

    if (files.length > 0) {
      data.files = files;
    }

    sendMessageMutation.mutate(data);
    setTimeout(() => {
      onScrollToBottom?.();
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      const lineHeight = 20;
      const padding = 24;
      const maxHeight = lineHeight * 2 + padding;
      const scrollHeight = textarea.scrollHeight;

      if (scrollHeight <= maxHeight) {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
      } else {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      }
    };

    adjustHeight();
  }, [message]);

  return (
    <div className="w-full right-0 absolute bottom-0 left-0 pl-12 flex  flex-col gap-6">
      <div className="w-full flex items-start gap-2">
        <div className="sticky bottom-0 left-0 w-full">
          <div className="relative flex items-center">
            <label
              className="absolute right-3 z-10 flex items-center justify-center cursor-pointer"
              htmlFor="chatFile"
            >
              <input
                ref={fileInputRef}
                multiple
                className="sr-only"
                id="chatFile"
                type="file"
                onChange={handleFileChange}
              />
              <AttachFileIcon />
            </label>
            <textarea
              ref={textareaRef}
              disabled={sendMessageMutation.isPending}
              placeholder="پیامی بنویسید"
              rows={1}
              style={{ minHeight: '44px' }}
              value={message}
              className={cn(
                'w-full pr-12 pl-4 py-3 rounded-md',
                'bg-surfacePrimary border border-linePrimary',
                'text-sm text-gray-25 placeholder:text-textSecondary',
                'resize-none overflow-hidden',
                'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all',
              )}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="text-xs text-textSecondary bg-surfaceSecondary px-2 py-1 rounded flex items-center gap-2"
                >
                  <span>{file.name}</span>
                  <button
                    className="text-destructive hover:text-destructive-600"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          className="h-[44px] shrink-0"
          disabled={
            sendMessageMutation.isPending ||
            (!message.trim() && files.length === 0)
          }
          onClick={handleSend}
        >
          <SendIcon />
        </Button>
      </div>
      {isAdminUser && (
        <div className="flex items-center gap-3">
          <Label className="text-xs text-textSecondary">وضعیت:</Label>
          <RadioGroup
            className="flex gap-5"
            disabled={updateTicketStatusMutation.isPending}
            value={selectedStatus?.toString()}
            onValueChange={handleStatusChange}
          >
            <div className="flex items-center gap-2">
              <Label
                className="text-xs font-semibold text-textTertiary cursor-pointer"
                htmlFor="status-0"
              >
                بررسی شده
              </Label>
              <CustomRadioItem
                id="status-0"
                value={TicketStatus._2.toString()}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label
                className="text-xs font-semibold text-textTertiary cursor-pointer"
                htmlFor="status-1"
              >
                در حال رسیدگی
              </Label>
              <CustomRadioItem
                id="status-1"
                value={TicketStatus._1.toString()}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label
                className="text-xs font-semibold text-textTertiary cursor-pointer"
                htmlFor="status-2"
              >
                در انتظار بررسی
              </Label>
              <CustomRadioItem
                id="status-2"
                value={TicketStatus._0.toString()}
              />
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
