// gemini.ts

import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({
  path: "../../.env",
});

export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});


