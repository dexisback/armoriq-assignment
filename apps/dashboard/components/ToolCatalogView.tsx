"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Search, ShieldAlert, Check } from "lucide-react";
import { api } from "../lib/api";

export function ToolCatalogView() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const riskLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

  async function fetchTools() {
    try {
      setLoading(true);
      const res = await api.get("/api/tools");
      const data = await res.json();
      setTools(data);
    } catch (err) {
      setError("Failed to fetch tool catalog");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTools();
  }, []);

  async function handleRefresh() {
    try {
      setRefreshing(true);
      const res = await api.post("/api/tools/refresh");
      if (res.ok) {
        fetchTools();
      } else {
        alert("Failed to refresh catalog");
      }
    } catch (err) {
      alert("Error refreshing catalog");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleOverrideRisk(toolName: string, newRisk: string) {
    const previous = tools.find(
      (t) => t.toolName === toolName,
    )?.finalRisk;
    try {
      // Optimistic update
      setTools(prev =>
        prev.map(t => t.toolName === toolName ? { ...t, finalRisk: newRisk, overridden: true } : t)
      );

      const res = await api.patch(`/api/tools/${toolName}/risk`, { riskLevel: newRisk });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Save failed (${res.status})`);
      }
    } catch (err) {
      // Rollback optimistic update
      setTools(prev =>
        prev.map(t => t.toolName === toolName ? { ...t, finalRisk: previous ?? t.finalRisk } : t)
      );
      const msg = err instanceof Error ? err.message : "Save failed";
      console.error("Risk override failed:", err);
      setError(msg);
    }
  }

  const filteredTools = tools.filter(tool => 
    tool.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.serverId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getRiskTextColor(risk: string) {
    switch (risk) {
      case "LOW":      return "text-emerald-500 dark:text-emerald-400";
      case "MEDIUM":   return "text-blue-500";
      case "HIGH":     return "text-amber-500";
      case "CRITICAL": return "text-rose-500 dark:text-rose-400";
      default:         return "text-muted-foreground";
    }
  }

  if (loading && tools.length === 0) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center">
          <div className="space-y-2 w-1/3 animate-pulse">
            <div className="h-4 bg-muted/65 rounded" />
            <div className="h-3 bg-muted/40 rounded w-2/3" />
          </div>
          <div className="h-8 bg-muted/65 rounded w-20" />
        </div>
        
        <div className="h-10 bg-muted/40 rounded-lg border border-border/40 w-full" />

        <div className="border border-border/40 rounded-lg overflow-hidden bg-card/25 divide-y divide-border/30">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="p-4 flex justify-between items-center">
              <div className="space-y-2 w-1/2">
                <div className="h-4 bg-muted/65 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-muted/40 rounded w-1/2 animate-pulse" />
              </div>
              <div className="flex gap-3">
                <div className="h-5 bg-muted/40 rounded w-12" />
                <div className="h-5 bg-muted/40 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Discovered MCP Tools</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Browse discovered endpoints and manually override their security risk levels.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="app-btn-3d flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-xl text-xs font-semibold hover:bg-muted/40 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Scanning MCPs..." : "Re-scan Servers"}
        </button>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Search by tool name, server, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent"
          />
        </div>
        <div className="text-xs text-muted-foreground shrink-0 font-mono">
          Showing {filteredTools.length} of {tools.length} discovered tools
        </div>
      </div>

      {filteredTools.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-2xl bg-card">
          <ShieldAlert className="mx-auto text-muted-foreground mb-3" size={24} />
          <p className="text-xs text-muted-foreground">No matching tools found in the catalog.</p>
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Tool Name</th>
                <th className="p-4">Server</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Inferred Risk</th>
                <th className="p-4 text-center">Final Risk Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-muted/15 transition-colors align-top">
                  <td className="p-4">
                    <span className="font-bold text-foreground">{tool.toolName}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-muted-foreground bg-background px-2 py-0.5 border border-border rounded">
                      {tool.serverId}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground leading-relaxed max-w-sm">
                    {tool.description}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${getRiskTextColor(tool.inferredRisk)}`}>
                      {tool.inferredRisk}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <select
                      value={tool.finalRisk}
                      onChange={(e) => handleOverrideRisk(tool.toolName, e.target.value)}
                      className={`text-[10px] font-semibold uppercase tracking-wide bg-transparent focus:outline-none cursor-pointer ${getRiskTextColor(tool.finalRisk)}`}
                    >
                      {riskLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
