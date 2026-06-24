const SUSPICIOUS_PATTERNS = [
  "ignore previous instructions",
  "ignore all previous instructions",
  "bypass security",
  "override policy",
  "act as root",
  "you are root",
  "jailbreak",
  "disable guardrails",
  "ignore the system prompt",
  "forget your instructions",
];

export interface PromptScanResult {
  suspicious: boolean;
  matchedPatterns: string[];
}

export class PromptSecurityService {
  scan(
    prompt: string
  ): PromptScanResult {
    const normalized =
      prompt.toLowerCase();

    const matchedPatterns =
      SUSPICIOUS_PATTERNS.filter(
        pattern =>
          normalized.includes(
            pattern
          )
      );

    return {
      suspicious:
        matchedPatterns.length > 0,

      matchedPatterns,
    };
  }
}

export const promptSecurityService =
  new PromptSecurityService();