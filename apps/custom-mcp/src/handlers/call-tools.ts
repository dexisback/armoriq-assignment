import {
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { tools } from "../tools/index.js";

export function registerCallToolHandler(
  server: any
) {
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: any) => {
      const tool =
        tools.find(
          t =>
            t.name ===
            request.params.name
        );

      if (!tool) {
        throw new Error(
          `Unknown tool: ${request.params.name}`
        );
      }

      const result =
        await tool.execute(
          request.params.arguments ??
            {}
        );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              result,
              null,
              2
            ),
          },
        ],
      };
    }
  );
}