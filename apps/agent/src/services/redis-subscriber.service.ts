import { Redis } from "ioredis";

import { loadRules } from "./rule-loader.service.js";

const subscriber = new Redis(
  process.env.REDIS_URL!
);

export async function startPolicySubscriber() {
  console.log("Subscribing to Redis channel 'policy:updated'...");
  await subscriber.subscribe(
    "policy:updated"
  );
  console.log("Subscribed successfully to 'policy:updated'.");

  subscriber.on(
    "message",
    async (channel, message) => {
      console.log(`Received message on Redis channel '${channel}':`, message);
      if (
        channel !== "policy:updated"
      ) {
        return;
      }

      console.log("Reloading rules from database...");
      await loadRules();
    }
  );
}


