import { prisma } from "@armoriq/db";
export async function resolveRisk(toolName, inferredRisk) {
    const override = await prisma.toolRiskOverride.findUnique({
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
