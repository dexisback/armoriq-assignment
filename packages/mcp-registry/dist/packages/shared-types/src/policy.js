import { z } from "zod";
export const PolicyDecisionTypeSchema = z.enum([
    "ALLOW",
    "DENY",
    "REQUIRE_APPROVAL",
    "VALIDATION_FAILED",
    "BUDGET_EXCEEDED",
    "ERROR",
]);
export const PolicyRequestSchema = z.object({
    conversationId: z.string(),
    toolName: z.string(),
    args: z.record(z.string(), z.unknown()),
});
export const PolicyTraceStepSchema = z.object({
    rule: z.string(),
    matched: z.boolean(),
    message: z.string(),
});
export const PolicyDecisionSchema = z.object({
    decision: PolicyDecisionTypeSchema,
    reason: z.string().optional(),
    approvalId: z.string().optional(),
    trace: z.array(PolicyTraceStepSchema).optional(),
});
//shared policy types, gonna be used by all services. apps/, packages, and our agent
//defines policy contracts . as in , policyRequest, policyDecision, PolicyTraceStep, PolicyDecisionType
