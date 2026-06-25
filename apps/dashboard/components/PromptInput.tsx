"use client";

import { Send } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function PromptInput({
  value,
  onChange,
  onSend,
  disabled,
}: PromptInputProps) {
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
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(0, 0, 0, 0.02)",
        }}
        className="flex-1 text-xs font-semibold px-4 py-3 bg-background rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[inset_0_0_0_1px_rgba(var(--accent-rgb),0.2),inset_0_1px_2px_rgba(0,0,0,0.02),0_0_0_3px_rgba(var(--accent-rgb),0.08)] disabled:opacity-50 disabled:cursor-not-allowed transition-[box-shadow,background-color] duration-150 ease-[cubic-bezier(0.2,0,0,1)]"
      />
      <button
        type="button"
        disabled={disabled || !value.trim()}
        onClick={onSend}
        style={{
          boxShadow:
            "0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)",
        }}
        className="app-btn-3d flex items-center justify-center min-h-[40px] min-w-[40px] h-10 w-10 bg-accent text-accent-foreground rounded-xl shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04),0_0_12px_rgba(var(--accent-rgb),0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:shadow-[0_0_0_1px_rgba(var(--accent-rgb),0.3),0_1px_2px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04),0_0_16px_rgba(var(--accent-rgb),0.2)] transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)]"
      >
        <Send size={14} className="-mt-[1px]" />
      </button>
    </div>
  );
}
