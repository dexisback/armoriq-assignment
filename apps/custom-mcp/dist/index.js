import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";
export { tools } from "./tools/index.js";
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch(error => {
    console.error(error);
    process.exit(1);
});
