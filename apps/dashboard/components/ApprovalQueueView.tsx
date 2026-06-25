"use client";

import { useEffect, useState } from "react";
import { Check, X, ClipboardCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { ApprovalDetailsDrawer } from "./ApprovalDetailsDrawer";

export function ApprovalQueueView() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);

  async function fetchApprovals() {
    try {
      setLoading(true);
      const res = await fetch("/api/approvals");
      const data = await res.json();
      setApprovals(data);
    } catch (err) {
      setError("Failed to fetch approval queue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApprovals();
  }, []);

  async function resolveApproval(id: string, action: "approve" | "reject") {
    try {
      setResolvingId(id);
      
      const res = await fetch(`/api/approvals/${id}/${action}`, {
        method: "POST",
      });

      if (res.ok) {
        setApprovals(prev => prev.filter(a => a.id !== id));
        if (action === "approve") {
          toast.success("Approval approved successfully.");
        } else {
          toast.success("Approval rejected.");
        }
      } else {
        toast.error(`Failed to resolve approval: ${action}`);
      }
    } catch (err) {
      toast.error("Error resolving approval");
    } finally {
      setResolvingId(null);
    }
  }

  if (loading && approvals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-semibold text-muted-foreground animate-pulse">
          Loading approval requests...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-foreground">Action Approval Queue</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Review and approve or reject intercepted actions that require dynamic manual authorization.
        </p>
      </div>

      {approvals.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-2xl bg-card">
          <ClipboardCheck className="mx-auto text-muted-foreground mb-3" size={24} />
          <h3 className="text-xs font-bold text-foreground">All Clear!</h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            No pending action approvals are currently in the queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {approvals.map((approval) => (
            <div
              key={approval.id}
              onClick={() => setSelectedApproval(approval)}
              className="p-5 rounded-2xl bg-card border border-border hover:border-accent/40 hover:bg-muted/10 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 relative overflow-hidden cursor-pointer group"
            >
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-foreground">{approval.toolName}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Clock size={10} />
                    {approval.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Req ID: {approval.id.slice(0, 8)}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                    Intercepted Parameters:
                  </span>
                  <pre className="text-[10px] font-mono bg-background/50 border border-border p-2.5 rounded-lg overflow-x-auto text-foreground max-h-32">
                    {JSON.stringify(approval.arguments, null, 2)}
                  </pre>
                </div>

                <div className="text-[10px] text-muted-foreground">
                  Requested at: {new Date(approval.requestedAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-start z-10">
                <button
                  disabled={resolvingId === approval.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    resolveApproval(approval.id, "reject");
                  }}
                  className="px-4 py-2 border border-red-500/20 hover:border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <X size={14} />
                  Reject
                </button>
                <button
                  disabled={resolvingId === approval.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    resolveApproval(approval.id, "approve");
                  }}
                  className="app-btn-3d px-4 py-2 bg-accent text-accent-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                >
                  <Check size={14} />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedApproval && (
        <ApprovalDetailsDrawer
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onSuccess={() => {
            fetchApprovals();
          }}
        />
      )}
    </div>
  );
}

