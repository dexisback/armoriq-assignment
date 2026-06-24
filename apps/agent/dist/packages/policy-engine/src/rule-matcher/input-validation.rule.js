export function matchesInputValidationRule(rule, request) {
    const path = request.args.path;
    if (typeof path !== "string") {
        return false;
    }
    return path.startsWith(rule.allowedPrefix);
}
