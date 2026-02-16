
import { GoogleGenAI, Type } from "@google/genai";
import { KeyStats } from "../types";

export async function generateAdaptiveDrill(weakKeys: string[], keyStats: Record<string, KeyStats>): Promise<string> {
  // Use process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Generate a short typing drill (approx 15-20 words) that specifically focuses on these weak keys: ${weakKeys.join(', ')}. 
  The drill should feel like natural English but use these keys frequently. 
  Context on errors: ${JSON.stringify(keyStats)}. 
  Make it readable and helpful for muscle memory.`;

  try {
    // Using gemini-3-flash-preview for basic text task as recommended.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });

    // Access .text property directly (not a method).
    return response.text?.trim() || "Practice makes perfect. Keep typing to improve your speed and accuracy.";
  } catch (error) {
    console.error("Gemini Drill Generation Error:", error);
    return "Error generating custom drill. Please try again or use standard practice.";
  }
}
