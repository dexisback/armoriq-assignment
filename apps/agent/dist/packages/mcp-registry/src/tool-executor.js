import { SSEClientTransport, } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport, } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
export async function executeTool(server, request) {
    const client = new Client({
        name: "armoriq-agent",
        version: "1.0.0",
    });
    try {
        if (server.transport === "stdio") {
            const transport = new StdioClientTransport({
                command: server.command,
                args: server.args ?? [],
            });
            await client.connect(transport);
        }
        else {
            const transport = new SSEClientTransport(new URL(server.url));
            await client.connect(transport);
        }
        const result = await client.callTool({
            name: request.toolName,
            arguments: request.args,
        });
        return {
            success: true,
            content: result.content,
        };
    }
    catch (error) {
        return {
            success: false,
            content: null,
            error: error instanceof Error
                ? error.message
                : "Unknown MCP error",
        };
    }
}
