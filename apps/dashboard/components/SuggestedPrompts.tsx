"use client";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedPrompts({ onSelectPrompt, disabled }: SuggestedPromptsProps) {
  const prompts = [
    "Restart server srv-1",
    "List all servers",
    "Deploy latest release",
    "Get server logs",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelectPrompt(prompt)}
          className="px-3 py-1.5 text-[10px] font-semibold bg-background border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-accent/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
