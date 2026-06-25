"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Server, Shield, Database, Cpu, Radio, Zap, AlertCircle } from "lucide-react";

interface SubsystemCardProps {
  name: string;
  status: string;
  description: string;
  icon: any;
  state: "healthy" | "warning" | "error" | "unknown";
  metrics?: { label: string; value: string | number }[];
}

function SubsystemCard({ name, status, description, icon: Icon, state, metrics }: SubsystemCardProps) {
  const badgeColors = {
    healthy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    error: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    unknown: "bg-stone-500/10 text-stone-500 border border-stone-500/20",
  };

  const dotColors = {
    healthy: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
    warning: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
    error: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]",
    unknown: "bg-stone-500",
  };

  return (
    <div className="p-3.5 bg-card border border-border rounded-xl flex flex-col justify-between gap-3 shadow-sm hover:border-accent/40 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-background border border-border rounded-lg text-muted-foreground group-hover:text-foreground">
              <Icon size={13} />
            </div>
            <span className="text-[11px] font-bold text-foreground truncate">{name}</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${badgeColors[state]}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotColors[state]} animate-pulse`} />
            {status}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-normal min-h-[32px] line-clamp-2">
          {description}
        </p>
      </div>

      {metrics && metrics.length > 0 && (
        <div className="border-t border-border pt-2 grid grid-cols-2 gap-2 text-[9px] font-mono">
          {metrics.map((m, idx) => (
            <div key={idx} className="truncate">
              <span className="text-muted-foreground block uppercase text-[8px]">{m.label}</span>
              <span className="font-semibold text-foreground truncate">{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubsystemSkeleton() {
  return (
    <div className="p-3.5 bg-card border border-border rounded-xl flex flex-col justify-between gap-4 animate-pulse">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-muted rounded-lg" />
            <div className="w-16 h-3 bg-muted rounded" />
          </div>
          <div className="w-12 h-4 bg-muted rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="w-full h-2.5 bg-muted rounded" />
          <div className="w-4/5 h-2.5 bg-muted rounded" />
        </div>
      </div>
      <div className="border-t border-border pt-2 grid grid-cols-2 gap-2">
        <div className="w-12 h-3 bg-muted rounded" />
        <div className="w-12 h-3 bg-muted rounded" />
      </div>
    </div>
  );
}

export function SystemStatusPanel() {
  const queryClient = useQueryClient();
  const [lastSuccessTime, setLastSuccessTime] = useState<number>(Date.now());
  const [secondsAgo, setSecondsAgo] = useState(0);

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["system-health"],
    queryFn: async () => {
      const [healthRes, rulesRes] = await Promise.all([
        fetch("/api/health").then((r) => {
          if (!r.ok) throw new Error("Health check API failed");
          return r.json();
        }),
        fetch("/api/rules").then((r) => {
          if (!r.ok) throw new Error("Rules API failed");
          return r.json();
        }),
      ]);
      return { health: healthRes, rules: rulesRes };
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (data) {
      setLastSuccessTime(Date.now());
      setSecondsAgo(0);
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastSuccessTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastSuccessTime]);

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["system-health"] });
    refetch();
  };

  function formatUptime(seconds: number) {
    if (!seconds || isNaN(seconds)) return "Unknown";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  const health = data?.health;
  const rules = data?.rules;

  const agentUptime = health?.uptime ? formatUptime(health.uptime) : "N/A";
  const activeRulesCount = rules ? rules.filter((r: any) => r.enabled).length : 0;
  const mcpServers = health?.servers ?? 0;
  const mcpTools = health?.tools ?? 0;

  const dbStatus = health?.database === "healthy" ? "healthy" : (health?.database === "unhealthy" ? "error" : "unknown");
  const redisStatus = health?.redis === "healthy" ? "healthy" : (health?.redis === "unhealthy" ? "warning" : "unknown");

  const subsystems = [
    {
      name: "AI Agent",
      status: error ? "Offline" : (health ? "Online" : "Unknown"),
      description: "Controls the autonomous tool loop and processes user requests.",
      icon: Cpu,
      state: error ? "error" as const : (health ? "healthy" as const : "unknown" as const),
      metrics: [
        { label: "Status", value: "Active" },
        { label: "Uptime", value: agentUptime },
      ],
    },
    {
      name: "Database",
      status: error ? "Offline" : (dbStatus === "healthy" ? "Healthy" : dbStatus === "error" ? "Error" : "Unknown"),
      description: "Prisma and PostgreSQL storage engine for configurations and audit logs.",
      icon: Database,
      state: error ? "error" as const : (dbStatus === "healthy" ? "healthy" as const : "error" as const),
      metrics: [
        { label: "Connection", value: error ? "Offline" : (dbStatus === "healthy" ? "Active" : "Failed") },
      ],
    },
    {
      name: "Policy Engine",
      status: error ? "Error" : (rules ? "Loaded" : "Unknown"),
      description: "Evaluates action safety rules and enforces automated guardrails.",
      icon: Shield,
      state: error ? "error" as const : (rules ? "healthy" as const : "unknown" as const),
      metrics: [
        { label: "Rules", value: `${activeRulesCount} Active` },
      ],
    },
    {
      name: "MCP Registry",
      status: error ? "Offline" : (health ? "Connected" : "Unknown"),
      description: "Registry and connection manager for Model Context Protocol servers.",
      icon: Server,
      state: error ? "error" as const : (health ? "healthy" as const : "unknown" as const),
      metrics: [
        { label: "Servers", value: mcpServers },
        { label: "Tools", value: mcpTools },
      ],
    },
    {
      name: "Redis",
      status: error ? "Offline" : (redisStatus === "healthy" ? "Connected" : redisStatus === "warning" ? "Warning" : "Unknown"),
      description: "Pub/Sub layer synchronizing security policy updates instantly.",
      icon: Radio,
      state: error ? "error" as const : (redisStatus === "healthy" ? "healthy" as const : "warning" as const),
      metrics: [
        { label: "Sync", value: redisStatus === "healthy" ? "Active" : "Inactive" },
      ],
    },
    {
      name: "Gemini",
      status: error ? "Offline" : (health?.models?.gemini ? "Available" : "Unknown"),
      description: "Primary LLM provider endpoint powering agent reasoning and tool loop.",
      icon: Zap,
      state: error ? "error" as const : (health?.models?.gemini ? "healthy" as const : "unknown" as const),
      metrics: [
        { label: "Provider", value: health?.providers?.default || "Gemini" },
        { label: "Model", value: health?.models?.gemini || "gemini-2.5-flash" },
      ],
    },
    {
      name: "Groq Fallback",
      status: error ? "Offline" : (health?.models?.groq ? "Ready" : "Unknown"),
      description: "Secondary model provider for redundancy in case of primary API outages.",
      icon: Zap,
      state: error ? "error" as const : (health?.models?.groq ? "healthy" as const : "unknown" as const),
      metrics: [
        { label: "Provider", value: health?.providers?.fallback || "Groq" },
        { label: "Model", value: health?.models?.groq || "llama-3.3-70b-versatile" },
      ],
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            System Status
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">Live Runtime Health</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-muted-foreground">
            {secondsAgo === 0 ? "Just updated" : `${secondsAgo}s ago`}
          </span>
          <button
            onClick={handleManualRefresh}
            disabled={isFetching}
            className="p-1.5 border border-border hover:border-accent/40 bg-background hover:bg-muted/40 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-all disabled:opacity-50"
            title="Refresh Status"
          >
            <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SubsystemSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <>
          {error && (
            <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-start gap-2 text-[10px] text-rose-500">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Operational Alert:</span> Health monitoring connection issues. Status indicators may reflect cached or partial states.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subsystems.map((sub) => (
              <SubsystemCard
                key={sub.name}
                name={sub.name}
                status={sub.status}
                description={sub.description}
                icon={sub.icon}
                state={sub.state}
                metrics={sub.metrics}
              />
            ))}
          </div>

          <div className="border-t border-border pt-4 mt-2">
            <h5 className="text-[10px] font-mono font-bold uppercase text-foreground mb-2">
              ArmorIQ Runtime Summary
            </h5>
            <ul className="text-[10px] text-muted-foreground space-y-1.5 font-semibold">
              <li className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${error ? "bg-rose-500" : "bg-emerald-500"}`} />
                AI Agent {error ? "offline or unreachable" : "running normally"}
              </li>
              <li className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dbStatus === "error" || error ? "bg-rose-500" : "bg-emerald-500"}`} />
                Prisma & Postgres Connection {dbStatus === "healthy" && !error ? "Active" : "Disconnected"}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                Policy Engine loaded ({activeRulesCount} rules loaded)
              </li>
              <li className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${redisStatus === "warning" || error ? "bg-amber-500" : "bg-emerald-500"}`} />
                Runtime synchronization {redisStatus === "healthy" && !error ? "active" : "degraded (warning)"}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                Ready to evaluate actions and process AI tool requests
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
