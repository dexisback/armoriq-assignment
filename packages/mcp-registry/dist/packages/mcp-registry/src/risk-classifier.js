export function inferRisk(toolName, description) {
    const text = `${toolName} ${description}`
        .toLowerCase();
    if (/(delete|destroy|terminate|shutdown|rollback)/.test(text)) {
        return "CRITICAL";
    }
    if (/(restart|deploy|write|update|modify|create)/.test(text)) {
        return "HIGH";
    }
    if (/(read|get|search|list|find|resolve)/.test(text)) {
        return "LOW";
    }
    return "MEDIUM";
}
