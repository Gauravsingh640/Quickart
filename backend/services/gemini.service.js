import { GoogleGenAI } from "@google/genai";

let ai=null;

export function getAI() {
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return ai;
}

export const generateResponse = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);

    throw new Error("Failed to generate AI response.");
  }
};