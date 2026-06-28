import { api } from "./api";

export const STALE_TIMES = {
  tools: 30_000,
  rules: 30_000,
  approvals: 15_000,
  logs: 15_000,
  health: 10_000,
};

async function j<T = any>(path: string): Promise<T> {
  return api.get(path).then((r) => {
    if (!r.ok) throw new Error(`GET ${path} failed: ${r.status}`);
    return r.json();
  });
}

export function getQueryKeys() {
  return {
    tools: ["tools"] as const,
    rules: ["rules"] as const,
    approvals: ["approvals"] as const,
    logs: ["logs"] as const,
    health: ["health"] as const,
    system: ["system-health"] as const,
    topology: ["mcp-topology"] as const,
  };
}

export const queryFns = {
  tools: () => j<any[]>("/api/tools"),
  rules: () => j<any[]>("/api/rules"),
  approvals: () => j<any[]>("/api/approvals"),
  logs: () => j<any[]>("/api/logs"),
  health: () => j<any>("/api/health"),
};
