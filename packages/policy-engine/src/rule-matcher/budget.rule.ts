import type { BudgetRule } from "@armoriq/shared-types";

export function exceedsBudget(
  rule: BudgetRule,
  currentTokens: number
) {
  return currentTokens >= rule.maxTokens;
}