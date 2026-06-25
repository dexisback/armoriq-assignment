"use client";

import { useEffect, useRef } from "react";
import { MessageBubble, ChatMessage } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface ConversationProps {
  messages: ChatMessage[];
  loading?: boolean;
}

export function Conversation({ messages, loading }: ConversationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[300px] max-h-[450px] bg-background/30 rounded-2xl border border-border"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {loading && (
        <div className="flex justify-start">
          <div className="bg-muted/40 text-foreground border border-border rounded-2xl rounded-tl-sm px-4 py-2">
            <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  );
}
