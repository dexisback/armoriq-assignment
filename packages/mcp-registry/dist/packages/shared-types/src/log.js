import { z } from "zod";
import { RiskLevelSchema } from "./rules.js";
import { PolicyDecisionTypeSchema } from "./policy.js";
export const ToolExecutionLogSchema = z.object({
    id: z.string(),
    conversationId: z.string().optional(),
    toolName: z.string(),
    riskLevel: RiskLevelSchema.optional(),
    decision: PolicyDecisionTypeSchema,
    reason: z.string().optional(),
    trace: z.array(z.unknown()).optional(),
    executed: z.boolean(),
    timestamp: z.date(),
});
//tool execution ka log shape 
//gonna be used by FE dashboard for visual logs, logger, agent  
