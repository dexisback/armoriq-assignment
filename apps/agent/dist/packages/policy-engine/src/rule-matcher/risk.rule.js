export function matchesRiskRule(rule, riskLevel) {
    if (!riskLevel) {
        return false;
    }
    return rule.riskLevel === riskLevel;
}
//checks does the tool risk level match teh rule risk level
//so like for a successful (true) we need HIGH==HIGH
