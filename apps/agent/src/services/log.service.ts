//TODO: build later, for audit Logs

//single place for writing audit events
import { prisma } from "@armoriq/db";
interface CreateLogInput {
  toolName: string;

  decision: any;

  arguments?: Record<string, unknown>;

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

        arguments: (input.arguments ?? {}) as any,

        reason: input.reason ?? null,

        trace: {
          ...(typeof input.trace === "object" && input.trace ? (input.trace as any) : {}),
          matchedRule: input.matchedRule,
          approvalId: input.approvalId,
        } as any,

        executed:
          input.executed ??
          false,
      },
    });
  }
}

export const logService =
  new LogService();
  