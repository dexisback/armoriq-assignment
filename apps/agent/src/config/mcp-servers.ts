//single global source of truth for mcp servers
//registry bootstraps from here 


import type {
  MCPServerConfig,
} from "@armoriq/shared-types";

export const MCP_SERVERS: MCPServerConfig[] =
  [
    {
      id: "infra-mcp",

      name:
        "Infrastructure MCP",

      transport: "stdio",

      command: "node",

      args: [
        "../custom-mcp/dist/index.js",
      ],
    },

    {
      id: "context7",

      name: "Context7",

      transport: "sse",

      url: process.env
        .CONTEXT7_MCP_URL!,
    },
  ];