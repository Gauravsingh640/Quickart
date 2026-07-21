// import { GoogleGenAI } from "@google/genai";

// export const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
// });

import { GoogleGenAI } from "@google/genai";

let ai;

export function getAI() {
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return ai;
}