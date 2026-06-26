import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

const localEnvPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(localEnvPath)) {
  dotenv.config({
    path: localEnvPath,
  });
} else {
  dotenv.config();
}
async function main() {
  const { prisma } = await import("@armoriq/db");
  await prisma.rule.createMany({
    data: [
      {
        name: "Block Dangerous Commands",
        type: "BLOCK_TOOL",
        priority: 1,
        enabled: true,
        config: {
          type: "BLOCK_TOOL",
          toolNames: [
            "delete_server",
          ],
        },
      },

      {
        name: "Approval For Restarts",
        type: "REQUIRE_APPROVAL",
        priority: 10,
        enabled: true,
        config: {
          type: "REQUIRE_APPROVAL",
          toolNames: [
            "restart_server",
          ],
        },
      },
    ],
  });

  console.log(
    "Seed complete"
  );
}

main().catch(console.error);