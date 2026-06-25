"use client";

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

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
    show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring" as const, mass: 1.2, stiffness: 180, damping: 20 } },
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 56 : 192 }}
      transition={{ type: "spring", mass: 1.2, stiffness: 180, damping: 20 }}
      className="h-screen border-r border-border bg-card/75 backdrop-blur-md flex flex-col shrink-0 relative z-30"
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted/80 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className="h-12 flex items-center px-4 border-b border-border overflow-hidden select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="ArmorIQ Logo"
            className="h-6 w-6 object-contain rounded shadow-sm shrink-0"
          />
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
            >
              <h1 className="font-bold text-xs tracking-tight text-foreground leading-none">Armoriq</h1>
              <p className="text-[9px] text-muted-foreground mt-0.5">MCP Guardrail</p>
            </motion.div>
          )}
        </div>
      </div>

      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar"
      >
        {menuItems.map((item, idx) => {
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-150 cursor-pointer group relative outline-none ${
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <div className="flex h-4 w-4 items-center justify-center shrink-0">
                {item.icon(isActive)}
              </div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8, filter: "blur(1px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{
                    type: "spring",
                    mass: 1.2,
                    stiffness: 180,
                    damping: 20,
                    delay: idx * 0.03,
                  }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </motion.nav>

      {isCollapsed ? (
        <div className="px-2 pb-3 shrink-0 flex justify-center">
          <button
            onClick={() => {
              onChangeTab("policies");
              setTimeout(() => {
                const event = new CustomEvent("open-new-policy-modal");
                window.dispatchEvent(event);
              }, 80);
            }}
            className="h-8 w-8 flex items-center justify-center bg-accent text-accent-foreground rounded-lg hover:opacity-90 active:scale-[0.97] transition-all cursor-pointer shadow-sm"
            title="New Policy"
          >
            <Plus size={14} />
          </button>
        </div>
      ) : (
        <div className="px-3 pb-3 shrink-0">
          <button
            onClick={() => {
              onChangeTab("policies");
              setTimeout(() => {
                const event = new CustomEvent("open-new-policy-modal");
                window.dispatchEvent(event);
              }, 80);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-accent text-accent-foreground rounded-lg text-xs font-semibold hover:opacity-90 active:scale-[0.97] transition-all cursor-pointer shadow-sm uppercase tracking-wider font-mono text-[9px]"
          >
            <Plus size={11} />
            <span>New Policy</span>
          </button>
        </div>
      )}
    </motion.aside>
  );
}
