import { prisma } from "@armoriq/db";

import { ruleCache } from "../services/rule-cache.service.js";

export async function loadRules() {
  const rules =
    await prisma.rule.findMany({
      where: {
        enabled: true,
      },

      orderBy: {
        priority: "asc",
      },
    });

  ruleCache.setRules(
    rules.map(
      rule => rule.config
    ) as never
  );
}

