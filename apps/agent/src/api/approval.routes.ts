//approval api:
import { Router } from "express";
import { approvalExecutionService } from "../services/approval-execution.service.js";
import { approvalService } from "../services/approval.service.js";
import { logService } from "../services/log.service.js";

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

// approvalRouter.post(
//   "/approvals/:id/approve",
//   async (req, res) => {
//     const approval =
//       await approvalService.approve(
//         req.params.id
//       );

//     res.json(approval);
//   }
// );
approvalRouter.post(
  "/approvals/:id/approve",
  async (req, res) => {
    const approval =
      await approvalService.approve(
        req.params.id
      );

    const result =
      await approvalExecutionService.execute(
        approval.id
      );

      //audit logs for approval:
      await logService.create({
        toolName: approval.toolName,
        decision: "ALLOW",
        eventType: "APPROVAL_APPROVED",
        arguments: approval.arguments as any,
        approvalId: approval.id,
        executed: true
      })


    return res.json({
      approval,
      result,
    });
  }
);
approvalRouter.post(
  "/approvals/:id/reject",
  async (req, res) => {
    const approval =
      await approvalService.reject(
        req.params.id
      );

      //approval rejection logs:
      await logService.create({
        toolName: approval.toolName,
        decision: "DENY",
        eventType: "APPROVAL_REJECTED",
        arguments: approval.arguments as any,
        approvalId: approval.id,
      })

    res.json(approval);
  }
);
