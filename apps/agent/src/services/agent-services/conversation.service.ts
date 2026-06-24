//stores conversation history 
export class ConversationService {
  private messages: unknown[] =
    [];

  add(message: unknown) {
    this.messages.push(
      message
    );
  }

  getMessages() {
    return this.messages;
  }

  clear() {
    this.messages = [];
  }
}

export const conversationService =
  new ConversationService();