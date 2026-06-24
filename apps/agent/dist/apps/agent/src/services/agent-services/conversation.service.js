//stores conversation history 
export class ConversationService {
    messages = [];
    add(message) {
        this.messages.push(message);
    }
    getMessages() {
        return this.messages;
    }
    clear() {
        this.messages = [];
    }
}
export const conversationService = new ConversationService();
