import express from "express";
import cors from "cors";
import { approvalRouter } from "./approval.routes.js";
import { chatRouter } from "./chat.routes.js";
import { healthRouter } from "../health/health.route.js";
import { logRouter } from "./log.routes.js";
import { toolRouter } from "./tool.routes.js";

export function createServer() {
  const app = express();

  app.use(cors());

  app.use(
    express.json()
  );

  app.use(chatRouter);

  app.use(healthRouter);
  app.use(approvalRouter)
  app.use(logRouter)
  app.use(toolRouter)
  return app;
}