export enum PolicyDecisionType {
  ALLOW = "ALLOW",
  DENY = "DENY",
  REQUIRE_APPROVAL = "REQUIRE_APPROVAL",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  BUDGET_EXCEEDED = "BUDGET_EXCEEDED",
  ERROR = "ERROR",
}

export type PolicyRequest = {
  conversationId: string;
  toolName: string;
  args: Record<string, unknown>;
};

export type PolicyTraceStep = {
  rule: string;
  matched: boolean;
  message: string;
};

export type PolicyDecision = {
  decision: PolicyDecisionType;
  reason?: string;
  trace?: PolicyTraceStep[];
  approvalId?: string;
};



//shared policy types, gonna be used by all services. apps/, packages, and our agent
