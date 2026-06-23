import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { registerCallToolHandler } from "./handlers/call-tools.js";
import { registerListToolsHandler } from "./handlers/list-tools.js";
export const server = new Server({
    name: "infrastructure-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
registerListToolsHandler(server);
registerCallToolHandler(server);
