import { z } from "zod";
import { RiskLevelSchema } from "./rules.js";
export const ToolMetadataSchema = z.object({
    name: z.string(),
    description: z.string(),
    serverId: z.string(),
    riskLevel: RiskLevelSchema,
});
export const ToolCallRequestSchema = z.object({
    toolName: z.string(),
    args: z.record(z.string(), z.unknown()),
});
export const ToolCallResultSchema = z.object({
    success: z.boolean(),
    content: z.unknown(),
    error: z.string().optional(),
});
export const ToolRiskClassificationSchema = z.object({
    toolName: z.string(),
    inferredRisk: RiskLevelSchema,
    finalRisk: RiskLevelSchema,
    overridden: z.boolean(),
});
//defines discovered MCP tools ki metadata
//used by mcp-registery(ofcourse), agent and FE dashboard
export const ToolCatalogEntrySchema = z.object({
    toolName: z.string(),
    description: z.string(),
    serverId: z.string(),
    inferredRisk: RiskLevelSchema,
    finalRisk: RiskLevelSchema,
});
