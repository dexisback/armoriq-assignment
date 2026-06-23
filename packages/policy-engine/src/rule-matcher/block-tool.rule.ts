import type { BlockToolRule, PolicyRequest } from '@armoriq/shared-types';

export function matchesBlockToolRule(
  rule: BlockToolRule,
  request: PolicyRequest
) {
  return rule.toolName === request.toolName;
}