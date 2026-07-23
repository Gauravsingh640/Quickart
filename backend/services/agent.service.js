import { getAI } from "./groq.service.js";
import { toolDefinitions } from "../tools/toolDefinitions.js";
import { analyticsTools } from "../tools/analytics.tools.js";

const groq = getAI();

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

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  return completion.choices[0].message.content.trim();
};

export const executeTool = async (question) => {
  const toolName = await decideTool(question);

  console.log("Selected Tool:", toolName);

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
};