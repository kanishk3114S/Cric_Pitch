// researchAgent/llm/gemini.client.js
// Production Gemini LLM client with resilient multi-model fallback chain,
// lazy SDK instantiation, and strict error propagation.

import { GoogleGenAI } from '@google/genai';
import { getSanitizedKey } from '../../utils/env.js';

/**
 * Sends a prompt to Gemini and asks for a strict JSON response.
 *
 * @param {string} systemPrompt  - Instructions that define the AI's role
 * @param {string} userMessage   - The actual content/question for the AI
 * @returns {object} - Parsed JSON object from the model's response
 */
export const callGemini = async (systemPrompt, userMessage) => {
  // Step 2: Lazy SDK initialization inside the function call with sanitized key
  const apiKey = getSanitizedKey('GEMINI_API_KEY') || getSanitizedKey('GEMINI_API_KEY_RESEARCH');
  if (!apiKey) {
    const authErr = new Error('Gemini API key missing. Please set GEMINI_API_KEY in backend/.env');
    authErr.statusCode = 401;
    authErr.status = 401;
    throw authErr;
  }

  const ai = new GoogleGenAI({ apiKey });

  // Step 3: Resilient fallback chain across verified Gemini models
  // Models are tried in sequence; 404 (model deprecated/not found), 429 (quota/rate limit),
  // and 503 (service unavailable) automatically trigger failover to the next working candidate.
  const candidateModels = [
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      console.log(`🧠 [Gemini Research] Dispatching synthesis to model: ${model}...`);

      const generatePromise = ai.models.generateContent({
        model,
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          maxOutputTokens: 8192, // Generous limit prevents premature JSON truncation
          temperature: 0.2,      // Low temperature for crisp, factual consistency
        },
      });

      // 40s per-model failover timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          const timeoutErr = new Error(`Model ${model} timed out after 40 seconds`);
          timeoutErr.statusCode = 504;
          reject(timeoutErr);
        }, 40000);
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);

      let rawText = response.text;
      if (typeof rawText === 'function') {
        rawText = response.text();
      }

      // Strip markdown code fences if present (e.g. ```json ... ```)
      let cleanJson = (rawText || '')
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      // Extract JSON object if wrapped in commentary
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      }

      // ── JSON Parse with Progressive Repair ───────────────────────────────
      let parsed;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn(`  ⚠️ JSON parse failed on ${model}: ${parseErr.message}. Attempting progressive repair...`);

        const repairAttempts = [
          () => {
            const lastGoodBrace = cleanJson.lastIndexOf('"}');
            if (lastGoodBrace < 0) return null;
            const base = cleanJson.substring(0, lastGoodBrace + 2);
            for (const tail of [']}}}', ']}', '}']) {
              try { return JSON.parse(base + tail); } catch { /* try next */ }
            }
            return null;
          },
          () => {
            const lastB = cleanJson.lastIndexOf('}');
            if (lastB < 0) return null;
            try { return JSON.parse(cleanJson.substring(0, lastB + 1)); } catch { return null; }
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
          throw new Error(`JSON unrecoverable on ${model}. Preview: ${cleanJson.substring(0, 150)}`);
        }
      }

      console.log(`✅ [Gemini Research] Synthesis successfully compiled using model: ${model}`);
      return parsed;

    } catch (err) {
      lastError = err;

      let statusCode = Number(err?.status || err?.statusCode || err?.response?.status || 0);
      const errMsg = String(err?.message || '');

      if (!statusCode) {
        const match = errMsg.match(/"code"\s*:\s*(\d+)/);
        if (match) statusCode = Number(match[1]);
      }

      // If authentication or permission failure (401/403), stop immediately — do not loop uselessly
      if (
        statusCode === 401 ||
        statusCode === 403 ||
        errMsg.toLowerCase().includes('api key not valid') ||
        errMsg.toLowerCase().includes('api_key_invalid') ||
        errMsg.toLowerCase().includes('unauthorized') ||
        errMsg.toLowerCase().includes('permission_denied')
      ) {
        console.error(`❌ [Gemini Research] Authentication failure on ${model} (HTTP ${statusCode || 401}):`, errMsg);
        const authError = new Error(errMsg || 'API key not valid. Please pass a valid API key.');
        authError.statusCode = statusCode || 401;
        authError.status = statusCode || 401;
        throw authError;
      }

      // Only fallback to next model on 404 (model not found/deprecated), 429 (quota), or 503 (overloaded) / timeout
      const isFallbackEligible =
        statusCode === 404 ||
        statusCode === 429 ||
        statusCode === 503 ||
        statusCode === 504 ||
        errMsg.includes('404') ||
        errMsg.includes('429') ||
        errMsg.includes('503') ||
        errMsg.includes('NOT_FOUND') ||
        errMsg.includes('RESOURCE_EXHAUSTED') ||
        errMsg.includes('no longer available') ||
        errMsg.includes('timed out');

      if (isFallbackEligible) {
        console.warn(`⚠️ [Gemini Research] Model ${model} failed with HTTP ${statusCode || 'fallback-eligible'}: ${errMsg.slice(0, 140)}. Falling back to next candidate...`);
        continue;
      }

      // Non-fallback unexpected error (e.g. fatal prompt error)
      console.warn(`⚠️ [Gemini Research] Model ${model} encountered error: ${errMsg.slice(0, 140)}. Trying next candidate...`);
    }
  }

  const finalError = new Error(`Research synthesis failed: ${lastError?.message || 'All candidate models failed'}`);
  if (lastError?.status) finalError.status = lastError.status;
  if (lastError?.statusCode) finalError.statusCode = lastError.statusCode;
  if (lastError?.code) finalError.code = lastError.code;
  throw finalError;
};
