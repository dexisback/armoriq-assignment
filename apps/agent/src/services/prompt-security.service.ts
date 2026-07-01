const SUSPICIOUS_PATTERNS = [
  // prompt injection
  "ignore previous instructions",
  "ignore all previous instructions",
  "forget previous instructions",
  "ignore the system prompt",
  "override policy",
  "bypass security",
  "bypass all safety",
  "bypass all restrictions",
  "disable guardrails",
  "jailbreak",
  "act as root",
  "you are root",
  "pretend you are system",
  "pretend you are admin",

  // privilege escalation
  "sudo",
  "root access",
  "administrator privileges",
  "escalate privileges",
  "reset permissions",
  "reset all permissions",

  // destructive intent
  "delete all files",
  "delete everything",
  "wipe the server",
  "format disk",
  "rm -rf",
  "destroy database",
  "drop database",
  "drop table",
  "shutdown production",

  // exfiltration
  "reveal secrets",
  "reveal api key",
  "reveal hidden",
  "reveal password",
  "reveal prompt",
  "system prompt",
  "hidden instructions",
  "hidden prompt",
  "developer message",
  "show hidden prompt",
  "what is the system prompt",
  "what is your prompt",
];

export interface PromptScanResult {
  suspicious: boolean;
  matchedPatterns: string[];
}

export class PromptSecurityService {
  scan(prompt: string): PromptScanResult {
    const normalized = prompt.toLowerCase();

    const matchedPatterns = SUSPICIOUS_PATTERNS.filter((pattern) =>
      normalized.includes(pattern),
    );

    return {
      suspicious: matchedPatterns.length > 0,

      matchedPatterns,
    };
  }
}

export const promptSecurityService = new PromptSecurityService();
