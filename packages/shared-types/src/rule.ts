export enum RuleType {
  BLOCK_TOOL = "BLOCK_TOOL",
  REQUIRE_APPROVAL = "REQUIRE_APPROVAL",
  INPUT_VALIDATION = "INPUT_VALIDATION",
  BUDGET_LIMIT = "BUDGET_LIMIT",
  RISK_BASED = "RISK_BASED",
}

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export type BlockToolRule = {
  type: RuleType.BLOCK_TOOL;
  toolName: string;
};

export type ApprovalRule = {
  type: RuleType.REQUIRE_APPROVAL;
  toolName: string;
};

export type InputValidationRule = {
  type: RuleType.INPUT_VALIDATION;
  toolName: string;
  allowedPrefix: string;
};

export type BudgetRule = {
  type: RuleType.BUDGET_LIMIT;
  maxTokens: number;
};

export type RiskBasedRule = {
  type: RuleType.RISK_BASED;
  riskLevel: RiskLevel;
};

export type Rule =
  | BlockToolRule
  | ApprovalRule
  | InputValidationRule
  | BudgetRule
  | RiskBasedRule;




//used by policy engine, dashboard and db
