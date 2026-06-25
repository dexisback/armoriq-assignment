"use client";

import { useEffect, useState } from "react";
import { Plus, Trash, Check, X, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";

export function PoliciesView() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("BLOCK_TOOL");
  const [priority, setPriority] = useState(100);
  const [configText, setConfigText] = useState("{}");
  const [submitting, setSubmitting] = useState(false);

  async function fetchRules() {
    try {
      setLoading(true);
      const res = await fetch("/api/rules");
      const data = await res.json();
      setRules(data);
    } catch (err) {
      setError("Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRules();
  }, []);

  async function toggleRule(rule: any) {
    try {
      const updatedEnabled = !rule.enabled;
      
      // Optimistic update
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: updatedEnabled } : r));

      const res = await fetch(`/api/rules/${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: updatedEnabled }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }
    } catch (err) {
      // Revert on error
      fetchRules();
    }
  }

  async function deleteRule(id: string) {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      // Optimistic delete
      setRules(prev => prev.filter(r => r.id !== id));

      const res = await fetch(`/api/rules/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      fetchRules();
    }
  }

  async function handleAddRule(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    let configJson = {};
    try {
      configJson = JSON.parse(configText);
    } catch (err) {
      alert("Invalid JSON configuration format. Please enter a valid JSON.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          type,
          priority: Number(priority),
          config: configJson,
          enabled: true,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setName("");
        setDescription("");
        setType("BLOCK_TOOL");
        setPriority(100);
        setConfigText("{}");
        fetchRules();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create rule");
      }
    } catch (err) {
      alert("Error creating rule");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && rules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-semibold text-muted-foreground animate-pulse">
          Loading policies...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Security Policies & Rules</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Configure guards to block tools, require approval, or validate arguments.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="app-btn-3d flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-xl text-xs transition-colors hover:opacity-90 cursor-pointer"
        >
          <Plus size={14} />
          New Policy
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-card">
          <Sparkles className="mx-auto text-muted-foreground mb-3" size={24} />
          <h3 className="text-sm font-bold text-foreground">No Policies Defined</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            Get started by defining rule schemas to intercept MCP actions.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-muted/40 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Create Your First Rule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl bg-card border transition-all duration-200 ${
                rule.enabled ? "border-border" : "border-border/40 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-foreground">{rule.name}</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/20">
                      {rule.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono font-tabular">
                      Priority: {rule.priority}
                    </span>
                  </div>
                  {rule.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>
                  )}
                  <div className="mt-3">
                    <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                      Config Schema:
                    </span>
                    <pre className="text-[10px] font-mono bg-background/50 border border-border p-2.5 rounded-lg overflow-x-auto text-foreground max-h-24">
                      {JSON.stringify(rule.config, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleRule(rule)}
                    className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                    title={rule.enabled ? "Disable Rule" : "Enable Rule"}
                  >
                    {rule.enabled ? (
                      <ToggleRight size={28} className="text-accent" />
                    ) : (
                      <ToggleLeft size={28} className="text-muted-foreground/60" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 border border-border hover:border-red-500/30 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg cursor-pointer transition-colors"
                    title="Delete Rule"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-foreground">Create New Security Policy</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-muted/60 text-muted-foreground rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block file deletion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Intercept and reject attempts to call delete files tools"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Rule Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent"
                  >
                    <option value="BLOCK_TOOL">BLOCK_TOOL</option>
                    <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
                    <option value="INPUT_VALIDATION">INPUT_VALIDATION</option>
                    <option value="BUDGET_LIMIT">BUDGET_LIMIT</option>
                    <option value="RISK_BASED">RISK_BASED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Priority
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full text-xs font-semibold px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Configuration JSON
                </label>
                <textarea
                  rows={5}
                  value={configText}
                  onChange={(e) => setConfigText(e.target.value)}
                  className="w-full text-[11px] font-mono px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-semibold hover:bg-muted/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="app-btn-3d px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-xl text-xs transition-colors hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
