"use client";

import { useEffect, useState } from "react";
import { AgentCard } from "./AgentCard";
import { SystemStatusPanel } from "./SystemStatusPanel";
import { RequestTimeline } from "./RequestTimeline";
import { ArchitectureOverviewWidget } from "./ArchitectureOverviewWidget";
import { 
  ShieldCheck, 
  Wrench, 
  ClipboardCheck, 
  Activity
} from "lucide-react";

interface OverviewViewProps {
  onNavigate: (tab: "overview" | "policies" | "catalog" | "approvals" | "logs") => void;
}

export function OverviewView({ onNavigate }: OverviewViewProps) {
  const [metrics, setMetrics] = useState({
    toolsCount: 0,
    rulesCount: 0,
    approvalsCount: 0,
    logsCount: 0,
  });
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      const fetchJson = (url: string) =>
        fetch(url).then((r) => {
          if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
          return r.json();
        });

      const [toolsRes, rulesRes, approvalsRes, logsRes] = await Promise.all([
        fetchJson("/api/tools"),
        fetchJson("/api/rules"),
        fetchJson("/api/approvals"),
        fetchJson("/api/logs"),
      ]);

      const activeRules = rulesRes.filter((r: any) => r.enabled).length;

      setMetrics({
        toolsCount: toolsRes.length || 0,
        rulesCount: activeRules || 0,
        approvalsCount: approvalsRes.length || 0,
        logsCount: logsRes.length || 0,
      });

      setPendingApprovals(approvalsRes || []);
      setRecentLogs(logsRes.slice(0, 4) || []);
      setAllLogs(logsRes || []);
    } catch (err) {
      console.error("Dashboard poll failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (loading && metrics.toolsCount === 0 && recentLogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl app-glass bg-card/45 relative overflow-hidden animate-pulse max-w-sm w-full">
          <div className="absolute inset-0 app-hatch opacity-[0.05]" />
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-[3px] border-accent/25 border-t-accent animate-spin" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Synchronizing Security Plane...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-300">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="app-glass p-6 rounded-2xl bg-card/65 shadow-md flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute inset-0 app-hatch opacity-[0.03] pointer-events-none" />
          <AgentCard />
        </div>

        {recentLogs.length > 0 && (
          <div className="app-glass p-6 rounded-2xl bg-card/65 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 app-hatch opacity-[0.02] pointer-events-none" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-accent">Trace Journey</span>
            <h4 className="text-xs font-bold text-foreground mt-1 mb-4">Request Execution Stages</h4>
            <RequestTimeline targetLog={recentLogs[0]} allLogs={allLogs} />
          </div>
        )}
      </div>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="app-glass p-5 rounded-2xl bg-card/65 shadow-md">
          <SystemStatusPanel />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate("catalog")}
            className="text-left p-5 rounded-2xl app-glass bg-card/50 hover:bg-card/75 hover:border-accent/40 shadow-sm cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider group-hover:text-foreground">MCP Tools</span>
              <div className="p-1.5 bg-background border border-border rounded-lg text-accent">
                <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 5.5L9.5 2.5M10.5 7.5L4.5 13.5M2.5 10.5L1.5 13.5L4.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground font-tabular tracking-tight">{metrics.toolsCount}</div>
            <p className="text-[9px] text-muted-foreground mt-1.5">Discovered tools</p>
          </button>

          <button
            onClick={() => onNavigate("policies")}
            className="text-left p-5 rounded-2xl app-glass bg-card/50 hover:bg-card/75 hover:border-accent/40 shadow-sm cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider group-hover:text-foreground">Active Rules</span>
              <div className="p-1.5 bg-background border border-border rounded-lg text-accent">
                <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 1L13 3.5V7.5C13 10.7 10.7 13.3 7.5 14C4.3 13.3 2 10.7 2 7.5V3.5L7.5 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground font-tabular tracking-tight">{metrics.rulesCount}</div>
            <p className="text-[9px] text-muted-foreground mt-1.5">Enabled guards</p>
          </button>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6">
        <div className="app-glass p-6 rounded-2xl bg-card/65 shadow-md flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-accent">Authorization</span>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                  Pending Approvals ({pendingApprovals.length})
                </h4>
              </div>
              <button
                onClick={() => onNavigate("approvals")}
                className="text-[9px] font-bold text-accent hover:underline cursor-pointer"
              >
                Review Queue
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="text-[10px] text-muted-foreground py-6 text-center bg-background/20 border border-border rounded-xl">
                No actions requiring approval.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {pendingApprovals.map((app) => (
                  <div 
                    key={app.id}
                    className="p-3 bg-muted/20 border border-border rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{app.toolName}</p>
                      <p className="text-[9px] text-muted-foreground truncate font-mono">ID: {app.id.slice(0, 8)}</p>
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/10">
                      PENDING
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6">
        <div className="app-glass p-6 rounded-2xl bg-card/65 shadow-md flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-accent">Security Logs</span>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                  Recent Interceptions
                </h4>
              </div>
              <button
                onClick={() => onNavigate("logs")}
                className="text-[9px] font-bold text-accent hover:underline cursor-pointer"
              >
                Full Audit Trail
              </button>
            </div>

            {recentLogs.length === 0 ? (
              <div className="text-[10px] text-muted-foreground py-6 text-center bg-background/20 border border-border rounded-xl">
                No system activity logs found.
              </div>
            ) : (
              <div className="divide-y divide-border/60 border border-border rounded-xl overflow-hidden bg-background/20 text-xs animate-in fade-in duration-300">
                {recentLogs.map((log) => {
                  const isDeny = log.decision === "DENY" || log.decision === "VALIDATION_FAILED";
                  const isPending = log.decision === "REQUIRE_APPROVAL";

                  return (
                    <div key={log.id} className="p-3 flex items-center justify-between hover:bg-muted/10">
                      <div className="min-w-0 flex items-center gap-2.5">
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          isDeny ? "bg-rose-500" : isPending ? "bg-amber-500" : "bg-emerald-500"
                        }`} />
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{log.toolName}</p>
                          <p className="text-[9px] text-muted-foreground truncate font-mono">{new Date(log.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider font-mono ${
                        isDeny 
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/10" 
                          : isPending 
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/10" 
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/10"
                      }`}>
                        {log.decision}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
