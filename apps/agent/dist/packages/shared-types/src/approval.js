import { z } from "zod";
export const ApprovalStatusSchema = z.enum([
    "PENDING",
    "APPROVED",
    "REJECTED",
    "EXPIRED",
]);
export const ApprovalRequestSchema = z.object({
    id: z.string(),
    toolName: z.string(),
    arguments: z.record(z.string(), z.unknown()),
    status: ApprovalStatusSchema,
    requestedAt: z.date(),
    resolvedAt: z.date().optional(),
    resolutionReason: z.string().optional(),
});
//approval queue contracts
//used by policy-engine , dashboard and agent
