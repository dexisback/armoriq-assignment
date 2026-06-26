import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../../.env");
//dotenv.config();
dotenv.config({ path: envPath });

const { bootstrap } = await import("./bootstrap/index.js");
const { createServer } = await import("./api/server.js");

async function main() {
  await bootstrap();

  const app =
    createServer();

  const port = process.env.PORT || 4000;

  app.listen(
    port,
    () => {
      console.log(
        `Agent listening on :${port}`
      );
    }
  );
}

main().catch(console.error);
