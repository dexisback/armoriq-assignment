//mandatory health endpoint ritual
// import { Router } from "express";

// export const healthRouter =
//   Router();

// healthRouter.get(
//   "/health",
//   (_req, res) => {
//     res.json({
//       status: "ok",
//       uptime:
//         process.uptime(),
//     });
//   }
// );




import {registry} from "@armoriq/mcp-registry"
import {prisma} from "@armoriq/db"

import { Router } from "express"

export const healthRouter = Router();



healthRouter.get(
  "/health",
  async (_req, res) => {
    let database =
      "healthy";

    try {
      await prisma.$queryRaw`
        SELECT 1
      `;
    } catch {
      database =
        "unhealthy";
    }

    return res.json({
      status: "ok",

      uptime:
        process.uptime(),

      database,

      servers:
        registry.getServers()
          .length,

      tools:
        registry.getTools()
          .length,
    });
  }
);