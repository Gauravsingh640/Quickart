import { getAI } from "./gemini.service.js";
import { toolDefinitions } from "../tools/toolDefinitions.js";
import { analyticsTools } from "../tools/analytics.tools.js";
const ai=getAI();
export const decideTool = async (question) => {
  const prompt = `
You are an AI Router.

Available tools:

${JSON.stringify(toolDefinitions, null, 2)}

User Question:

${question}

Return ONLY the tool name.

Example:

overview

topProducts

lowStock

monthlySales
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      temperature: 0,
    },
  });

  return response.text.trim();
};

export const executeTool = async (question) => {
  // Step 1: Decide tool
  const toolName = await decideTool(question);

  console.log("Selected Tool:", toolName);

  // Step 2: Execute tool
  const tool = analyticsTools[toolName];

  if (!tool) {
    throw new Error(`Tool '${toolName}' not found.`);
  }

  const data = await tool();

  return {
    toolName,
    data,
  };
};

export const generateAgentResponse = async (question) => {
  const { toolName, data } = await executeTool(question);

  const prompt = `
You are an AI Sales Assistant.

User Question:
${question}

Tool Used:
${toolName}

Tool Output:
${JSON.stringify(data, null, 2)}

Answer the user's question professionally.
Only use the tool output.
Do not make up any information.
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      temperature: 0.3,
    },
  });

  return response.text;
};