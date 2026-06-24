//change models being used directly from here, suppose flash -> something else

//TODO: later add fallback models asw, like gaspy

// change models here

export const MODELS = {
  GEMINI: "gemini-2.5-flash",
  GROQ: "llama-3.3-70b-versatile",
} as const;

export const DEFAULT_PROVIDER = "gemini";

export const FALLBACK_PROVIDER = "groq";





