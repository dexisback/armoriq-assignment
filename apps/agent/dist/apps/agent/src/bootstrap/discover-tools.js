//this connects all mcp servers. populates the mcp registry
import { registry } from "@armoriq/mcp-registry";
import { MCP_SERVERS } from "../config/mcp-servers.js";
export async function discoverTools() {
    for (const server of MCP_SERVERS) {
        if (server.transport === "sse" && !server.url) {
            console.warn(`Skipping SSE MCP server "${server.name}" (not configured).`);
            continue;
        }
        await registry.registerServer(server);
    }
}
