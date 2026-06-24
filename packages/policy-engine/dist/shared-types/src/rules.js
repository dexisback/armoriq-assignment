import { z } from "zod";
export const RuleTypeSchema = z.enum([
    "BLOCK_TOOL",
    "REQUIRE_APPROVAL",
    "INPUT_VALIDATION",
    "BUDGET_LIMIT",
    "RISK_BASED",
]);
export const RiskLevelSchema = z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
]);
export const BlockToolRuleSchema = z.object({
    type: z.literal("BLOCK_TOOL"),
    toolName: z.string(),
});
export const ApprovalRuleSchema = z.object({
    type: z.literal("REQUIRE_APPROVAL"),
    toolName: z.string(),
});
export const InputValidationRuleSchema = z.object({
    type: z.literal("INPUT_VALIDATION"),
    toolName: z.string(),
    allowedPrefix: z.string(),
});
export const BudgetRuleSchema = z.object({
    type: z.literal("BUDGET_LIMIT"),
    maxTokens: z.number().positive(),
});
export const RiskBasedRuleSchema = z.object({
    type: z.literal("RISK_BASED"),
    riskLevel: RiskLevelSchema,
});
export const RuleSchema = z.discriminatedUnion("type", [
    BlockToolRuleSchema,
    ApprovalRuleSchema,
    InputValidationRuleSchema,
    BudgetRuleSchema,
    RiskBasedRuleSchema,
]);
//used by policy engine, dashboard and db
//defines all rule schemas so things like block_tool, require_approval, input_validation, budget_limit, and risk_based
//also risk lvel and rule
