import {Redis} from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function publishPolicyUpdate() {
  await redis.publish("policy:updated", "refresh");
}