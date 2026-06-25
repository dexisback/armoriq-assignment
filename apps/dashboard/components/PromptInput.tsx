"use client";

import { Send } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, onSend, disabled }: PromptInputProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message to the AI agent..."
        className="flex-1 text-xs font-semibold px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        disabled={disabled || !value.trim()}
        onClick={onSend}
        className="app-btn-3d flex items-center justify-center h-10 w-10 bg-accent text-accent-foreground rounded-xl shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Send size={14} />
      </button>
    </div>
  );
}
