import { Redis } from "ioredis";

let client: Redis | null = null;

export function getRedis(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: 3,
      connectTimeout: 2000,
      lazyConnect: true,
    });
  }
  return client;
}
