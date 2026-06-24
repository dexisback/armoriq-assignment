import { prisma } from "@armoriq/db"
import { ruleCache } from "./rule-cache.service.js";

export async function loadRules() {
  const dbRules =
    await prisma.rule.findMany({
      where: {
        enabled: true,
      },
    });

  const rules = dbRules.map(
    rule => ({
      ...(rule.config as any),
      name: rule.name,
      description: rule.description,
    })
  );

  ruleCache.setRules(
    rules as never
  );
  console.log(`Loaded ${rules.length} active rule(s) into policy engine cache.`);
}
