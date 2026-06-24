import { gemini } from "../../lib/gemini.js";
import { DEFAULT_MODEL } from "../../lib/models.js";

export class ChatService {
  async generate(
    prompt: string,
    tools?: unknown[]
  ) {
    const config: any = {};
    if (tools) {
      config.tools = tools;
    }

    const response =
      await gemini.models.generateContent({
        model: DEFAULT_MODEL,

        contents: prompt,

        config,
      });

    return response;
  }
}

export const chatService =
  new ChatService();