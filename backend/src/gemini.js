import { GoogleGenerativeAI } from "@google/generative-ai";

export function getModel() {
  const key = (process.env.GEMINI_API_KEY || "").trim().replace(/^['"]|['"]$/g, "");
  if (!key.startsWith("AIza")) throw new Error("Missing/invalid GEMINI_API_KEY");
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}