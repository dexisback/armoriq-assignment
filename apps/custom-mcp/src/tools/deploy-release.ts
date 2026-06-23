export const deployReleaseTool = {
  name: "deploy_release",

  description:
    "Deploy a release to a server",

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

      message: `Version ${args.version} deployed to ${args.serverId}`,
    };
  },
};