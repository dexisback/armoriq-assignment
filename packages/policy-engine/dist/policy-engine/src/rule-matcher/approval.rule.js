export function matchesApprovalRule(rule, request) {
    return rule.toolName === request.toolName;
}
//checks if the tool gonna be used require approval , if it does then it returns true/false
