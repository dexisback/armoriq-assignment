import { z } from "zod";

export const ApprovalStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
]);

export type ApprovalStatus = z.infer<
  typeof ApprovalStatusSchema
>;

export const ApprovalRequestSchema = z.object({
  id: z.string(),

  toolName: z.string(),

  arguments: z.record(
    z.string(),
    z.unknown()
  ),

  status: ApprovalStatusSchema,

  requestedAt: z.date(),

  resolvedAt: z.date().optional(),

  resolutionReason: z.string().optional(),
});

export type ApprovalRequest = z.infer<
  typeof ApprovalRequestSchema
>;
