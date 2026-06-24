//this connects all mcp servers. populates the mcp registry
import { registry } from "@armoriq/mcp-registry";
import { MCP_SERVERS } from "../config/mcp-servers.js";
export async function discoverTools() {
    for (const server of MCP_SERVERS) {
        await registry.registerServer(server);
    }
}
