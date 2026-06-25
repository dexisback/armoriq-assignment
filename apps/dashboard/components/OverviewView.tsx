"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Wrench, 
  ClipboardCheck, 
  FileCode2, 
  Activity,
  AlertTriangle
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
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
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

        setRecentLogs(logsRes.slice(0, 5) || []);
      } catch (err) {
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-semibold text-muted-foreground animate-pulse">
          Loading metrics...
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Discovered Tools",
      value: metrics.toolsCount,
      desc: "MCP endpoints registered",
      icon: Wrench,
      tab: "catalog" as const,
      color: "text-blue-500",
    },
    {
      title: "Active Policies",
      value: metrics.rulesCount,
      desc: "Enabled safety rules",
      icon: ShieldCheck,
      tab: "policies" as const,
      color: "text-green-500",
    },
    {
      title: "Pending Approvals",
      value: metrics.approvalsCount,
      desc: "Actions requiring review",
      icon: ClipboardCheck,
      tab: "approvals" as const,
      color: "text-amber-500",
      highlight: metrics.approvalsCount > 0,
    },
    {
      title: "Execution Logs",
      value: metrics.logsCount,
      desc: "Total intercepted events",
      icon: FileCode2,
      tab: "logs" as const,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-card border border-border app-surface shadow-sm">
        <div>
          <h2 className="text-base font-bold text-foreground">Welcome to Armoriq Guardrail Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor, override risk, and configure sandbox execution policies for your MCP servers.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Guard active</span>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(card.tab)}
              className={`text-left p-5 rounded-2xl bg-card border border-border hover:border-accent/40 shadow-sm transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                card.highlight ? "ring-1 ring-amber-500/50 bg-amber-500/[0.02]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <Icon size={18} className={card.color} />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground font-tabular">{card.value}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">{card.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Recent Activity List */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-muted-foreground" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Recent Interceptions
            </h3>
          </div>
          <button 
            onClick={() => onNavigate("logs")}
            className="text-[10px] font-bold text-accent hover:underline cursor-pointer"
          >
            View All Logs
          </button>
        </div>

        {recentLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No recent tool execution logs.
          </div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-background/50">
            {recentLogs.map((log) => {
              const isDeny = log.decision === "DENY" || log.decision === "VALIDATION_FAILED";
              const isPending = log.decision === "REQUIRE_APPROVAL";

              return (
                <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-muted/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isDeny ? "bg-red-500/10 text-red-500" : isPending ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500"
                    }`}>
                      {isDeny ? (
                        <AlertTriangle size={14} />
                      ) : (
                        <ShieldCheck size={14} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{log.toolName}</p>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        Id: <span className="font-mono">{log.id.slice(0, 8)}...</span> · {new Date(log.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      isDeny 
                        ? "bg-red-500/10 text-red-500 border-red-500/20" 
                        : isPending 
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                        : "bg-green-500/10 text-green-500 border-green-500/20"
                    }`}>
                      {log.decision}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
