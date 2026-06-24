import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({
    path: "../../.env",
});
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
}
export const gemini = new GoogleGenAI({
    apiKey,
});
