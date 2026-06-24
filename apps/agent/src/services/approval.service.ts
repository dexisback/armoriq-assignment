import { prisma } from "@armoriq/db";

export class ApprovalService {
  async create(
    toolName: string,
    payload: Record<string, unknown>
  ) {
    return prisma.approval.create({
      data: {
        toolName,
        arguments: payload as any,
        status: "PENDING",
      },
    });
  }

  async approve(id: string) {
    return prisma.approval.update({
      where: { id },

      data: {
        status: "APPROVED",
      },
    });
  }

  async reject(id: string) {
    return prisma.approval.update({
      where: { id },

      data: {
        status: "REJECTED",
      },
    });
  }

  async getPending() {
    return prisma.approval.findMany({
      where: {
        status: "PENDING",
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const approvalService =
  new ApprovalService();



//this creates approval requests (approve, reject, fetch pending approvals)

