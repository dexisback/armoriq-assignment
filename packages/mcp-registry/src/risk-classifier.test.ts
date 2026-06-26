import { describe, it, expect } from "vitest";
import { inferRisk } from "./risk-classifier.js";

describe("inferRisk", () => {
  it("classifies destructive verbs as CRITICAL", () => {
    expect(inferRisk("delete_user", "Delete a user")).toBe("CRITICAL");
    expect(inferRisk("destroy_bucket", "Destroy bucket")).toBe("CRITICAL");
    expect(inferRisk("terminate_job", "Terminate a job")).toBe("CRITICAL");
    expect(inferRisk("rollback_release", "Roll back a release")).toBe("CRITICAL");
  });

  it("classifies mutating verbs as HIGH", () => {
    expect(inferRisk("restart_server", "Restart a server")).toBe("HIGH");
    expect(inferRisk("deploy_release", "Deploy a release")).toBe("HIGH");
    expect(inferRisk("write_file", "Write a file")).toBe("HIGH");
    expect(inferRisk("update_record", "Update a record")).toBe("HIGH");
  });

  it("classifies read-only verbs as LOW", () => {
    expect(inferRisk("list_servers", "List all servers")).toBe("LOW");
    expect(inferRisk("get_status", "Get the status")).toBe("LOW");
    expect(inferRisk("search_docs", "Search documentation")).toBe("LOW");
    expect(inferRisk("find_user", "Find a user")).toBe("LOW");
  });

  it("defaults to MEDIUM when no keywords match", () => {
    expect(inferRisk("compute_hash", "Compute a hash")).toBe("MEDIUM");
    expect(inferRisk("analyze_logs", "Analyze logs")).toBe("MEDIUM");
  });

  it("matches keywords in the description as well as the name", () => {
    expect(inferRisk("op", "Permanently delete the database")).toBe("CRITICAL");
    expect(inferRisk("op", "Read the file system")).toBe("LOW");
  });
});
