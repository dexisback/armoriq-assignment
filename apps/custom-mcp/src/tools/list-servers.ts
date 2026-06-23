import { SERVERS } from "../data/mock-data.js";

export const listServersTool = {
  name: "list_servers",

  description:
    "List all infrastructure servers",

  inputSchema: {
    type: "object",
    properties: {},
  },

  async execute() {
    return SERVERS;
  },
};