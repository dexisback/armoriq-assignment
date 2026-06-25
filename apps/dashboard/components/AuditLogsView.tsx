"use client";

import { useEffect, useState } from "react";
import { Search, Info, X, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { ApprovalDetailsDrawer } from "./ApprovalDetailsDrawer";
import { RequestTimeline } from "./RequestTimeline";

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

  const filteredLogs = logs.filter(log => 
    log.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.reason && log.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
    log.decision.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getDecisionBadge(decision: string) {
    switch (decision) {
      case "ALLOW":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DENY":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "REQUIRE_APPROVAL":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "VALIDATION_FAILED":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  }

  function getRiskBadge(risk: string) {
    switch (risk) {
      case "LOW":
        return "text-green-500";
      case "MEDIUM":
        return "text-blue-500";
      case "HIGH":
        return "text-amber-500";
      case "CRITICAL":
        return "text-red-500 font-bold";
      default:
        return "text-muted-foreground";
    }
  }

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-semibold text-muted-foreground animate-pulse">
          Loading audit logs...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-foreground">Guardrail Audit Logs</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Review and audit the historical logs of all tool requests, risk assessments, and policy executions.
        </p>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Search by tool, policy decision, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent"
          />
        </div>
        <div className="text-xs text-muted-foreground shrink-0 font-mono">
          Total logs: {filteredLogs.length}
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-2xl bg-card">
          <ShieldAlert className="mx-auto text-muted-foreground mb-3" size={24} />
          <p className="text-xs text-muted-foreground">No audit logs matching filters found.</p>
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Tool Name</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Decision</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/15 transition-colors align-middle">
                  <td className="p-4 text-muted-foreground font-mono font-tabular whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-foreground truncate max-w-xs">
                    {log.toolName}
                  </td>
                  <td className="p-4 font-mono font-bold">
                    <span className={getRiskBadge(log.riskLevel)}>
                      {log.riskLevel || "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getDecisionBadge(log.decision)}`}>
                      {log.decision}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 font-semibold ${
                      log.executed ? "text-green-500" : "text-red-500"
                    }`}>
                      {log.executed ? (
                        <>
                          <CheckCircle2 size={12} />
                          Executed
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={12} />
                          Blocked
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 border border-border hover:border-accent/40 bg-background hover:bg-muted/40 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-colors"
                      title="Inspect Logs"
                    >
                      <Info size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Log Inspector</h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {selectedLog.id}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 hover:bg-muted/60 text-muted-foreground rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Meta metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-background/40 p-4 rounded-xl border border-border">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Tool</span>
                  <p className="font-bold text-foreground mt-0.5 truncate">{selectedLog.toolName}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Risk Level</span>
                  <p className={`font-mono font-bold mt-0.5 ${getRiskBadge(selectedLog.riskLevel)}`}>
                    {selectedLog.riskLevel || "N/A"}
                  </p>
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
                  <p className={`font-bold mt-0.5 ${selectedLog.executed ? "text-green-500" : "text-red-500"}`}>
                    {selectedLog.executed ? "Yes" : "No (Blocked)"}
                  </p>
                </div>
              </div>

              {/* Reason explanation */}
              {selectedLog.reason && (
                <div className="p-4 bg-muted/30 border border-border rounded-xl">
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                    Decision Reason
                  </span>
                  <p className="text-foreground leading-relaxed font-semibold">{selectedLog.reason}</p>
                </div>
              )}

              {/* Arguments JSON */}
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block mb-1.5">
                  Request Arguments
                </span>
                <pre className="font-mono text-[10px] bg-background/50 border border-border p-4 rounded-xl overflow-x-auto text-foreground max-h-48 leading-normal">
                  {JSON.stringify(selectedLog.arguments, null, 2)}
                </pre>
              </div>

              {/* Trace log / Error message JSON */}
              {selectedLog.trace && (
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block mb-1.5">
                    Execution Trace / Output
                  </span>
                  <pre className="font-mono text-[10px] bg-background/50 border border-border p-4 rounded-xl overflow-x-auto text-foreground max-h-48 leading-normal">
                    {JSON.stringify(selectedLog.trace, null, 2)}
                  </pre>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <RequestTimeline targetLog={selectedLog} allLogs={logs} />
              </div>

              {/* Extra stats */}
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[10px] text-muted-foreground border-t border-border pt-4">
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
                    className="px-3 py-1.5 border border-accent/25 hover:border-accent/40 bg-accent/5 hover:bg-accent/10 text-accent text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
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
