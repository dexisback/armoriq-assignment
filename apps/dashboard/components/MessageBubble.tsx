"use client";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-accent text-accent-foreground rounded-tr-sm shadow-sm"
            : "bg-muted/40 text-foreground border border-border rounded-tl-sm"
        }`}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
}
