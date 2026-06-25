"use client";

import { 
  LayoutDashboard, 
  ShieldCheck, 
  Wrench, 
  ClipboardCheck, 
  FileCode2 
} from "lucide-react";

export type TabType = "overview" | "policies" | "catalog" | "approvals" | "logs";

interface SidebarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export function Sidebar({ activeTab, onChangeTab }: SidebarProps) {
  const menuItems = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "policies" as const, label: "Policies", icon: ShieldCheck },
    { id: "catalog" as const, label: "Tool Catalog", icon: Wrench },
    { id: "approvals" as const, label: "Approval Queue", icon: ClipboardCheck },
    { id: "logs" as const, label: "Audit Logs", icon: FileCode2 },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm shadow-sm">
            AQ
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-foreground">Armoriq</h1>
            <p className="text-[10px] text-muted-foreground">MCP Guardrail Engine</p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-border bg-muted/20 text-center">
        <p className="text-[10px] text-muted-foreground">v0.1.0-alpha</p>
      </div>
    </aside>
  );
}
