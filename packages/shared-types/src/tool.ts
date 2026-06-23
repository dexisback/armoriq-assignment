import { z } from "zod";
import { RiskLevelSchema } from "./rules.js";

export const ToolMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  serverId: z.string(),
  riskLevel: RiskLevelSchema,
});

export type ToolMetadata = z.infer<
  typeof ToolMetadataSchema
>;

export const ToolCallRequestSchema = z.object({
  toolName: z.string(),
  args: z.record(z.string(), z.unknown()),
});

export type ToolCallRequest = z.infer<
  typeof ToolCallRequestSchema
>;

export const ToolCallResultSchema = z.object({
  success: z.boolean(),
  content: z.unknown(),
  error: z.string().optional(),
});

export type ToolCallResult = z.infer<
  typeof ToolCallResultSchema
>;


//defines discovered MCP tools ki metadata
//used by mcp-registery(ofcourse), agent and FE dashboard

