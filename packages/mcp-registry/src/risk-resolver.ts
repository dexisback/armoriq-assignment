import type {
  RiskLevel,
  ToolRiskClassification,
} from "@armoriq/shared-types";

import { prisma } from "@armoriq/db";

export async function resolveRisk(
  toolName: string,
  inferredRisk: RiskLevel
): Promise<ToolRiskClassification> {
  const override =
    await prisma.toolRiskOverride.findUnique({
      where: {
        toolName,
      },
    });

  if (!override) {
    return {
      toolName,

      inferredRisk,

      finalRisk: inferredRisk,

      overridden: false,
    };
  }

  return {
    toolName,

    inferredRisk,

    finalRisk: override.riskLevel,

    overridden: true,
  };
}