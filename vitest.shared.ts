import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    name: "armoriq",
    globals: false,
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".next", ".turbo", "coverage"],
    reporters: ["default"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/**/*.d.ts",
        "src/tests/**",
        "src/**/index.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@armoriq/db": new URL("./packages/db/src/index.ts", import.meta.url).pathname,
      "@armoriq/logger": new URL("./packages/logger/src/index.ts", import.meta.url).pathname,
      "@armoriq/mcp-registry": new URL("./packages/mcp-registry/src/index.ts", import.meta.url).pathname,
      "@armoriq/policy-engine": new URL("./packages/policy-engine/src/index.ts", import.meta.url).pathname,
      "@armoriq/shared-types": new URL("./packages/shared-types/src/index.ts", import.meta.url).pathname,
    },
  },
});
