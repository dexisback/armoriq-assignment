"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[300px] max-h-[450px] bg-background/30 rounded-2xl border border-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] scroll-smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} index={index} />
        ))}

        {loading && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              duration: 0.3,
              bounce: 0,
            }}
          >
            <div className="bg-muted/40 text-foreground border border-border rounded-2xl rounded-tl-sm px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.04)]">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
