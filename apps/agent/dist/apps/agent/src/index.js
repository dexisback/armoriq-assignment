import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../../.env");
console.log("Loading .env from absolute path:", envPath);
const dotenvResult = dotenv.config({ path: envPath });
console.log("Dotenv load result:", dotenvResult);
console.log("CONTEXT7_MCP_URL is:", process.env.CONTEXT7_MCP_URL);
const { bootstrap } = await import("./bootstrap/index.js");
const { createServer } = await import("./api/server.js");
async function main() {
    await bootstrap();
    const app = createServer();
    app.listen(3000, () => {
        console.log("Agent listening on :3000");
    });
}
main().catch(console.error);
