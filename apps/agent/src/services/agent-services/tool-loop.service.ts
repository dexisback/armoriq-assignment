//core agent file
import {
  policyEngine,
} from "@armoriq/policy-engine";

import { registry } from "@armoriq/mcp-registry";

import { ruleCache } from "../rule-cache.service.js";

import { chatService } from "./chat.service.js";

import { toolAdapterService } from "./tool-adapter.service.js";

export class ToolLoopService {
  async run(
    prompt: string
  ): Promise<string> {
    const discoveredTools =
      registry.getTools();

    const geminiTools =
      toolAdapterService.toGeminiTools(
        discoveredTools
      );

    let response =
      await chatService.generate(
        prompt,
        geminiTools
      );

    while (true) {
      const candidate =
        response.candidates?.[0];

      const parts =
        candidate?.content?.parts ??
        [];

      const toolCall =
        parts.find(
          (part: any) =>
            "functionCall" in part
        );

      if (!toolCall) {
        return (
          response.text ??
          "No response"
        );
      }

      const functionCall =
        toolCall.functionCall;

      if (!functionCall || !functionCall.name) {
        throw new Error("Function call details or name are missing.");
      }

      const tool =
        registry.getTool(
          functionCall.name
        );

      if (!tool) {
        throw new Error(
          `Unknown tool ${functionCall.name}`
        );
      }

      const decision =
        await policyEngine.evaluate(
          {
            conversationId: "default",
            toolName:
              functionCall.name,

            args:
              functionCall.args ??
              {},
          },

          ruleCache.getRules(),

          {
            riskLevel:
              tool.riskLevel,
          }
        );

      if (
        decision.decision !==
        "ALLOW"
      ) {
        return `Tool blocked: ${decision.reason}`;
      }

      const toolResult =
        await registry.executeTool(
          functionCall.name,
          functionCall.args ?? {}
        );

      response =
        await chatService.generate(
          `
Based on the following tool execution result, write a final response to the user. Do NOT call any more tools.

User Prompt: ${prompt}
Tool Result: ${JSON.stringify(toolResult)}
          `,
          geminiTools
        );
    }
  }
}

export const toolLoopService =
  new ToolLoopService();