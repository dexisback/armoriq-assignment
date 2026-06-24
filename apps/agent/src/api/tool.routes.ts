//dashboard tools page
import { Router } from "express";

import { prisma } from "@armoriq/db";

export const toolRouter =
  Router();

toolRouter.get(
  "/tools",
  async (_req, res) => {
    const tools =
      await prisma.toolCatalog.findMany({
        orderBy: {
          toolName: "asc",
        },
      });

    res.json(tools);
  }
);
