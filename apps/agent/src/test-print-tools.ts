import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const { bootstrap } = await import("./bootstrap/index.js");
const { registry } = await import("@armoriq/mcp-registry");

await bootstrap();

console.log("REGISTERED TOOLS:");
console.log(JSON.stringify(registry.getTools(), null, 2));
