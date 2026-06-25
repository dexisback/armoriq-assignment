"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Search, ShieldAlert, Check } from "lucide-react";

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
      const res = await fetch("/api/tools");
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
      const res = await fetch("/api/tools/refresh", {
        method: "POST",
      });
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
    try {
      // Optimistic update
      setTools(prev => 
        prev.map(t => t.toolName === toolName ? { ...t, finalRisk: newRisk } : t)
      );

      const res = await fetch(`/api/tools/${toolName}/risk`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riskLevel: newRisk }),
      });

      if (!res.ok) {
        throw new Error("Failed to save override");
      }
    } catch (err) {
      fetchTools();
    }
  }

  const filteredTools = tools.filter(tool => 
    tool.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.serverId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getRiskBadgeClass(risk: string) {
    switch (risk) {
      case "LOW":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "HIGH":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "CRITICAL":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  }

  if (loading && tools.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-semibold text-muted-foreground animate-pulse">
          Loading tool catalog...
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
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getRiskBadgeClass(tool.inferredRisk)}`}>
                      {tool.inferredRisk}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-block relative">
                      <select
                        value={tool.finalRisk}
                        onChange={(e) => handleOverrideRisk(tool.toolName, e.target.value)}
                        className={`text-[9px] font-bold uppercase tracking-wider border rounded px-2.5 py-1 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-accent ${getRiskBadgeClass(tool.finalRisk)}`}
                      >
                        {riskLevels.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </div>
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
