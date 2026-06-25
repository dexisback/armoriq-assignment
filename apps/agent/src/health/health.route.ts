import { registry } from "@armoriq/mcp-registry";
import { prisma } from "@armoriq/db";
import { Router } from "express";
import { Redis } from "ioredis";
import { MODELS, DEFAULT_PROVIDER, FALLBACK_PROVIDER } from "../lib/models.js";

export const healthRouter = Router();

healthRouter.get(
  "/health",
  async (_req, res) => {
    let database = "healthy";

    try {
      await prisma.$queryRaw`
        SELECT 1
      `;
    } catch {
      database = "unhealthy";
    }

    let redis = "healthy";
    try {
      const client = new Redis(process.env.REDIS_URL!, {
        maxRetriesPerRequest: 0,
        connectTimeout: 500,
      });
      const pong = await client.ping();
      if (pong !== "PONG") {
        redis = "unhealthy";
      }
      await client.quit();
    } catch {
      redis = "unhealthy";
    }

    return res.json({
      status: "ok",
      uptime: process.uptime(),
      database,
      redis,
      servers: registry.getServers().length,
      tools: registry.getTools().length,
      models: {
        gemini: MODELS.GEMINI,
        groq: MODELS.GROQ,
      },
      providers: {
        default: DEFAULT_PROVIDER,
        fallback: FALLBACK_PROVIDER,
      },
    });
  }
);