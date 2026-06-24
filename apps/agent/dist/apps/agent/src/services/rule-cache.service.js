export class RuleCacheService {
    rules = [];
    getRules() {
        return this.rules;
    }
    setRules(rules) {
        this.rules = rules;
    }
    clear() {
        this.rules = [];
    }
}
export const ruleCache = new RuleCacheService();
