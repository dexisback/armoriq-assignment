import { discoverTools } from "./discover-tools.js";
import { loadRules } from "./load-rules.js";
import { startPolicySubscriber } from "../services/redis-subscriber.service.js";
export async function bootstrap() {
  await loadRules();

  await discoverTools();
  console.log("before policy subscriber start")
  await startPolicySubscriber();
    console.log("after policy subscriber start")

}