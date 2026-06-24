//dashboard logs endpoint 
import { Router } from "express";

import { prisma } from "@armoriq/db";

export const logRouter =
  Router();

logRouter.get(
  "/logs",
  async (_req, res) => {
    const logs =
      await prisma.toolExecutionLog.findMany({
        orderBy: {
          createdAt:
            "desc",
        },

        take: 100,
      });

    res.json(logs);
  }
);
