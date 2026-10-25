// researchAgent/llm/gemini.client.js
// A simple wrapper around the Google Gemini API.
// We keep this in its own file so if we ever swap to Groq or another LLM,
// we only change THIS file — nothing else in the project breaks.

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Sends a prompt to Gemini and asks for a strict JSON response.
 *
 * @param {string} systemPrompt  - Instructions that define the AI's role
 * @param {string} userMessage   - The actual content/question for the AI
 * @returns {object} - Parsed JSON object from the model's response
 */
export const callGemini = async (systemPrompt, userMessage) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userMessage,
    config: {
      systemInstruction: systemPrompt,
      // Ask Gemini to return strict JSON — no markdown, no code fences, just JSON
      responseMimeType: 'application/json',
      // Keep the response focused and not too large
      maxOutputTokens: 2048,
      temperature: 0.3, // Lower = more factual, less creative
    },
  });

  const rawText = response.text();

  try {
    return JSON.parse(rawText);
  } catch {
    // If parsing fails, throw a useful error
    throw new Error(`Gemini returned invalid JSON:\n${rawText.substring(0, 300)}`);
  }
};
