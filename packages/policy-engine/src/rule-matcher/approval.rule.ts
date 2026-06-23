import type {
  ApprovalRule,
  PolicyRequest,
} from "@armoriq/shared-types";

export function matchesApprovalRule(
  rule: ApprovalRule,
  request: PolicyRequest
) {
  return rule.toolName === request.toolName;
}