import Groq from "groq-sdk";
import dotenv from "dotenv";

// dotenv.config({
//   path: "../../.env",
// });

const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY or GROK_API_KEY missing");
}

export const groq = new Groq({
  apiKey,
});

