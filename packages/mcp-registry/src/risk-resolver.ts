//this checks db override (which a dashboard would do in future) , otherwise use the auto inferred risk
import { prisma } from "@armoriq/db";

import { inferRisk } from "./risk-classifier.js";

export async function resolveRisk(
  toolName: string,
  description: string
) {
  const override =
    await prisma.toolRiskOverride.findUnique(
      {
        where: {
          toolName,
        },
      }
    );

  const inferredRisk =
    inferRisk(
      toolName,
      description
    );

  if (!override) {
    return {
      inferredRisk,
      finalRisk:
        inferredRisk,
      overridden: false,
    };
  }

  return {
    inferredRisk,
    finalRisk:
      override.riskLevel,
    overridden: true,
  };
}
