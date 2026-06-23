import { PolicyDecisionType } from "./policy.js";
import { RiskLevel } from "./rule.js";

export type ToolExecutionLog = {
  id: string;

  conversationId?: string;

  toolName: string;

  riskLevel?: RiskLevel;

  decision: PolicyDecisionType;

  reason?: string;

  trace?: unknown[];

  executed: boolean;

  timestamp: Date;
};


//logger, dashboard, policy engine, agent
