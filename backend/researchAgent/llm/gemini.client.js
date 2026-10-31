// researchAgent/llm/gemini.client.js
// A simple wrapper around the Google Gemini API.
// We keep this in its own file so if we ever swap to Groq or another LLM,
// we only change THIS file — nothing else in the project breaks.

import { GoogleGenAI } from '@google/genai';

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_RESEARCH;
  if (!apiKey) {
    throw new Error('Gemini API key missing. Please set GEMINI_API_KEY or GEMINI_API_KEY_RESEARCH in backend/.env');
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Sends a prompt to Gemini and asks for a strict JSON response.
 *
 * @param {string} systemPrompt  - Instructions that define the AI's role
 * @param {string} userMessage   - The actual content/question for the AI
 * @returns {object} - Parsed JSON object from the model's response
 */
export const callGemini = async (systemPrompt, userMessage) => {
  const ai = getAiClient();
  // Fast, reliable models on current Google API (ordered by verified latency & availability)
  const candidateModels = [
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-latest'
  ];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          maxOutputTokens: 8192, // Generous limit prevents premature JSON truncation
          temperature: 0.2,      // Low temperature for crisp, factual consistency
        },
      });

      let rawText = response.text;
      if (typeof rawText === 'function') {
        rawText = response.text();
      }

      // Strip markdown code fences if present (e.g. ```json ... ```)
      const cleanJson = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      // ── JSON Parse with Repair Fallback ──────────────────────────────────
      // Gemini sometimes truncates mid-JSON when the input context is large
      // (many search snippets × long text = big prompt → less output budget).
      // We try a progressive repair strategy before giving up entirely.
      let parsed;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn(`  ⚠️ JSON parse failed on ${model}: ${parseErr.message}. Attempting repair...`);

        // Strategy 1: Find the last cleanly-terminated field boundary (ending with `"}`)
        // and try to close the JSON from there.
        const repairAttempts = [
          // Close as: root object → synthesizedReport → arrays closed
          () => {
            const lastGoodBrace = cleanJson.lastIndexOf('"}');
            if (lastGoodBrace < 0) return null;
            // Trim to that boundary and try three common tail patterns
            const base = cleanJson.substring(0, lastGoodBrace + 2);
            for (const tail of [']}}}', ']}', '}']) {
              try { return JSON.parse(base + tail); } catch { /* try next */ }
            }
            return null;
          },
          // Strategy 2: Find last complete `}` and close
          () => {
            const lastBrace = cleanJson.lastIndexOf('}');
            if (lastBrace < 0) return null;
            try { return JSON.parse(cleanJson.substring(0, lastBrace + 1)); } catch { return null; }
          },
        ];

        for (const attempt of repairAttempts) {
          const result = attempt();
          if (result) {
            console.warn(`  ✅ JSON repair succeeded on ${model}.`);
            parsed = result;
            break;
          }
        }

        if (!parsed) {
          // All repairs failed — throw so the model loop tries the next candidate
          throw new Error(
            `JSON truncated and unrecoverable on ${model}. ` +
            `Preview: ${cleanJson.substring(0, 200)}`
          );
        }
      }

      return parsed;
    } catch (err) {
      console.warn(`  ⚠️ Model ${model} failed: ${err.message}. Trying next model...`);
      lastError = err;
    }
  }

  const error = new Error(`Research synthesis failed: ${lastError?.message || 'Unknown model error'}`);
  if (lastError?.status) error.status = lastError.status;
  if (lastError?.statusCode) error.statusCode = lastError.statusCode;
  if (lastError?.code) error.code = lastError.code;
  throw error;
};
