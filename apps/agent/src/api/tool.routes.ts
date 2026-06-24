//dashboard tools page
import { Router } from "express";

import { prisma } from "@armoriq/db";


//for adding dynamic reloads when a new tool is added:
import {registry } from "@armoriq/mcp-registry"
import { MCP_SERVERS } from "../config/mcp-servers.js";
import { toolCatalogService } from "../services/tool-catalog.service.js";




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


toolRouter.post(
  "/tools/refresh",
  async (_req, res) => {
    for (const server of MCP_SERVERS) {
      await registry.refreshServer(
        server.id
      );
    }
    
    await toolCatalogService.sync(
      registry.getTools()
    );

    return res.json({
      success: true,

      tools:
        registry.getTools()
          .length,
    });
  }
);