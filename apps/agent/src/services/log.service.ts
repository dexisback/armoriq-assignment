//TODO: build later, for audit Logs

//single place for writing audit events
import { prisma } from "@armoriq/db";

interface CreateLogInput {
  toolName: string;

  decision: string;

  reason?: string;

  matchedRule?: string;

  approvalId?: string;

  trace?: unknown;

  executed?: boolean;
}

export class LogService {
  async create(
    input: CreateLogInput
  ) {
    return prisma.toolExecutionLog.create({
      data: {
        toolName: input.toolName,

        decision: input.decision,

        reason: input.reason,

        matchedRule:
          input.matchedRule,

        approvalId:
          input.approvalId,

        trace:
          input.trace ?? [],

        executed:
          input.executed ??
          false,
      },
    });
  }
}

export const logService =
  new LogService();
  