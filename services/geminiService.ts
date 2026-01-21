
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { GEMINI_MODEL } from '../constants';

// Add Type from @google/genai for responseSchema
export { Type };

interface GeminiConfig {
  systemInstruction?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  responseMimeType?: string; // Added for structured output
  responseSchema?: {
    type: Type;
    properties?: { [key: string]: { type: Type; description?: string } };
    items?: { type: Type; properties?: { [key: string]: { type: Type; description?: string }; }; propertyOrdering?: string[]; };
    propertyOrdering?: string[];
    description?: string;
  }; // Added for structured output
}

export const generateGeminiContent = async (
  prompt: string,
  config?: GeminiConfig
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set. Please ensure it's configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        ...config,
        // The effective token limit for the response is `maxOutputTokens` minus the `thinkingBudget`.
        // If maxOutputTokens is set, thinkingBudget should also be set to reserve tokens for final output.
        // If maxOutputTokens is not provided by the caller, do not set thinkingConfig.
        ...(config?.maxOutputTokens ? { thinkingConfig: { thinkingBudget: Math.floor(config.maxOutputTokens / 2) } } : {}),
      },
    });

    return response.text ?? 'No response text received from Gemini.';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to get response from Gemini: ${error.message}`);
    } else {
        throw new Error("An unknown error occurred while calling Gemini API.");
    }
  }
};