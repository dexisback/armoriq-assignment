//this responds when registery asks "what tools do you have"
import { ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { tools } from "../tools/index.js";
export function registerListToolsHandler(server) {
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: tools.map((tool) => ({
                name: tool.name,
                description: tool.description,
                inputSchema: tool.inputSchema,
            })),
        };
    });
}
