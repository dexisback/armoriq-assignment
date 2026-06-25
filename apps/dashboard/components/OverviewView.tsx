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
      <div className="grid grid-cols-12 gap-6 animate-pulse select-none">
        {/* Left Column Skeleton */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* AI Agent Console Skeleton */}
          <div className="p-5 rounded-lg border border-border/45 bg-card/25 h-[230px] flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 app-hatch opacity-[0.03]" />
            <div className="h-4 bg-muted/65 rounded w-1/4 animate-pulse" />
            <div className="flex-1 bg-muted/40 rounded-sm" />
            <div className="h-9 bg-muted/65 rounded-sm" />
          </div>

          {/* Request Timeline Skeleton */}
          <div className="p-5 rounded-lg border border-border/45 bg-card/25 h-[350px] flex flex-col gap-5">
            <div className="h-4 bg-muted/65 rounded w-1/5 animate-pulse" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-2.5 h-2.5 bg-muted/50 shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-muted/65 rounded w-1/3" />
                    <div className="h-3 bg-muted/40 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Metrics Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border/45 bg-card/25 h-[95px] flex flex-col gap-3">
              <div className="h-3 bg-muted/65 rounded w-1/2" />
              <div className="h-6 bg-muted/65 rounded w-1/3" />
            </div>
            <div className="p-4 rounded-lg border border-border/45 bg-card/25 h-[95px] flex flex-col gap-3">
              <div className="h-3 bg-muted/65 rounded w-1/2" />
              <div className="h-6 bg-muted/65 rounded w-1/3" />
            </div>
          </div>

          {/* Pending Approvals Skeleton */}
          <div className="p-5 rounded-lg border border-border/45 bg-card/25 h-[180px] flex flex-col gap-4">
            <div className="h-3.5 bg-muted/65 rounded w-1/2" />
            <div className="space-y-3">
              <div className="h-10 bg-muted/40 rounded" />
              <div className="h-10 bg-muted/40 rounded" />
            </div>
          </div>

          {/* Recent Interceptions Skeleton */}
          <div className="p-5 rounded-lg border border-border/45 bg-card/25 h-[230px] flex flex-col gap-4">
            <div className="h-3.5 bg-muted/65 rounded w-1/2" />
            <div className="space-y-3">
              <div className="h-9 bg-muted/40 rounded" />
              <div className="h-9 bg-muted/40 rounded" />
              <div className="h-9 bg-muted/40 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-300">
      {/* Left Column (AI Agent Console and Request Journey Timeline) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="app-glass p-5 rounded-lg bg-card/65 shadow-md flex flex-col gap-4 relative overflow-hidden app-card-3d">
          <div className="absolute inset-0 app-hatch opacity-[0.03] pointer-events-none" />
          <AgentCard />
        </div>

        {recentLogs.length > 0 && (
          <div className="p-5 rounded-xl border border-border bg-card/45 relative overflow-hidden">
            <RequestTimeline targetLog={recentLogs[0]} allLogs={allLogs} />
          </div>
        )}
      </div>

      {/* Right Column (Metrics, Approvals, and Activity logs) */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Metric buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate("catalog")}
            className="text-left p-4 rounded-xl border border-border bg-card/40 hover:bg-card/70 hover:border-accent/40 shadow-none cursor-pointer transition-all duration-200 group"
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
            className="text-left p-4 rounded-xl border border-border bg-card/40 hover:bg-card/70 hover:border-accent/40 shadow-none cursor-pointer transition-all duration-200 group"
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

        {/* Pending Approvals */}
        <div className="p-5 rounded-xl border border-border bg-card/45 flex flex-col justify-between">
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
              <div className="text-[10px] text-muted-foreground py-6 text-center bg-background/25 border border-border rounded-lg">
                No actions requiring approval.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {pendingApprovals.map((app) => (
                  <div 
                    key={app.id}
                    className="p-3 bg-muted/20 border border-border rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{app.toolName}</p>
                      <p className="text-[9px] text-muted-foreground truncate font-mono">ID: {app.id.slice(0, 8)}</p>
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded-sm text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/10">
                      PENDING
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Interceptions */}
        <div className="p-5 rounded-xl border border-border bg-card/45 flex flex-col justify-between">
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
              <div className="text-[10px] text-muted-foreground py-6 text-center bg-background/25 border border-border rounded-lg">
                No system activity logs found.
              </div>
            ) : (
              <div className="divide-y divide-border/60 border border-border rounded-lg overflow-hidden bg-background/25 text-xs animate-in fade-in duration-300">
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
                      <span className={`inline-flex px-2 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider font-mono ${
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
