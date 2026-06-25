"use client";

import { useState } from "react";
import { Sidebar, TabType } from "../components/Sidebar";
import { OverviewView } from "../components/OverviewView";
import { PoliciesView } from "../components/PoliciesView";
import { ToolCatalogView } from "../components/ToolCatalogView";
import { McpServersView } from "../components/McpServersView";
import { ApprovalQueueView } from "../components/ApprovalQueueView";
import { AuditLogsView } from "../components/AuditLogsView";
import { PromptPlaygroundView } from "../components/PromptPlaygroundView";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  function getTabTitle() {
    switch (activeTab) {
      case "overview":
        return "System Overview";
      case "policies":
        return "Policies & Guards";
      case "catalog":
        return "Discovered MCP Tools";
      case "servers":
        return "Connected MCP Servers";
      case "approvals":
        return "Action Approval Queue";
      case "logs":
        return "Audit Trails";
      case "playground":
        return "Prompt Security Playground";
      default:
        return "Dashboard";
    }
  }


  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-foreground tracking-tight">
              {getTabTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>Sandbox Status: Active</span>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-foreground">Policy Engine V1</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          {activeTab === "overview" && (
            <OverviewView onNavigate={setActiveTab} />
          )}
          {activeTab === "policies" && (
            <PoliciesView />
          )}
          {activeTab === "catalog" && (
            <ToolCatalogView />
          )}
          {activeTab === "servers" && (
            <McpServersView />
          )}
          {activeTab === "approvals" && (
            <ApprovalQueueView />
          )}
          {activeTab === "logs" && (
            <AuditLogsView />
          )}
          {activeTab === "playground" && (
            <PromptPlaygroundView />
          )}
        </main>
      </div>
    </div>
  );
}

