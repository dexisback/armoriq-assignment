export function exceedsBudget(rule, currentTokens) {
    return currentTokens >= rule.maxTokens;
}
//similarly, checks that while the tool is being used, has the budget expired. returns true or false 
