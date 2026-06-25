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
      const [toolsRes, rulesRes, approvalsRes, logsRes] = await Promise.all([
        fetch("/api/tools").then(r => r.json()),
        fetch("/api/rules").then(r => r.json()),
        fetch("/api/approvals").then(r => r.json()),
        fetch("/api/logs").then(r => r.json()),
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
        <div className="text-sm font-semibold text-muted-foreground animate-pulse">
          Loading system overview...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
        <AgentCard />
        {recentLogs.length > 0 && (
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
            <RequestTimeline targetLog={recentLogs[0]} allLogs={allLogs} />
          </div>
        )}
      </div>

      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        <SystemStatusPanel />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate("catalog")}
            className="text-left p-4 rounded-2xl bg-card border border-border hover:border-accent/40 shadow-sm cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider">MCP Tools</span>
              <Wrench size={14} />
            </div>
            <div className="text-xl font-bold text-foreground font-tabular">{metrics.toolsCount}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Discovered endpoints</p>
          </button>

          <button
            onClick={() => onNavigate("policies")}
            className="text-left p-4 rounded-2xl bg-card border border-border hover:border-accent/40 shadow-sm cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Active Rules</span>
              <ShieldCheck size={14} />
            </div>
            <div className="text-xl font-bold text-foreground font-tabular">{metrics.rulesCount}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Enabled safety rules</p>
          </button>
        </div>

        {/* Pending Approvals */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={14} className="text-muted-foreground" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                Pending Approvals ({pendingApprovals.length})
              </h4>
            </div>
            <button
              onClick={() => onNavigate("approvals")}
              className="text-[9px] font-bold text-accent hover:underline cursor-pointer"
            >
              Authorize Queue
            </button>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="text-[10px] text-muted-foreground py-4 text-center bg-background/30 border border-border rounded-xl">
              No actions requiring approval.
            </div>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {pendingApprovals.map((app) => (
                <div 
                  key={app.id}
                  className="p-2.5 bg-background/50 border border-border rounded-xl flex items-center justify-between text-[11px]"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{app.toolName}</p>
                    <p className="text-[9px] text-muted-foreground truncate">ID: {app.id.slice(0, 8)}</p>
                  </div>
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    PENDING
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Logs */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-muted-foreground" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                Recent Interceptions
              </h4>
            </div>
            <button
              onClick={() => onNavigate("logs")}
              className="text-[9px] font-bold text-accent hover:underline cursor-pointer"
            >
              Inspect Logs
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-[10px] text-muted-foreground py-4 text-center bg-background/30 border border-border rounded-xl">
              No system activity logs found.
            </div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-background/50 text-[11px]">
              {recentLogs.map((log) => {
                const isDeny = log.decision === "DENY" || log.decision === "VALIDATION_FAILED";
                const isPending = log.decision === "REQUIRE_APPROVAL";

                return (
                  <div key={log.id} className="p-3 flex items-center justify-between hover:bg-muted/10">
                    <div className="min-w-0 flex items-center gap-2.5">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                        isDeny ? "bg-red-500" : isPending ? "bg-amber-500" : "bg-green-500"
                      }`} />
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{log.toolName}</p>
                        <p className="text-[9px] text-muted-foreground truncate">{new Date(log.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${
                      isDeny 
                        ? "bg-red-500/10 text-red-500 border-red-500/20" 
                        : isPending 
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                        : "bg-green-500/10 text-green-500 border-green-500/20"
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

      <div className="col-span-12 border-t border-border pt-8 mt-4">
        <ArchitectureOverviewWidget />
      </div>
    </div>
  );
}
