"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { api } from "../lib/api";
import {
  ToggleOn,
  ToggleOff,
  EditIcon,
  DeleteIcon,
  CloseIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
} from "./icons";
import { sound } from "./SoundSystem";

export function PoliciesView() {
  const [rules, setRules] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    if (isModalOpen) {
      sound.playModalOpen();
    } else {
      sound.playModalClose();
    }
  }, [isModalOpen, hasMounted]);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // Collapsed rule JSON states
  const [expandedRuleIds, setExpandedRuleIds] = useState<
    Record<string, boolean>
  >({});

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("BLOCK_TOOL");
  const [priority, setPriority] = useState(100);
  const [selectedTool, setSelectedTool] = useState("");
  const [allowedPrefix, setAllowedPrefix] = useState("/sandbox/");
  const [minimumRisk, setMinimumRisk] = useState("HIGH");
  const [decision, setDecision] = useState("REQUIRE_APPROVAL");
  const [maxTokens, setMaxTokens] = useState(50000);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function fetchAllData() {
    try {
      setLoading(true);
      const [rulesRes, toolsRes] = await Promise.all([
        api.get("/api/rules").then((r) => r.json()),
        api.get("/api/tools").then((r) => r.json()),
      ]);
      setRules(rulesRes || []);
      setTools(toolsRes || []);

      if (toolsRes && toolsRes.length > 0) {
        setSelectedTool(toolsRes[0].toolName);
      }
    } catch (err) {
      console.error("Failed to load policy data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const handleOpenModal = () => {
      openAddModal();
    };
    window.addEventListener("open-new-policy-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-new-policy-modal", handleOpenModal);
    };
  }, [tools]);

  // Update default tools selection if rules type is changed
  useEffect(() => {
    if (tools.length > 0 && !selectedTool) {
      setSelectedTool(tools[0].toolName);
    }
  }, [type, tools, selectedTool]);

  function getGeneratedConfig() {
    switch (type) {
      case "BLOCK_TOOL":
        return {
          type: "BLOCK_TOOL",
          toolNames: [selectedTool || tools[0]?.toolName || ""],
        };
      case "REQUIRE_APPROVAL":
        return {
          type: "REQUIRE_APPROVAL",
          toolNames: [selectedTool || tools[0]?.toolName || ""],
        };
      case "INPUT_VALIDATION":
        return {
          type: "INPUT_VALIDATION",
          toolName: selectedTool || tools[0]?.toolName || "",
          allowedPrefix: allowedPrefix || "/sandbox/",
        };
      case "RISK_BASED":
        return {
          type: "RISK_BASED",
          minimumRisk: minimumRisk || "HIGH",
          decision: decision || "REQUIRE_APPROVAL",
        };
      case "BUDGET_LIMIT":
        return {
          type: "BUDGET_LIMIT",
          maxTokens: Number(maxTokens) || 50000,
        };
      default:
        return {};
    }
  }

  function getRulePreviewText() {
    switch (type) {
      case "BLOCK_TOOL":
        return `This rule will completely block execution of the selected tool (${selectedTool || "none"}).`;
      case "REQUIRE_APPROVAL":
        return `Execution of the tool (${selectedTool || "none"}) will pause until an administrator approves it.`;
      case "INPUT_VALIDATION":
        return `Only file paths inside "${allowedPrefix || "/sandbox/"}" will be allowed for tool "${selectedTool || "none"}".`;
      case "RISK_BASED":
        return `Every tool whose final risk is ${minimumRisk} or greater will ${
          decision === "REQUIRE_APPROVAL" ? "require approval" : "be denied"
        }.`;
      case "BUDGET_LIMIT":
        return `Once a conversation exceeds ${maxTokens.toLocaleString()} tokens, all future tool executions will be blocked.`;
      default:
        return "";
    }
  }

  function openAddModal() {
    setEditingRuleId(null);
    setName("");
    setDescription("");
    setType("BLOCK_TOOL");
    setPriority(100);
    if (tools.length > 0) {
      setSelectedTool(tools[0].toolName);
    } else {
      setSelectedTool("");
    }
    setAllowedPrefix("/sandbox/");
    setMinimumRisk("HIGH");
    setDecision("REQUIRE_APPROVAL");
    setMaxTokens(50000);
    setIsAdvancedOpen(false);
    setIsModalOpen(true);
  }

  function openEditModal(rule: any) {
    setEditingRuleId(rule.id);
    setName(rule.name);
    setDescription(rule.description || "");
    setType(rule.type);
    setPriority(rule.priority);

    const config = rule.config || {};
    if (rule.type === "BLOCK_TOOL" || rule.type === "REQUIRE_APPROVAL") {
      setSelectedTool(config.toolNames?.[0] || "");
    } else if (rule.type === "INPUT_VALIDATION") {
      setSelectedTool(config.toolName || "");
      setAllowedPrefix(config.allowedPrefix || "/sandbox/");
    } else if (rule.type === "RISK_BASED") {
      setMinimumRisk(config.minimumRisk || "HIGH");
      setDecision(config.decision || "REQUIRE_APPROVAL");
    } else if (rule.type === "BUDGET_LIMIT") {
      setMaxTokens(config.maxTokens || 50000);
    }

    setIsAdvancedOpen(false);
    setIsModalOpen(true);
  }

  async function handleToggleRule(rule: any) {
    try {
      const updatedEnabled = !rule.enabled;
      if (updatedEnabled) {
        sound.playToggleOn();
      } else {
        sound.playToggleOff();
      }
      setRules((prev) =>
        prev.map((r) =>
          r.id === rule.id ? { ...r, enabled: updatedEnabled } : r,
        ),
      );

      const res = await api.patch(`/api/rules/${rule.id}`, { enabled: updatedEnabled });

      if (!res.ok) {
        throw new Error("Toggle update failed");
      }
    } catch (err) {
      sound.playError();
      console.error(err);
      fetchAllData();
    }
  }

  async function handleDeleteRule(id: string) {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      setRules((prev) => prev.filter((r) => r.id !== id));
      sound.playSuccess();

      const res = await api.delete(`/api/rules/${id}`);

      if (!res.ok) {
        throw new Error("Delete failed");
      }
    } catch (err) {
      sound.playError();
      console.error(err);
      fetchAllData();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      type,
      priority: Number(priority),
      config: getGeneratedConfig(),
      enabled: true,
    };

    try {
      setSubmitting(true);
      let res;
      if (editingRuleId) {
        res = await api.patch(`/api/rules/${editingRuleId}`, payload);
      } else {
        res = await api.post("/api/rules", payload);
      }

      if (res.ok) {
        sound.playSuccess();
        setIsModalOpen(false);
        fetchAllData();
      } else {
        sound.playError();
        const data = await res.json();
        alert(data.error || "Request failed");
      }
    } catch (err) {
      sound.playError();
      alert("Network request error");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleExpandRuleJson(id: string) {
    setExpandedRuleIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  if (loading && rules.length === 0) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center">
          <div className="space-y-2 w-1/3 animate-pulse">
            <div className="h-4 bg-muted/65 rounded" />
            <div className="h-3 bg-muted/40 rounded w-2/3" />
          </div>
          <div className="h-8 bg-muted/65 rounded w-28" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-border/40 bg-card/25 h-[120px] flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-muted/65 rounded w-1/4" />
                  <div className="h-4 bg-muted/40 rounded w-12" />
                </div>
                <div className="h-3 bg-muted/40 rounded w-2/3" />
              </div>
              <div className="flex gap-2">
                <div className="h-5 bg-muted/40 rounded w-16" />
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
          <h2 className="text-base font-semibold text-foreground">
            Security Policies & Rules
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Build guards to block tools, enforce path scopes, require approvals,
            or limit usage budgets.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="app-btn-3d flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground font-medium rounded-xl text-xs transition-[transform,box-shadow] duration-200 ease-out cursor-pointer active:scale-[0.96] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_4px_12px_rgba(var(--accent-rgb),0.2)]"
        >
          <PlusIcon size={14} strokeWidth={2} />
          New Policy
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-16 rounded-lg border border-border bg-card/45">
          <Shield className="mx-auto text-muted-foreground mb-3" size={24} />
          <h3 className="text-sm font-semibold text-foreground">
            No Policies Found
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            Define safety schemas to protect your systems.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-muted/40 rounded-xl text-xs font-medium cursor-pointer transition-[background-color,transform] duration-200 ease-out active:scale-[0.96]"
          >
            Create Your First Rule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rules.map((rule, index) => {
            const isJsonExpanded = expandedRuleIds[rule.id] || false;

            return (
              <div
                key={rule.id}
                className={`group p-4 rounded-lg app-glass app-card-3d cursor-pointer transition-[opacity,transform] duration-200 ease-out hover:shadow-lg ${
                  rule.enabled ? "" : "opacity-60"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors duration-180">
                        {rule.name}
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium uppercase tracking-wider bg-accent/15 text-accent border border-accent/25 shadow-sm">
                        {rule.type}
                      </span>
                      <span
                        className="text-[10px] text-muted-foreground font-mono"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        Priority: {rule.priority}
                      </span>
                    </div>
                    {rule.description && (
                      <div className="max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-[max-height,opacity] duration-300 ease-out overflow-hidden">
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1.5 max-w-2xl">
                          {rule.description}
                        </p>
                      </div>
                    )}

                    {/* Summary Parameters Block (Redesigned Human-Readable UX) */}
                    <div
                      className="mt-3 bg-background/50 border border-border/70 rounded-xl p-3.5 max-w-2xl shadow-sm"
                      style={{
                        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        {rule.type === "BLOCK_TOOL" && (
                          <>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Target Tool
                              </span>
                              <p className="font-medium text-foreground mt-0.5">
                                {rule.config?.toolNames?.[0] || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Action
                              </span>
                              <p className="font-medium text-rose-500 dark:text-rose-400 mt-0.5">
                                Block Tool
                              </p>
                            </div>
                          </>
                        )}

                        {rule.type === "REQUIRE_APPROVAL" && (
                          <>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Target Tool
                              </span>
                              <p className="font-medium text-foreground mt-0.5">
                                {rule.config?.toolNames?.[0] || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Action
                              </span>
                              <p className="font-medium text-amber-500 mt-0.5">
                                Require Human Approval
                              </p>
                            </div>
                          </>
                        )}

                        {rule.type === "INPUT_VALIDATION" && (
                          <>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Tool
                              </span>
                              <p className="font-medium text-foreground mt-0.5">
                                {rule.config?.toolName || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Allowed Prefix
                              </span>
                              <p className="font-mono font-medium text-accent mt-0.5">
                                {rule.config?.allowedPrefix || "N/A"}
                              </p>
                            </div>
                          </>
                        )}

                        {rule.type === "RISK_BASED" && (
                          <>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Minimum Risk
                              </span>
                              <p className="font-medium text-foreground mt-0.5 font-mono">
                                {rule.config?.minimumRisk || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Action
                              </span>
                              <p className="font-medium text-foreground mt-0.5">
                                {rule.config?.decision === "REQUIRE_APPROVAL"
                                  ? "Require Approval"
                                  : "Deny"}
                              </p>
                            </div>
                          </>
                        )}

                        {rule.type === "BUDGET_LIMIT" && (
                          <>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Maximum Tokens
                              </span>
                              <p
                                className="font-medium text-foreground mt-0.5 font-mono"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                              >
                                {(rule.config?.maxTokens || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground">
                                Action
                              </span>
                              <p className="font-medium text-foreground mt-0.5">
                                Budget Limit
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Advanced Collapsible Mode */}
                    <div className="mt-3">
                      <button
                        onClick={() => toggleExpandRuleJson(rule.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-180"
                      >
                        Advanced
                        {isJsonExpanded ? (
                          <ChevronUpIcon size={12} strokeWidth={2} />
                        ) : (
                          <ChevronDownIcon size={12} strokeWidth={2} />
                        )}
                      </button>

                      {isJsonExpanded && (
                        <pre
                          className="mt-1.5 text-[10px] font-mono bg-background border border-border/60 p-3 rounded-lg overflow-x-auto text-foreground shadow-sm"
                          style={{
                            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          {JSON.stringify(rule.config, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleRule(rule)}
                      className="p-2 hover:bg-muted/40 rounded-lg cursor-pointer transition-[background-color,transform,box-shadow] duration-180 ease-out active:scale-[0.96] group"
                      title={rule.enabled ? "Disable Rule" : "Enable Rule"}
                    >
                      {rule.enabled ? (
                        <ToggleOn
                          size={20}
                          className="text-accent group-hover:drop-shadow-[0_0_4px_rgba(var(--accent-rgb),0.4)]"
                          strokeWidth={1.5}
                        />
                      ) : (
                        <ToggleOff
                          size={20}
                          className="text-muted-foreground/50 group-hover:text-muted-foreground"
                          strokeWidth={1.5}
                        />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(rule)}
                      className="p-2.5 border border-border/50 hover:border-accent/40 hover:bg-accent/8 text-muted-foreground hover:text-accent rounded-lg cursor-pointer transition-[background-color,border-color,color,transform,box-shadow] duration-180 ease-out active:scale-[0.96] hover:shadow-[0_0_8px_rgba(var(--accent-rgb),0.1)]"
                      title="Edit Rule"
                    >
                      <EditIcon size={14} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2.5 border border-border/50 hover:border-rose-500/40 hover:bg-rose-500/12 text-muted-foreground hover:text-rose-500 rounded-lg cursor-pointer transition-[background-color,border-color,color,transform,box-shadow] duration-180 ease-out active:scale-[0.96] hover:shadow-[0_0_8px_rgba(244,63,94,0.15)]"
                      title="Delete Rule"
                    >
                      <DeleteIcon size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* modal block */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="w-full max-w-lg app-glass rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground">
                {editingRuleId
                  ? "Edit Security Policy"
                  : "Create New Security Policy"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-muted/60 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-[background-color,color,transform] duration-180 ease-out active:scale-[0.96]"
              >
                <CloseIcon size={16} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block file writes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent transition-[border-color,box-shadow] duration-200 ease-out"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Enforces security constraints on active tools"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent resize-none transition-[border-color,box-shadow] duration-200 ease-out"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Rule Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent transition-[border-color] duration-200 ease-out"
                  >
                    <option value="BLOCK_TOOL">BLOCK_TOOL</option>
                    <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
                    <option value="INPUT_VALIDATION">INPUT_VALIDATION</option>
                    <option value="RISK_BASED">RISK_BASED</option>
                    <option value="BUDGET_LIMIT">BUDGET_LIMIT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Priority
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent font-mono transition-[border-color] duration-200 ease-out"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
              </div>

              {/* DYNAMIC FIELD SECTIONS */}
              {(type === "BLOCK_TOOL" ||
                type === "REQUIRE_APPROVAL" ||
                type === "INPUT_VALIDATION") && (
                <div>
                  <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Target Tool
                  </label>
                  <select
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent transition-[border-color] duration-200 ease-out"
                  >
                    {tools.map((t) => (
                      <option key={t.id} value={t.toolName}>
                        {t.toolName} ({t.serverId})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {type === "INPUT_VALIDATION" && (
                <div>
                  <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Allowed Path Prefix
                  </label>
                  <input
                    type="text"
                    required
                    value={allowedPrefix}
                    onChange={(e) => setAllowedPrefix(e.target.value)}
                    placeholder="/sandbox/"
                    className="w-full text-xs font-medium px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent font-mono transition-[border-color] duration-200 ease-out"
                  />
                </div>
              )}

              {type === "RISK_BASED" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                      Trigger Risk
                    </label>
                    <select
                      value={minimumRisk}
                      onChange={(e) => setMinimumRisk(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent transition-[border-color] duration-200 ease-out"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                      Decision
                    </label>
                    <select
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent transition-[border-color] duration-200 ease-out"
                    >
                      <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
                      <option value="DENY">DENY</option>
                    </select>
                  </div>
                </div>
              )}

              {type === "BUDGET_LIMIT" && (
                <div>
                  <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Conversation Budget (tokens)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent font-mono transition-[border-color] duration-200 ease-out"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
              )}

              {/* HUMAN READABLE PREVIEW PANEL */}
              <div
                className="p-3 bg-muted/40 border border-border/70 rounded-xl shadow-sm"
                style={{ boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)" }}
              >
                <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground block mb-1">
                  Summary Preview
                </span>
                <p className="text-xs text-foreground font-medium leading-relaxed">
                  {getRulePreviewText()}
                </p>
              </div>

              {/* ADVANCED COLLAPSIBLE MODE FOR PREVIEWING GENERATED JSON */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-180"
                >
                  Advanced
                  {isAdvancedOpen ? (
                    <ChevronUpIcon size={12} strokeWidth={2} />
                  ) : (
                    <ChevronDownIcon size={12} strokeWidth={2} />
                  )}
                </button>

                {isAdvancedOpen && (
                  <div className="mt-1.5 space-y-1">
                    <span className="text-[9px] font-mono font-medium uppercase text-muted-foreground block">
                      Generated Config JSON:
                    </span>
                    <pre
                      className="text-[10px] font-mono bg-background border border-border/60 p-3 rounded-lg overflow-x-auto text-foreground shadow-sm"
                      style={{
                        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {JSON.stringify(getGeneratedConfig(), null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-medium hover:bg-muted/40 cursor-pointer transition-[background-color,transform] duration-200 ease-out active:scale-[0.96]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    (type === "BLOCK_TOOL" ||
                    type === "REQUIRE_APPROVAL" ||
                    type === "INPUT_VALIDATION"
                      ? !selectedTool
                      : false)
                  }
                  className="app-btn-3d px-4 py-2 bg-accent text-accent-foreground font-medium rounded-xl text-xs transition-[opacity,transform] duration-200 ease-out hover:opacity-90 cursor-pointer disabled:opacity-50 active:scale-[0.96]"
                >
                  {submitting
                    ? "Saving..."
                    : editingRuleId
                      ? "Save Changes"
                      : "Create Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
