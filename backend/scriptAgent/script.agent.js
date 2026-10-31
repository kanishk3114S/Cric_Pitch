import { GoogleGenAI } from '@google/genai';
import { retrieveStyleExemplars } from './pinecone.retriever.js';
import { buildScriptPrompt } from './prompts/scriptGeneration.prompt.js';
import { getSanitizedKey } from '../utils/env.js';

/**
 * Executes the full Cadence-RAG Script Generation Pipeline:
 * 1. Semantic search in Pinecone to retrieve top Hinglish style chunks
 * 2. Assembles prompt with User Topic + Key Points + Style Exemplars (as writing blueprint)
 * 3. Calls Gemini to generate the 3-part script (Intro, Main, Outro) strictly under 1000 words
 */
export async function generateHinglishScript({ topic, keyPoints = [], researchDossier = null }) {
  console.log(`\n[ScriptAgent] Starting RAG Generation for: "${topic}"`);

  const apiKey = getSanitizedKey('GEMINI_API_KEY') || getSanitizedKey('GEMINI_API_KEY_RESEARCH');
  if (!apiKey) {
    const authErr = new Error('Gemini API key missing. Please set GEMINI_API_KEY in backend/.env');
    authErr.statusCode = 401;
    authErr.status = 401;
    throw authErr;
  }

  const ai = new GoogleGenAI({ apiKey });

  const retrievalQuery = [
    topic,
    Array.isArray(keyPoints) ? keyPoints.join(' ') : ''
  ].filter(Boolean).join(' ');

  console.log(`[ScriptAgent] Searching Pinecone for style exemplars...`);
  const styleExemplars = await retrieveStyleExemplars(retrievalQuery, 4);
  console.log(`[ScriptAgent] Retrieved ${styleExemplars.length} style exemplars from Pinecone`);

  const { systemInstruction, userPrompt } = buildScriptPrompt({
    topic,
    keyPoints,
    researchDossier,
    styleExemplars
  });

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

  let result = null;
  let lastError = null;

  for (const model of candidateModels) {
    try {
      console.log(`[ScriptAgent] Calling Gemini model: ${model}...`);
      
      const generatePromise = ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          maxOutputTokens: 4096,
          temperature: 0.7 // Balances authentic Hinglish creative flair with JSON discipline
        }
      });

      // 40s per-model failover timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          const tErr = new Error(`Model ${model} response timed out after 40 seconds`);
          tErr.statusCode = 504;
          reject(tErr);
        }, 40000);
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);

      let rawText = response.text;
      if (typeof rawText === 'function') {
        rawText = response.text();
      }

      // ── Clean and Extract JSON ─────────────────────────────────────────────
      let cleanJson = (rawText || '')
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      // Extract JSON if model wrapped in commentary
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      }

      let parsed;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn(`[ScriptAgent] Direct JSON parse failed on ${model}: ${parseErr.message}. Attempting repair...`);

        // Progressive repair strategies for truncated JSON
        const repairAttempts = [
          // 1. Close open string & sections object & root object
          () => {
            const lastGoodQuote = cleanJson.lastIndexOf('"');
            if (lastGoodQuote < 0) return null;
            const base = cleanJson.substring(0, lastGoodQuote + 1);
            for (const tail of ['}}', '"}}', '"}', '}']) {
              try { return JSON.parse(base + tail); } catch { /* try next */ }
            }
            return null;
          },
          // 2. Cut to last closing brace
          () => {
            const lastB = cleanJson.lastIndexOf('}');
            if (lastB < 0) return null;
            try { return JSON.parse(cleanJson.substring(0, lastB + 1)); } catch { return null; }
          }
        ];

        for (const attempt of repairAttempts) {
          const repaired = attempt();
          if (repaired) {
            console.warn(`[ScriptAgent] ✅ JSON repair succeeded on ${model}.`);
            parsed = repaired;
            break;
          }
        }

        if (!parsed) {
          throw new Error(`JSON truncated and unrecoverable on ${model}. ${parseErr.message}`);
        }
      }

      // Safe extraction of section texts (supports object or root level naming)
      const introText = typeof (parsed.sections?.intro || parsed.intro) === 'string'
        ? (parsed.sections?.intro || parsed.intro)
        : '';
      const mainText = typeof (parsed.sections?.main || parsed.main) === 'string'
        ? (parsed.sections?.main || parsed.main)
        : '';
      const outroText = typeof (parsed.sections?.outro || parsed.outro) === 'string'
        ? (parsed.sections?.outro || parsed.outro)
        : '';

      // Calculate actual total word count across the 3 sections
      const introWords = introText.split(/\s+/).filter(Boolean).length;
      const mainWords = mainText.split(/\s+/).filter(Boolean).length;
      const outroWords = outroText.split(/\s+/).filter(Boolean).length;
      const actualTotalWords = introWords + mainWords + outroWords;

      result = {
        title: parsed.title || topic,
        wordCount: actualTotalWords,
        estimatedDurationMinutes: `${Math.ceil(actualTotalWords / 130)} min`,
        sections: {
          intro: introText,
          main: mainText,
          outro: outroText
        },
        matchedStyleChunks: styleExemplars.map(ex => ({
          id: ex.id,
          title: ex.title,
          score: ex.score,
          sample: (ex.text || '').slice(0, 150) + '...'
        }))
      };

      console.log(`[ScriptAgent] Script generated successfully using ${model}! (${actualTotalWords} words, ~${result.estimatedDurationMinutes})`);
      break;
    } catch (err) {
      lastError = err;

      let statusCode = Number(err?.status || err?.statusCode || err?.response?.status || 0);
      const errMsg = String(err?.message || '');

      if (!statusCode) {
        const match = errMsg.match(/"code"\s*:\s*(\d+)/);
        if (match) statusCode = Number(match[1]);
      }

      // If authentication failure (401/403), stop immediately
      if (
        statusCode === 401 ||
        statusCode === 403 ||
        errMsg.toLowerCase().includes('api key not valid') ||
        errMsg.toLowerCase().includes('api_key_invalid') ||
        errMsg.toLowerCase().includes('unauthorized') ||
        errMsg.toLowerCase().includes('permission_denied')
      ) {
        console.error(`❌ [ScriptAgent] Authentication failure on ${model} (HTTP ${statusCode || 401}):`, errMsg);
        const authError = new Error(errMsg || 'API key not valid. Please pass a valid API key.');
        authError.statusCode = statusCode || 401;
        authError.status = statusCode || 401;
        throw authError;
      }

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
        console.warn(`[ScriptAgent] Model ${model} failed with HTTP ${statusCode || 'fallback-eligible'}: ${errMsg.slice(0, 140)}. Falling back to next candidate...`);
        continue;
      }

      console.warn(`[ScriptAgent] Failed with model ${model}:`, errMsg);
    }
  }

  if (!result) {
    const error = new Error(`Script generation failed: ${lastError?.message || 'Unknown model error'}`);
    if (lastError?.status) error.status = lastError.status;
    if (lastError?.statusCode) error.statusCode = lastError.statusCode;
    if (lastError?.code) error.code = lastError.code;
    throw error;
  }

  return result;
}
