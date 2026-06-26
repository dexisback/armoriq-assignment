import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "./packages/shared-types",
  "./packages/policy-engine",
  "./packages/logger",
  "./packages/db",
  "./packages/mcp-registry",
  "./apps/agent",
  "./apps/custom-mcp",
  "./apps/dashboard",
]);
