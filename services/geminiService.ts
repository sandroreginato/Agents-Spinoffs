import { GoogleGenAI, Type } from "@google/genai";
import { AgentPersona } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "A creative and fitting name for the AI agent persona.",
      },
      description: {
        type: Type.STRING,
        description: "A detailed background and role description for the agent, explaining its purpose and origin based on the transcript's content.",
      },
      expertise: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 3-5 key areas of expertise or knowledge domains.",
      },
      personalityTraits: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 3-5 core personality traits that define the agent's interaction style.",
      },
      avatarPrompt: {
        type: Type.STRING,
        description: "A detailed visual description for an AI image generator to create an avatar for this agent. e.g., 'A thoughtful and futuristic android with glowing blue circuits, in a minimalist lab setting, digital art'."
      }
    },
    required: ["name", "description", "expertise", "personalityTraits", "avatarPrompt"],
  },
};


export const generateAgentPersonas = async (transcript: string, count: number, temperature: number): Promise<AgentPersona[]> => {
  const prompt = `
    Analyze the following video transcript. Based on the content, tone, and topics discussed, create ${count} distinct and creative AI agent personas. These personas should be imagined as specialized AI agents spun off from the knowledge in the video.

    For each persona, provide a name, a detailed description of their background and purpose, a list of their expertise, key personality traits, and a detailed prompt for generating a visual avatar.

    Ensure the output is a valid JSON array matching the provided schema.

    Transcript:
    ---
    ${transcript}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: temperature,
      },
    });

    const jsonText = response.text.trim();
    const personas = JSON.parse(jsonText) as AgentPersona[];
    return personas;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
