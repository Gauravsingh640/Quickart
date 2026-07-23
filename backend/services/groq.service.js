import Groq from "groq-sdk";

let ai = null;

export function getAI() {
  if (!ai) {
    ai = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return ai;
}

export const generateResponse = async (prompt) => {
  try {
    const groq = getAI();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to generate AI response.");
  }
};