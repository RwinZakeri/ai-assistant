"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { ConversationProps } from "../../type";
import Message from "./message";

export interface ConversationRef {
  scrollToBottom: () => void;
}

const Conversation = forwardRef<ConversationRef, ConversationProps>(
  ({ messages }, ref) => {
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
          behavior: "smooth",
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
        <div className="flex-1 flex items-center justify-center">
          <p className="text-textSecondary">پیامی وجود ندارد</p>
        </div>
      );
    }

    return (
      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-y-auto flex-col gap-10 pl-8 pb-2 pt-20 scroll-smooth"
      >
        {messages.map((message) => (
          <Message key={message.id} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

Conversation.displayName = "Conversation";

export default Conversation;
