export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export type ApprovalRequest = {
  id: string;

  toolName: string;

  arguments: Record<string, unknown>;

  status: ApprovalStatus;

  requestedAt: Date;

  resolvedAt?: Date;

  resolutionReason?: string;
};