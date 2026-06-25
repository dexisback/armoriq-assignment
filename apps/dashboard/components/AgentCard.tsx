"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Conversation } from "./Conversation";
import { PromptInput } from "./PromptInput";
import { QuickTestScenarios } from "./QuickTestScenarios";
import { ChatMessage } from "./MessageBubble";
import { Bot } from "lucide-react";

export function AgentCard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! Ask me to interact with your MCP tools.",
      createdAt: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const chatMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      if (!res.ok) {
        throw new Error("API call failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      const replyContent = data.response || "No response content from agent.";
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-assistant`,
          role: "assistant",
          content: replyContent,
          createdAt: new Date(),
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-error`,
          role: "assistant",
          content: "Unable to contact the agent.",
          createdAt: new Date(),
        },
      ]);
    },
  });

  function handleSend() {
    const trimmed = inputVal.trim();
    if (!trimmed || chatMutation.isPending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    chatMutation.mutate(trimmed);
  }

  function handleSelectPrompt(prompt: string) {
    setInputVal(prompt);
  }

  function handleRunPrompt(prompt: string) {
    if (chatMutation.isPending) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: prompt,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    chatMutation.mutate(prompt);
  }

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-transparent rounded-2xl">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Bot size={16} className="text-accent" />
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
          AI Agent Console
        </h3>
      </div>

      <div className="flex-1 flex flex-col min-h-0 mb-4">
        <Conversation messages={messages} loading={chatMutation.isPending} />
      </div>

      <div className="mb-6">
        <QuickTestScenarios 
          onSelectPrompt={handleSelectPrompt}
          onRunPrompt={handleRunPrompt}
          disabled={chatMutation.isPending} 
        />
      </div>

      <div className="space-y-2">
        <PromptInput 
          value={inputVal}
          onChange={setInputVal}
          onSend={handleSend}
          disabled={chatMutation.isPending}
        />
        
        <p className="text-[10px] text-muted-foreground font-medium italic">
          This chat interacts with the live AI agent. Tool calls are evaluated by the Policy Engine before execution.
        </p>
      </div>
    </div>
  );
}
