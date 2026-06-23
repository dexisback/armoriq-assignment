import { Redis } from "ioredis";

import { loadRules } from "./rule-loader.service.js";

const subscriber = new Redis(
  process.env.REDIS_URL!
);

export async function startPolicySubscriber() {
  await subscriber.subscribe(
    "policy:updated"
  );

  subscriber.on(
    "message",
    async channel => {
      if (
        channel !== "policy:updated"
      ) {
        return;
      }

      await loadRules();
    }
  );
}


