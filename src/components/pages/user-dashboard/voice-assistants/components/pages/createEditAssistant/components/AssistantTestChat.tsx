'use client';

import Message from '@/components/pages/user-dashboard/support/SupportSingle/components/message';
import type { SupportMessage } from '@/components/pages/user-dashboard/support/type';
import { MessageDirection } from '@/components/pages/user-dashboard/support/type';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type {
  AssistantTestChatProps,
  ConversationRef,
} from '@/components/pages/user-dashboard/voice-assistants/type';

export type { ConversationRef };

const Conversation = forwardRef<
  ConversationRef,
  { messages: SupportMessage[] }
>(({ messages }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;

      scrollContainer.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth',
      });
    }
  };

  useImperativeHandle(ref, () => ({
    scrollToBottom,
  }));

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <p className="text-textSecondary">پیامی وجود ندارد</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 flex overflow-y-auto flex-col gap-10 pb-2 pt-4 scroll-smooth max-h-[500px] min-h-[300px]"
    >
      {messages.map(message => (
        <Message key={message.id} {...message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
});

Conversation.displayName = 'Conversation';

const AssistantTestChat = ({ assistantId }: AssistantTestChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<ConversationRef>(null);

  const formatDate = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return date.toLocaleTimeString('fa-IR');
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isSending) {
      return;
    }

    const userMessage: SupportMessage = {
      id: `user-${Date.now()}`,
      type: MessageDirection.Send,
      content: message.trim(),
      timestamp: formatDate(new Date()),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsSending(true);

    setTimeout(() => {
      const assistantMessage: SupportMessage = {
        id: `assistant-${Date.now()}`,
        type: MessageDirection.Receive,
        content:
          'این یک پاسخ تستی است. در آینده این بخش به API دستیار متصل خواهد شد.',
        timestamp: formatDate(new Date()),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsSending(false);
      setTimeout(() => {
        conversationRef.current?.scrollToBottom();
      }, 100);
    }, 1000);
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
    <div className="w-full flex flex-col gap-4 rounded-lg p-4 border">
      <div className="flex-1 min-h-[300px] max-h-[500px]">
        <Conversation ref={conversationRef} messages={messages} />
      </div>

      <div className="w-full flex items-start gap-2 pt-4">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            disabled={isSending}
            placeholder="پیامی بنویسید..."
            rows={1}
            style={{ minHeight: '44px' }}
            value={message}
            className={cn(
              'w-full pr-4 pl-4 py-3 rounded-md',
              'bg-surfaceSecondary border border-linePrimary',
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

        <Button
          className="h-[44px] shrink-0"
          disabled={isSending || !message.trim()}
          variant="primary"
          onClick={handleSend}
        >
          ارسال
        </Button>
      </div>
    </div>
  );
};

export default AssistantTestChat;
