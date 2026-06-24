import "dotenv/config";

import { bootstrap } from "./bootstrap/index.js";
import { createServer } from "./api/server.js";

async function main() {
  await bootstrap();

  const app =
    createServer();

  app.listen(
    3000,
    () => {
      console.log(
        "Agent listening on :3000"
      );
    }
  );
}

main().catch(console.error);