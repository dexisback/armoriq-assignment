import { bootstrap } from "./bootstrap/index.js";

import { toolLoopService } from "./services/agent-services/tool-loop.service.js";

async function main() {
  await bootstrap();

  const response =
    await toolLoopService.run(
      "List all servers"
    );

  console.log(response);
}

main().catch(console.error);