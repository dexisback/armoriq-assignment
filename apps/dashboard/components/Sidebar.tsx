"use client";

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type TabType = "overview" | "policies" | "catalog" | "approvals" | "logs" | "playground" | "servers" | "demo";

interface SidebarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export function Sidebar({ activeTab, onChangeTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: "overview" as const,
      label: "Overview",
      icon: (isActive: boolean) => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 group-hover:scale-105">
          <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} />
          <rect x="9" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} />
          <rect x="1" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} />
          <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} />
        </svg>
      )
    },
    {
      id: "policies" as const,
      label: "Policies",
      icon: (isActive: boolean) => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 group-hover:scale-105">
          <path d="M7.5 1L13 3.5V7.5C13 10.7 10.7 13.3 7.5 14C4.3 13.3 2 10.7 2 7.5V3.5L7.5 1Z" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "catalog" as const,
      label: "Tool Catalog",
      icon: (isActive: boolean) => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 group-hover:scale-105">
          <path d="M12.5 5.5L9.5 2.5M10.5 7.5L4.5 13.5M2.5 10.5L1.5 13.5L4.5 12.5" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "servers" as const,
      label: "MCP Servers",
      icon: (isActive: boolean) => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 group-hover:scale-105">
          <rect x="2" y="2" width="11" height="4" rx="1" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4}/>
          <rect x="2" y="9" width="11" height="4" rx="1" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4}/>
          <circle cx="5" cy="4" r="0.75" fill="currentColor"/>
          <circle cx="5" cy="11" r="0.75" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: "approvals" as const,
      label: "Approval Queue",
      icon: (isActive: boolean) => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 group-hover:scale-105">
          <rect x="3" y="2" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4}/>
          <path d="M5.5 6.5L7 8L9.5 5.5" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "logs" as const,
      label: "Audit Logs",
      icon: (isActive: boolean) => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 group-hover:scale-105">
          <rect x="2" y="2" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4}/>
          <path d="M5 5.5H10M5 9.5H8" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: "playground" as const,
      label: "Prompt Security",
      icon: (isActive: boolean) => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 group-hover:scale-105">
          <path d="M7.5 13.5C10.8137 13.5 13.5 10.8137 13.5 7.5C13.5 4.18629 10.8137 1.5 7.5 1.5C4.18629 1.5 1.5 4.18629 1.5 7.5C1.5 10.8137 4.18629 13.5 7.5 13.5Z" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4}/>
          <path d="M7.5 4.5V8M7.5 10.5H7.51" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: "demo" as const,
      label: "Demo Guide",
      icon: (isActive: boolean) => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 group-hover:scale-105">
          <path d="M7.5 1.5L12.5 4.5V10.5L7.5 13.5L2.5 10.5V4.5L7.5 1.5Z" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 4.5V8M7.5 10.5H7.51" stroke="currentColor" strokeWidth={isActive ? 1.8 : 1.4} strokeLinecap="round"/>
        </svg>
      )
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.036,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -6, filter: "blur(2px)" },
    show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring" as const, stiffness: 350, damping: 26 } },
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="h-screen border-r border-border bg-card/75 backdrop-blur-md flex flex-col shrink-0 relative z-30"
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted/80 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className="h-16 flex items-center px-6 border-b border-border overflow-hidden select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm shadow-sm shrink-0">
            AQ
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-bold text-sm tracking-tight text-foreground leading-none">Armoriq</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">MCP Guardrail Engine</p>
            </motion.div>
          )}
        </div>
      </div>

      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar"
      >
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-150 cursor-pointer group relative outline-none ${
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <div className="flex h-5 w-5 items-center justify-center shrink-0">
                {item.icon(isActive)}
              </div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </motion.nav>

      <div className="p-4 border-t border-border bg-muted/10 text-center truncate select-none shrink-0">
        <p className="text-[9px] text-muted-foreground font-mono">
          {isCollapsed ? "v0.1" : "v0.1.0-alpha"}
        </p>
      </div>
    </motion.aside>
  );
}
