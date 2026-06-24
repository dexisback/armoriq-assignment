import { gemini } from "../lib/gemini.js";
import { DEFAULT_MODEL } from "../lib/models.js";

export class ChatService {
  async chat(
    message: string
  ) {
    const response =
      await gemini.models.generateContent({
        model: DEFAULT_MODEL,
        contents: message,
      });

    return response.text;
  }
}

export const chatService =
  new ChatService();
