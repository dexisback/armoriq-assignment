import { discoverTools } from "./discover-tools.js";
import { loadRules } from "./load-rules.js";
export async function bootstrap() {
    await loadRules();
    await discoverTools();
}
