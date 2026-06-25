"use client";

import { motion } from "framer-motion";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

interface MessageBubbleProps {
  message: ChatMessage;
  index?: number;
}

export function MessageBubble({ message, index = 0 }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        duration: 0.3,
        bounce: 0,
        delay: index * 0.08,
      }}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap transition-shadow duration-200 ${
          isUser
            ? "bg-accent text-accent-foreground rounded-tr-sm shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]"
            : "bg-muted/40 text-foreground border border-border rounded-tl-sm shadow-[0_1px_2px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.04)]"
        }`}
      >
        <p className="text-wrap-pretty">{message.content}</p>
      </div>
    </motion.div>
  );
}
