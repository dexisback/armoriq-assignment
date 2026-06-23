export const RULE_PRIORITY = {
  BLOCK_TOOL: 1,
  INPUT_VALIDATION: 2,
  BUDGET_LIMIT: 3,
  RISK_BASED: 4,
  REQUIRE_APPROVAL: 5,
} as const;


//this is where we freeze the evaulation heirarhcy