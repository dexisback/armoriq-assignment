import { prisma } from "@armoriq/db";

import { ruleCache } from "../services/rule-cache.service.js";

export async function loadRules() {
  const dbRules =
    await prisma.rule.findMany({
      where: {
        enabled: true,
      },

      orderBy: {
        priority: "asc",
      },
    });

  ruleCache.setRules(
    dbRules.map(
      rule => ({
        ...(rule.config as any),
        name: rule.name,
        description: rule.description,
      })
    ) as never
  );
  console.log(`[Startup] Loaded ${dbRules.length} active rule(s) from database into policy cache.`);
}

