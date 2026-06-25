"use client";

import { useEffect, useState } from "react";
import { Search, X, ShieldAlert, CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react";
import { ApprovalDetailsDrawer } from "./ApprovalDetailsDrawer";
import { RequestTimeline } from "./RequestTimeline";

function formatToolName(toolName: string): { title: string; category: string } {
  if (!toolName) return { title: "Unknown Tool", category: "System Tool" };
  if (toolName.includes(":")) {
    const [cat, act] = toolName.split(":");
    const title = act
      .split(/[_-]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const category = cat.charAt(0).toUpperCase() + cat.slice(1) + " Tool";
    return { title, category };
  }
  const title = toolName
    .split(/[_-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { title, category: "System Tool" };
}

export function AuditLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [viewingApproval, setViewingApproval] = useState<any | null>(null);

  async function fetchLogs() {
    try {
      setLoading(true);
      const res = await fetch("/api/logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.decision.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function getDecisionBadge(decision: string) {
    switch (decision) {
      case "ALLOW":
        return "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/15";
      case "DENY":
        return "bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/15";
      case "REQUIRE_APPROVAL":
        return "bg-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/15";
      default:
        return "bg-neutral-500/5 text-neutral-500 border-neutral-500/15";
    }
  }

  function getRiskBadge(risk: string) {
    switch (risk) {
      case "LOW":
        return "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10";
      case "MEDIUM":
        return "bg-blue-500/5 text-blue-500 border-blue-500/10";
      case "HIGH":
        return "bg-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/10";
      case "CRITICAL":
        return "bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/10 font-medium";
      default:
        return "bg-muted/45 text-muted-foreground border-border/80";
    }
  }

  function getRiskDotColor(risk: string) {
    switch (risk) {
      case "LOW":
        return "bg-emerald-500";
      case "MEDIUM":
        return "bg-blue-500";
      case "HIGH":
        return "bg-amber-500";
      case "CRITICAL":
        return "bg-rose-500 animate-pulse";
      default:
        return "bg-muted-foreground";
    }
  }

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-semibold text-muted-foreground animate-pulse">
          Loading audit logs...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1.5 pb-2">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Guardrail Audit Logs</h2>
        <p className="text-xs text-muted-foreground">
          Review and audit the historical logs of all tool requests, risk assessments, and policy executions.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-1.5 rounded-xl border border-border/80 bg-card/30">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
            <input
              type="text"
              placeholder="Search logs by tool, action, or decision..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-[border-color,box-shadow] duration-150"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all active:scale-[0.98]">
              <span>Status</span>
              <ChevronDown size={10} className="opacity-60" />
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all active:scale-[0.98]">
              <span>Risk</span>
              <ChevronDown size={10} className="opacity-60" />
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all active:scale-[0.98]">
              <span>Date</span>
              <ChevronDown size={10} className="opacity-60" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <span className="text-[10px] text-muted-foreground bg-muted/40 border border-border/80 px-2 py-0.5 rounded-md font-mono font-medium">
            {filteredLogs.length} {filteredLogs.length === 1 ? "log" : "logs"}
          </span>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-20 border border-border rounded-2xl bg-card/35 backdrop-blur-sm">
          <ShieldAlert className="mx-auto text-muted-foreground mb-3" size={24} />
          <p className="text-xs text-muted-foreground">No audit logs matching filters found.</p>
        </div>
      ) : (
        <div className="border border-border/80 rounded-xl overflow-hidden bg-card/45 backdrop-blur-sm shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground font-mono font-medium uppercase tracking-wider text-[9px] select-none">
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">Tool Name</th>
                <th className="p-4 font-semibold">Risk Level</th>
                <th className="p-4 font-semibold">Decision</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredLogs.map((log) => {
                const toolInfo = formatToolName(log.toolName);
                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-muted/10 transition-[background-color] duration-150 align-middle cursor-pointer"
                  >
                    <td className="p-4 text-muted-foreground font-mono text-[10px] font-tabular whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 truncate max-w-xs">
                      <div className="flex flex-col min-w-[120px]">
                        <span className="font-semibold text-foreground text-xs leading-normal">
                          {toolInfo.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                          {toolInfo.category}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getRiskBadge(log.riskLevel)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${getRiskDotColor(log.riskLevel)}`} />
                        {log.riskLevel || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getDecisionBadge(log.decision)}`}>
                        {log.decision}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 font-medium text-[11px] ${
                        log.executed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}>
                        {log.executed ? (
                          <>
                            <CheckCircle2 size={12} className="opacity-90" />
                            <span>Executed</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={12} className="opacity-90" />
                            <span>Blocked</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/85 border border-border/50 hover:border-border/80 rounded-md transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.96] cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-card border border-border/80 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Log Inspector</h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {selectedLog.id}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 hover:bg-muted/60 text-muted-foreground rounded-lg cursor-pointer transition-[background-color] duration-150 active:scale-95"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-background/40 p-4 rounded-xl border border-border/85">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Tool</span>
                  <p className="font-semibold text-foreground mt-0.5 truncate">
                    {formatToolName(selectedLog.toolName).title}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Risk Level</span>
                  <div className="mt-0.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getRiskBadge(selectedLog.riskLevel)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getRiskDotColor(selectedLog.riskLevel)}`} />
                      {selectedLog.riskLevel || "N/A"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Decision</span>
                  <div className="mt-0.5">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getDecisionBadge(selectedLog.decision)}`}>
                      {selectedLog.decision}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Executed</span>
                  <p className={`font-semibold mt-0.5 ${selectedLog.executed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {selectedLog.executed ? "Yes" : "No (Blocked)"}
                  </p>
                </div>
              </div>

              {selectedLog.reason && (
                <div className="p-4 bg-muted/20 border border-border/80 rounded-xl">
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                    Decision Reason
                  </span>
                  <p className="text-foreground leading-relaxed font-medium">{selectedLog.reason}</p>
                </div>
              )}

              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block mb-1.5">
                  Request Arguments
                </span>
                <pre className="font-mono text-[10px] bg-background/50 border border-border/80 p-4 rounded-xl overflow-x-auto text-foreground max-h-48 leading-normal no-scrollbar">
                  {JSON.stringify(selectedLog.arguments, null, 2)}
                </pre>
              </div>

              {selectedLog.trace && (
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block mb-1.5">
                    Execution Trace / Output
                  </span>
                  <pre className="font-mono text-[10px] bg-background/50 border border-border/80 p-4 rounded-xl overflow-x-auto text-foreground max-h-48 leading-normal no-scrollbar">
                    {JSON.stringify(selectedLog.trace, null, 2)}
                  </pre>
                </div>
              )}

              <div className="border-t border-border/50 pt-4">
                <RequestTimeline targetLog={selectedLog} allLogs={logs} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[10px] text-muted-foreground border-t border-border/50 pt-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {selectedLog.conversationId && (
                    <div>
                      Conversation: <span className="font-mono text-foreground">{selectedLog.conversationId}</span>
                    </div>
                  )}
                  <div>
                    Logged At: <span className="text-foreground">{new Date(selectedLog.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                {selectedLog.trace?.approvalId && (
                  <button
                    onClick={() => {
                      const approvalObj = {
                        id: selectedLog.trace.approvalId,
                        toolName: selectedLog.toolName,
                        arguments: selectedLog.arguments,
                        status: selectedLog.eventType === "APPROVAL_APPROVED" ? "APPROVED" : selectedLog.eventType === "APPROVAL_REJECTED" ? "REJECTED" : "PENDING",
                        requestedAt: selectedLog.createdAt,
                        resolvedAt: selectedLog.eventType === "APPROVAL_APPROVED" || selectedLog.eventType === "APPROVAL_REJECTED" ? selectedLog.createdAt : undefined,
                        resolutionReason: selectedLog.eventType === "APPROVAL_REJECTED" ? "Rejected by administrator" : selectedLog.eventType === "APPROVAL_APPROVED" ? "Approved by administrator" : undefined
                      };
                      setViewingApproval(approvalObj);
                    }}
                    className="px-3 py-1.5 border border-accent/20 hover:border-accent/40 bg-accent/5 hover:bg-accent/10 text-accent text-[10px] font-semibold rounded-lg cursor-pointer transition-[background-color,border-color,transform] duration-150 active:scale-[0.96]"
                  >
                    View Approval Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingApproval && (
        <ApprovalDetailsDrawer
          approval={viewingApproval}
          onClose={() => setViewingApproval(null)}
          onSuccess={() => {
            fetchLogs();
          }}
        />
      )}
    </div>
  );
}

