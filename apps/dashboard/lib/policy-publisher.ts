import {Redis} from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function publishPolicyUpdate() {
    console.log("publishing....")
  await redis.publish("policy:updated", "refresh");
}