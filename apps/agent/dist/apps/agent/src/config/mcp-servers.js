//single global source of truth for mcp servers
//registry bootstraps from here 
export const MCP_SERVERS = [
    {
        id: "infra-mcp",
        name: "Infrastructure MCP",
        transport: "stdio",
        command: "node",
        args: [
            "../../custom-mcp/dist/index.js",
        ],
    },
    {
        id: "context7",
        name: "Context7",
        transport: "sse",
        url: process.env
            .CONTEXT7_MCP_URL,
    },
];
