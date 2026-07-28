import Groq from "groq-sdk";


// ==========================================
// GROQ CONFIG
// ==========================================

export const GROQ_MODEL =
  "llama-3.3-70b-versatile";

let ai = null;


// ==========================================
// GET GROQ CLIENT
// ==========================================

export const getAI = () => {
  if (ai) {
    return ai;
  }


  // ========================================
  // API KEY VALIDATION
  // ========================================

  const apiKey =
    process.env.GROQ_API_KEY;


  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured."
    );
  }


  // ========================================
  // CREATE CLIENT
  // ========================================

  ai = new Groq({
    apiKey,
  });


  return ai;
};


// ==========================================
// GENERATE SIMPLE AI RESPONSE
// ==========================================

// Mainly used for lightweight AI tasks such
// as intent classification.
//
// Admin business responses use getAI()
// directly because they require their own
// model configuration and prompt.

export const generateResponse = async (
  prompt,
  options = {}
) => {
  try {
    // ========================================
    // INPUT VALIDATION
    // ========================================

    if (
      !prompt ||
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      throw new Error(
        "AI prompt cannot be empty."
      );
    }


    // ========================================
    // OPTIONS
    // ========================================

    const {
      temperature = 0,
      maxTokens = 50,
    } = options;


    // ========================================
    // GET CLIENT
    // ========================================

    const groq = getAI();


    // ========================================
    // GENERATE RESPONSE
    // ========================================

    const completion =
      await groq.chat.completions.create({
        model:
          GROQ_MODEL,

        messages: [
          {
            role: "user",
            content:
              prompt.trim(),
          },
        ],

        temperature,

        max_tokens:
          maxTokens,
      });


    // ========================================
    // EXTRACT CONTENT
    // ========================================

    const content =
      completion
        ?.choices?.[0]
        ?.message
        ?.content
        ?.trim();


    if (!content) {
      throw new Error(
        "Groq returned an empty response."
      );
    }


    return content;

  } catch (error) {
    console.error(
      "Groq Service Error:",
      error
    );

    throw new Error(
      "Failed to generate AI response."
    );
  }
};