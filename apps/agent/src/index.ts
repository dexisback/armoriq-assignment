import { chatService } from "./services/chat.service.js";

async function main() {
  const response =
    await chatService.chat(
      "Say hello."
    );

  console.log(response);
}

main().catch(console.error);


