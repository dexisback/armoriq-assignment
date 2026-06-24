//approval api:
import { Router } from "express";

import { approvalService } from "../services/approval.service.js";

export const approvalRouter =
  Router();

approvalRouter.get(
  "/approvals",
  async (_req, res) => {
    const approvals =
      await approvalService.getPending();

    res.json(approvals);
  }
);

approvalRouter.post(
  "/approvals/:id/approve",
  async (req, res) => {
    const approval =
      await approvalService.approve(
        req.params.id
      );

    res.json(approval);
  }
);

approvalRouter.post(
  "/approvals/:id/reject",
  async (req, res) => {
    const approval =
      await approvalService.reject(
        req.params.id
      );

    res.json(approval);
  }
);
