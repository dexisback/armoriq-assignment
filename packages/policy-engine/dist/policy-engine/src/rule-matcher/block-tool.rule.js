export function matchesBlockToolRule(rule, request) {
    return rule.toolName === request.toolName;
}
//this checks does toolName even match the blocked tool
//returns true/false
