"use client";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedPrompts({
  onSelectPrompt,
  disabled,
}: SuggestedPromptsProps) {
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
          style={{
            boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.06)",
          }}
          className="px-3 py-2 min-h-[40px] text-[10px] font-semibold bg-background rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/20 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08),0_0_8px_rgba(0,0,0,0.02)] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:shadow-[inset_0_0_0_1px_rgba(var(--accent-rgb),0.2),0_0_0_3px_rgba(var(--accent-rgb),0.08)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-[transform,color,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)]"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
