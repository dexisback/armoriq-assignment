import { RiskLevel } from "./rule.js";

export type ToolMetadata = {
  name: string;
  description: string;
  serverId: string;
  riskLevel: RiskLevel;
};

export type ToolCallRequest = {
  toolName: string;
  args: Record<string, unknown>;
};

export type ToolCallResult = {
  success: boolean;
  content: unknown;
  error?: string;
};




