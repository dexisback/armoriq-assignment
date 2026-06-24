import { Redis } from "ioredis";

const publisher = new Redis(
  process.env.REDIS_URL!
);

export async function redisPublisher() {
  console.log("Publishing rule update event to Redis channel 'policy:updated'...");
  const subscribersCount = await publisher.publish(
    "policy:updated",
    JSON.stringify({
      event: "RULES_REFRESH",
    })
  );
  console.log(`Successfully published event to ${subscribersCount} subscriber(s).`);
}