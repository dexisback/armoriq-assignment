//this connects all mcp servers. populates the mcp registry


import { registry } from "@armoriq/mcp-registry";

import { MCP_SERVERS } from "../config/mcp-servers.js";


import { toolCatalogService }
from "../services/tool-catalog.service.js";

export async function discoverTools() {
//   for (const server of MCP_SERVERS) {
//     if (server.transport === "sse" && !server.url) {
//       console.warn(`Skipping SSE MCP server "${server.name}" (not configured).`);
//       continue;
//     }
//     await registry.registerServer(
//       server
//     );
//   }
for (const server of MCP_SERVERS) {
  await registry.registerServer(
    server
  );
}

await toolCatalogService.sync(
  registry.getTools()
);

}
