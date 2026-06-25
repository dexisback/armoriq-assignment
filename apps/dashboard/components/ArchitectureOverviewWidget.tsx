"use client";

import { useState } from "react";
import { Check, Shield, CircleDot, Info, Scale } from "lucide-react";

interface Node {
  id: string;
  title: string;
  description: string;
}

export function ArchitectureOverviewWidget() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: Node[] = [
    {
      id: "User Prompt",
      title: "User Prompt",
      description: "Natural language instruction submitted by the administrator."
    },
    {
      id: "AI Agent",
      title: "AI Agent (Gemini)",
      description: "The LLM evaluates input and determines tool invocation parameters. It does NOT run tools directly."
    },
    {
      id: "Policy Engine",
      title: "Policy Engine",
      description: "Every requested tool call is evaluated against administrator-defined guardrails."
    },
    {
      id: "Decision",
      title: "Decision",
      description: "The action is either ALLOWED, BLOCKED (denied), or PAUSED for administrator manual authorization."
    },
    {
      id: "MCP Registry",
      title: "MCP Registry",
      description: "Manages dynamic discovery, server registry, and routes execution calls to target servers."
    },
    {
      id: "MCP Server",
      title: "MCP Server",
      description: "Executes the requested tool under stdio process or SSE transport layers."
    },
    {
      id: "Tool Result",
      title: "Tool Result",
      description: "Execution payload or exit outcome is returned securely back to the AI agent loop."
    },
    {
      id: "AI Response",
      title: "AI Response",
      description: "The AI agent aggregates the tool execution results and formulates the final human response."
    }
  ];

  const nextStages: Record<string, string[]> = {
    "User Prompt": ["AI Agent"],
    "AI Agent": ["Policy Engine"],
    "Policy Engine": ["Decision", "MCP Registry"],
    "Decision": ["MCP Registry", "MCP Server"],
    "MCP Registry": ["MCP Server"],
    "MCP Server": ["Tool Result"],
    "Tool Result": ["AI Response"],
    "AI Response": []
  };

  const capabilities = [
    "AI Agent Tool Loop",
    "Dynamic MCP Discovery",
    "Multiple MCP Servers",
    "Policy Engine",
    "Runtime Rule Reload",
    "Human Approval Workflow",
    "Tool Blocking",
    "Input Validation",
    "Risk-Based Policies",
    "Budget Limits",
    "Prompt Injection Detection",
    "Audit Logging",
    "Risk Overrides",
    "Tool Catalog",
    "Runtime Health Monitoring",
    "Approval Queue",
    "Live Dashboard",
    "Redis Pub/Sub Synchronization"
  ];

  const coverage = [
    { req: "AI Agent", status: "Implemented" },
    { req: "Dynamic MCP Discovery", status: "Implemented" },
    { req: "Custom MCP Server", status: "Implemented" },
    { req: "Policy Engine", status: "Implemented" },
    { req: "Runtime Rule Updates", status: "Implemented" },
    { req: "Approval Workflow", status: "Implemented" },
    { req: "Audit Logs", status: "Implemented" },
    { req: "Prompt Injection Protection", status: "Bonus" }
  ];

  function isNodeHighlighted(nodeId: string) {
    if (!hoveredNode) return false;
    if (hoveredNode === nodeId) return true;
    return nextStages[hoveredNode]?.includes(nodeId) || false;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between gap-4">
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            How ArmorIQ Works
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Hover over any node in the request pipeline to trace its path.
          </p>
        </div>

        <div className="relative space-y-3 pl-4">
          <div className="absolute left-[29px] top-4 bottom-4 w-[1px] border-l border-dashed border-border" />

          {nodes.map((node, idx) => {
            const isHighlighted = isNodeHighlighted(node.id);
            const isCurrent = hoveredNode === node.id;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`relative z-10 flex items-start gap-4 p-2.5 rounded-xl border transition-all duration-200 cursor-help ${
                  isCurrent
                    ? "border-accent bg-accent/5 shadow-[0_0_8px_rgba(219,138,116,0.1)] text-foreground"
                    : isHighlighted
                    ? "border-accent/40 bg-accent/2 text-foreground"
                    : "border-transparent bg-transparent text-muted-foreground"
                }`}
              >
                <div className={`p-1.5 border rounded-lg bg-card text-muted-foreground shrink-0 transition-colors ${
                  isHighlighted ? "text-accent border-accent/40" : "border-border"
                }`}>
                  <CircleDot size={12} className={isHighlighted ? "animate-pulse" : ""} />
                </div>
                <div className="min-w-0">
                  <h5 className={`text-xs font-bold ${isHighlighted ? "text-foreground" : "text-muted-foreground"}`}>
                    {node.title}
                  </h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                    {node.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border pb-2.5">
            Platform Capabilities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
            {capabilities.map((cap) => (
              <div key={cap} className="flex items-center gap-2 text-muted-foreground font-semibold">
                <div className="p-0.5 bg-green-500/10 text-green-500 rounded border border-green-500/20 shrink-0">
                  <Check size={10} />
                </div>
                <span className="truncate">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border pb-2.5">
            Assignment Coverage
          </h4>
          <div className="divide-y divide-border border border-border rounded-xl bg-background/20 overflow-hidden text-[10px]">
            {coverage.map((c) => (
              <div key={c.req} className="p-2.5 flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">{c.req}</span>
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                  c.status === "Bonus"
                    ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                    : "bg-green-500/10 text-green-500 border border-green-500/20"
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 p-5 bg-muted/20 border border-border rounded-2xl space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-accent" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">Architecture Summary</h4>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          ArmorIQ separates AI reasoning from tool execution. Every tool request passes through the Policy Engine before reaching any MCP server. Administrators can modify policies at runtime without restarting the agent, allowing security rules to evolve independently of application code.
        </p>
      </div>
    </div>
  );
}
