import { executeTool } from "./tool-executor.js";
import { discoverTools } from "./discovery.js";
export class MCPRegistry {
    servers = new Map();
    async registerServer(server) {
        const tools = await discoverTools(server);
        this.servers.set(server.id, {
            server,
            tools,
            connected: true,
            lastSyncedAt: new Date(),
        });
    }
    getServers() {
        return Array.from(this.servers.values());
    }
    getTools() {
        return Array.from(this.servers.values()).flatMap(entry => entry.tools);
    }
    getTool(toolName) {
        return this.getTools().find(tool => tool.name === toolName);
    }
    async refreshServer(serverId) {
        const existing = this.servers.get(serverId);
        if (!existing) {
            return;
        }
        const tools = await discoverTools(existing.server);
        existing.tools = tools;
        existing.lastSyncedAt =
            new Date();
        existing.connected = true;
    }
    async executeTool(toolName, args) {
        const tool = this.getTool(toolName);
        if (!tool) {
            throw new Error(`Tool ${toolName} not found`);
        }
        const server = this.servers.get(tool.serverId);
        if (!server) {
            throw new Error(`Server ${tool.serverId} not found`);
        }
        return executeTool(server.server, {
            toolName,
            args,
        });
    }
}
export const registry = new MCPRegistry();
