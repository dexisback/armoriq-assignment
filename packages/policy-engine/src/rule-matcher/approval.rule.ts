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

//checks if the tool gonna be used require approval , if it does then it returns true/false
