//this file converts the result/evaluation returned by the rule-matcher into actual decisions, and also builds trace (for logs) while at it
import { PolicyDecisionTypeSchema } from "@armoriq/shared-types";
import { matchesApprovalRule } from "./rule-matcher/approval.rule.js";
import { matchesBlockToolRule } from "./rule-matcher/block-tool.rule.js";
import { exceedsBudget } from "./rule-matcher/budget.rule.js";
import { matchesInputValidationRule } from "./rule-matcher/input-validation.rule.js";
import { matchesRiskRule } from "./rule-matcher/risk.rule.js";
export function evaluateBlockRule(rule, request, trace) {
    const matched = matchesBlockToolRule(rule, request);
    trace.push({
        rule: "BLOCK_TOOL",
        matched,
        message: matched
            ? `Blocked ${request.toolName}`
            : "Rule not matched",
    });
    if (!matched)
        return null;
    return {
        decision: PolicyDecisionTypeSchema.enum.DENY,
        reason: `Tool ${request.toolName} is blocked`,
        trace,
    };
}
export function evaluateApprovalRule(rule, request, trace) {
    const matched = matchesApprovalRule(rule, request);
    trace.push({
        rule: "REQUIRE_APPROVAL",
        matched,
        message: matched
            ? "Approval required"
            : "Rule not matched",
    });
    if (!matched)
        return null;
    return {
        decision: PolicyDecisionTypeSchema.enum.REQUIRE_APPROVAL,
        reason: "Approval required",
        trace,
    };
}
export function evaluateValidationRule(rule, request, trace) {
    const valid = matchesInputValidationRule(rule, request);
    trace.push({
        rule: "INPUT_VALIDATION",
        matched: !valid,
        message: valid
            ? "Validation passed"
            : "Validation failed",
    });
    if (valid)
        return null;
    return {
        decision: PolicyDecisionTypeSchema.enum.VALIDATION_FAILED,
        reason: "Input validation failed",
        trace,
    };
}
export function evaluateBudgetRule(rule, currentTokens, trace) {
    const exceeded = exceedsBudget(rule, currentTokens);
    trace.push({
        rule: "BUDGET_LIMIT",
        matched: exceeded,
        message: exceeded
            ? "Budget exceeded"
            : "Budget ok",
    });
    if (!exceeded)
        return null;
    return {
        decision: PolicyDecisionTypeSchema.enum.BUDGET_EXCEEDED,
        reason: "Budget exceeded",
        trace,
    };
}
export function evaluateRiskRule(rule, riskLevel, trace) {
    const matched = matchesRiskRule(rule, riskLevel);
    trace.push({
        rule: "RISK_BASED",
        matched,
        message: matched
            ? "Risk rule matched"
            : "Risk rule not matched",
    });
    if (!matched)
        return null;
    return {
        decision: PolicyDecisionTypeSchema.enum.REQUIRE_APPROVAL,
        reason: "High risk action requires approval",
        trace,
    };
}
