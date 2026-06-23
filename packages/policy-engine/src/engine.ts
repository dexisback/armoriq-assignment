//load rules -> sort the rules by priority -> call evaluator -> build the final decision -> return PolicyDecision 
//everything eventually calls policyEngine.evaluate()
//why? because the agent never actually talks to the evaluator, or the rule-matcher, or etc etc. it only talks to one (this ) service (policyEngine.evaluate(data)), and gets back the policyDecision


import type {
  PolicyDecision,
  PolicyRequest,
  PolicyTraceStep,
  RiskLevel,
  Rule,
} from "@armoriq/shared-types";

import {
  PolicyDecisionTypeSchema,
  RuleTypeSchema,
} from "@armoriq/shared-types";

import {
  evaluateApprovalRule,
  evaluateBlockRule,
  evaluateBudgetRule,
  evaluateRiskRule,
  evaluateValidationRule,
} from "./evaluator.js";

export class PolicyEngine {
  constructor(
    private readonly rules: Rule[]
  ) {}

  async evaluate(
    request: PolicyRequest,
    options?: {
      currentTokens?: number;
      riskLevel?: RiskLevel;
    }
  ): Promise<PolicyDecision> {
    const trace: PolicyTraceStep[] = [];

    const currentTokens =
      options?.currentTokens ?? 0;

    const riskLevel =
      options?.riskLevel;

    for (const rule of this.rules) {
      switch (rule.type) {
        case RuleTypeSchema.enum.BLOCK_TOOL: {
          const result =
            evaluateBlockRule(
              rule,
              request,
              trace
            );

          if (result) {
            return result;
          }

          break;
        }

        case RuleTypeSchema.enum.INPUT_VALIDATION: {
          const result =
            evaluateValidationRule(
              rule,
              request,
              trace
            );

          if (result) {
            return result;
          }

          break;
        }

        case RuleTypeSchema.enum.BUDGET_LIMIT: {
          const result =
            evaluateBudgetRule(
              rule,
              currentTokens,
              trace
            );

          if (result) {
            return result;
          }

          break;
        }

        case RuleTypeSchema.enum.RISK_BASED: {
          const result =
            evaluateRiskRule(
              rule,
              riskLevel,
              trace
            );

          if (result) {
            return result;
          }

          break;
        }

        case RuleTypeSchema.enum.REQUIRE_APPROVAL: {
          const result =
            evaluateApprovalRule(
              rule,
              request,
              trace
            );

          if (result) {
            return result;
          }

          break;
        }
      }
    }

    return {
      decision:
        PolicyDecisionTypeSchema.enum.ALLOW,
      reason:
        "No policy violations detected",
      trace,
    };
  }
}



