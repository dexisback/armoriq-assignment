import { z } from "zod";
import { RiskLevelSchema } from "./rules.js";
export const MCPServerConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    transport: z.enum([
        "stdio",
        "sse",
    ]),
    command: z.string().optional(),
    args: z
        .array(z.string())
        .optional(),
    url: z.string().optional(),
});
export const DiscoveredToolSchema = z.object({
    name: z.string(),
    description: z.string(),
    serverId: z.string(),
    inputSchema: z.unknown(),
    riskLevel: RiskLevelSchema,
});
export const ToolExecutionRequestSchema = z.object({
    toolName: z.string(),
    args: z.record(z.string(), z.unknown()),
});
export const ToolExecutionResponseSchema = z.object({
    success: z.boolean(),
    content: z.unknown(),
    error: z.string().optional(),
});
//types for mcp. gonna be used by mcp-registery, agent, custom-mcp
//shared types is accessed by agent, registery and custom-mcp. so this would deffo be a good addition
