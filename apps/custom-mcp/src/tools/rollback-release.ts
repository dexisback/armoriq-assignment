export const rollbackReleaseTool = {
  name: "rollback_release",

  description:
    "Rollback a deployment",

  inputSchema: {
    type: "object",

    properties: {
      serverId: {
        type: "string",
      },

      version: {
        type: "string",
      },
    },

    required: [
      "serverId",
      "version",
    ],
  },

  async execute(args: {
    serverId: string;
    version: string;
  }) {
    return {
      success: true,

      message: `Rollback to ${args.version} on ${args.serverId}`,
    };
  },
};