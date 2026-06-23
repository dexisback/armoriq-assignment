import { LOGS } from "../data/mock-data.js";

export const getServerLogsTool = {
  name: "get_server_logs",

  description:
    "Retrieve logs for a server",

  inputSchema: {
    type: "object",

    properties: {
      serverId: {
        type: "string",
      },
    },

    required: ["serverId"],
  },

  async execute(args: {
    serverId: string;
  }) {
    return (
      LOGS[args.serverId] ??
      "No logs found"
    );
  },
};