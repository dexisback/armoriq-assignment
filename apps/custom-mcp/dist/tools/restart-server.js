export const restartServerTool = {
    name: "restart_server",
    description: "Restart a server",
    inputSchema: {
        type: "object",
        properties: {
            serverId: {
                type: "string",
            },
        },
        required: ["serverId"],
    },
    async execute(args) {
        return {
            success: true,
            message: `${args.serverId} restarted`,
        };
    },
};
