"use client";

import { useState, useEffect } from "react";
import { Sidebar, TabType } from "../components/Sidebar";
import { OverviewView } from "../components/OverviewView";
import { PoliciesView } from "../components/PoliciesView";
import { ToolCatalogView } from "../components/ToolCatalogView";
import { McpServersView } from "../components/McpServersView";
import { ApprovalQueueView } from "../components/ApprovalQueueView";
import { AuditLogsView } from "../components/AuditLogsView";
import { PromptPlaygroundView } from "../components/PromptPlaygroundView";
import { CommandSearchModal } from "../components/CommandSearchModal";
import { DemoGuideView } from "../components/DemoGuideView";
import { ShieldCheck, Search, Volume2, VolumeX, Sun, Moon } from "lucide-react";
import { sound } from "../components/SoundSystem";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Initial theme and sound state synchronization
    const theme = localStorage.getItem("theme");
    const isDark = theme !== "light";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setSoundEnabled(sound.getSoundEnabled());

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      case "demo":
        return "Platform Capabilities & Operations";
      default:
        return "Dashboard";
    }
  }

  const handleToggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    sound.playTap();
  };

  const handleToggleSound = () => {
    const nextEnabled = sound.toggleSound();
    setSoundEnabled(nextEnabled);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} onChangeTab={(tab) => { sound.playTap(); setActiveTab(tab); }} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card/75 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {getTabTitle()}
            </h2>
            <button
              onClick={() => { sound.playTap(); setIsSearchOpen(true); }}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all duration-150 cursor-pointer"
            >
              <Search size={12} className="opacity-80" />
              <span>Search...</span>
              <kbd className="pointer-events-none rounded bg-card px-1.5 font-mono text-[9px] text-muted-foreground/60 border border-border/30">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span>Sandbox Status: Active</span>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-foreground">Policy Engine V1</span>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSound}
                className="p-2 border border-border hover:border-accent/40 hover:bg-muted/40 rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center justify-center active:scale-[0.96]"
                title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
              >
                {soundEnabled ? <Volume2 size={15} strokeWidth={1.75} /> : <VolumeX size={15} strokeWidth={1.75} />}
              </button>
              <button
                onClick={handleToggleTheme}
                className="p-2 border border-border hover:border-accent/40 hover:bg-muted/40 rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center justify-center active:scale-[0.96]"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
              </button>
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
          {activeTab === "demo" && (
            <DemoGuideView />
          )}
        </main>
      </div>

      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActiveTab}
      />
    </div>
  );
}

