"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, Terminal, MessageSquare, Shield, Clock, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ApprovalDetailsDrawerProps {
  approval: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApprovalDetailsDrawer({ approval, onClose, onSuccess }: ApprovalDetailsDrawerProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedArgs, setCopiedArgs] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/logs");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        toast.error("Failed to load audit logs context");
      } finally {
        setLoading(false);
      }
    }
    if (approval?.id) {
      fetchLogs();
    }
  }, [approval?.id]);

  if (!approval) return null;

  const matchedLog = logs.find((l) => l.trace?.approvalId === approval.id);
  const riskLevel = matchedLog?.riskLevel || "MEDIUM";
  const matchedRule = matchedLog?.trace?.matchedRule || "Approval Required";
  const reason = matchedLog?.reason || "Approval required";

  async function copyToClipboard(text: string, isArgs: boolean) {
    try {
      await navigator.clipboard.writeText(text);
      if (isArgs) {
        setCopiedArgs(true);
        setTimeout(() => setCopiedArgs(false), 2000);
      } else {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      }
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  }

  async function handleResolve(action: "approve" | "reject") {
    try {
      setResolving(true);
      const res = await fetch(`/api/approvals/${approval.id}/${action}`, {
        method: "POST",
      });

      if (res.ok) {
        if (action === "approve") {
          toast.success("Approval approved successfully.");
        } else {
          toast.success("Approval rejected.");
        }
        onSuccess();
        onClose();
      } else {
        toast.error(`Failed to resolve approval: ${action}`);
      }
    } catch (err) {
      toast.error("Error communicating with server");
    } finally {
      setResolving(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "APPROVED":
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "EXPIRED":
        return "bg-stone-500/10 text-stone-500 border border-stone-500/20";
      default:
        return "bg-muted text-muted-foreground border border-border";
    }
  }

  function getRiskBadge(risk: string) {
    switch (risk?.toUpperCase()) {
      case "LOW":
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "HIGH":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "CRITICAL":
        return "bg-red-500/10 text-red-500 border border-red-500/20 font-bold";
      default:
        return "bg-muted text-muted-foreground border border-border";
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/40 backdrop-blur-sm transition-opacity"
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative w-full sm:max-w-md md:max-w-lg bg-card border-l border-border h-full flex flex-col shadow-2xl z-10 overflow-hidden"
        >
          <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
            <h3 className="text-sm font-bold text-foreground">Approval Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted/60 text-muted-foreground rounded-lg cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-20 bg-muted rounded-2xl" />
                <div className="h-24 bg-muted rounded-2xl" />
                <div className="h-32 bg-muted rounded-2xl" />
                <div className="h-20 bg-muted rounded-2xl" />
              </div>
            ) : (
              <>
                <div className="bg-background/40 p-5 rounded-2xl border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Approval Status</span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(approval.status)}`}>
                      {approval.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Created At</span>
                    <span className="text-xs text-foreground font-semibold">
                      {new Date(approval.requestedAt || approval.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Approval ID</span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[160px]">
                        {approval.id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(approval.id, false)}
                        className="p-1 border border-border hover:border-accent/40 bg-background/50 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                      >
                        {copiedId ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
                    Tool Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Tool Name</span>
                      <p className="font-mono text-xs font-bold text-foreground mt-0.5 truncate">{approval.toolName}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Risk Level</span>
                      <div className="mt-0.5">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${getRiskBadge(riskLevel)}`}>
                          {riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Matched Rule</span>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{matchedRule}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">Reason</span>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{reason}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Arguments</h4>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(approval.arguments, null, 2), true)}
                      className="p-1 border border-border hover:border-accent/40 bg-background/50 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer flex items-center gap-1 text-[9px] font-bold"
                    >
                      {copiedArgs ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                      {copiedArgs ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono bg-background/50 border border-border p-3.5 rounded-xl overflow-x-auto text-foreground max-h-48 leading-relaxed">
                    {JSON.stringify(approval.arguments, null, 2)}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conversation</h4>
                  <div className="p-3 bg-background/30 border border-border rounded-xl flex items-start gap-2">
                    <MessageSquare size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground font-medium italic">
                      Conversation context unavailable.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Policy Decision</h4>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-amber-500" />
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-500">
                        Decision: REQUIRE_APPROVAL
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                      This tool execution matched an active approval rule and requires administrator authorization before execution.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
                    Audit Information
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created At</span>
                      <span className="font-semibold text-foreground">
                        {new Date(approval.requestedAt || approval.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {approval.status !== "PENDING" && approval.resolvedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolved At</span>
                        <span className="font-semibold text-foreground">
                          {new Date(approval.resolvedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {approval.resolutionReason && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolution Reason</span>
                        <span className="font-semibold text-foreground">{approval.resolutionReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                <details className="group border border-border rounded-xl bg-background/25 overflow-hidden">
                  <summary className="flex items-center justify-between p-3.5 text-xs font-bold text-muted-foreground cursor-pointer select-none group-open:border-b group-open:border-border transition-colors hover:text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Terminal size={14} />
                      Raw Metadata
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground tracking-wider font-semibold">
                      Advanced
                    </span>
                  </summary>
                  <div className="p-3.5 bg-background/50">
                    <pre className="text-[9px] font-mono overflow-x-auto text-muted-foreground max-h-48 leading-relaxed">
                      {JSON.stringify(approval, null, 2)}
                    </pre>
                  </div>
                </details>
              </>
            )}
          </div>

          {approval.status?.toUpperCase() === "PENDING" && (
            <div className="p-6 bg-card border-t border-border flex items-center justify-end gap-3 shrink-0">
              <button
                disabled={resolving}
                onClick={() => handleResolve("reject")}
                className="px-5 py-2.5 border border-red-500/20 hover:border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 transition-colors"
              >
                Reject
              </button>
              <button
                disabled={resolving}
                onClick={() => handleResolve("approve")}
                className="app-btn-3d px-5 py-2.5 bg-accent text-accent-foreground text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 transition-all"
              >
                Approve
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
