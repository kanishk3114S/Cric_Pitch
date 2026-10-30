import { GoogleGenAI } from '@google/genai';
import { retrieveStyleExemplars } from './pinecone.retriever.js';
import { buildScriptPrompt } from './prompts/scriptGeneration.prompt.js';

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_RESEARCH;
  if (!apiKey) {
    throw new Error('Gemini API key missing. Please set GEMINI_API_KEY or GEMINI_API_KEY_RESEARCH in backend/.env');
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Executes the full Cadence-RAG Script Generation Pipeline:
 * 1. Semantic search in Pinecone to retrieve top Hinglish style chunks
 * 2. Assembles prompt with User Topic + Key Points + Style Exemplars (as writing blueprint)
 * 3. Calls Gemini to generate the 3-part script (Intro, Main, Outro) strictly under 1000 words
 */
export async function generateHinglishScript({ topic, keyPoints = [], researchDossier = null }) {
  console.log(`\n[ScriptAgent] Starting RAG Generation for: "${topic}"`);

  // Step 1: Formulate search query for Pinecone
  const retrievalQuery = [
    topic,
    Array.isArray(keyPoints) ? keyPoints.join(' ') : ''
  ].filter(Boolean).join(' ');

  console.log(`[ScriptAgent] Searching Pinecone for style exemplars...`);
  const styleExemplars = await retrieveStyleExemplars(retrievalQuery, 4);
  console.log(`[ScriptAgent] Retrieved ${styleExemplars.length} style exemplars from Pinecone`);

  // Step 2: Build Generation Prompt
  const { systemInstruction, userPrompt } = buildScriptPrompt({
    topic,
    keyPoints,
    researchDossier,
    styleExemplars
  });

  // Step 3: Call Gemini with ultra-low latency candidate models
  const ai = getAiClient();
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.1-pro-preview'];
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

      // 35s per-model failover timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Model ${model} response timed out after 35 seconds`)), 35000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      let rawText = response.text;
      if (typeof rawText === 'function') {
        rawText = response.text();
      }

      const cleanJson = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      const parsed = JSON.parse(cleanJson);

      // Calculate actual total word count across the 3 sections
      const introWords = (parsed.sections?.intro || '').split(/\s+/).filter(Boolean).length;
      const mainWords = (parsed.sections?.main || '').split(/\s+/).filter(Boolean).length;
      const outroWords = (parsed.sections?.outro || '').split(/\s+/).filter(Boolean).length;
      const actualTotalWords = introWords + mainWords + outroWords;

      result = {
        title: parsed.title || topic,
        wordCount: actualTotalWords,
        estimatedDurationMinutes: `${Math.ceil(actualTotalWords / 130)} min`,
        sections: {
          intro: parsed.sections?.intro || '',
          main: parsed.sections?.main || '',
          outro: parsed.sections?.outro || ''
        },
        matchedStyleChunks: styleExemplars.map(ex => ({
          id: ex.id,
          title: ex.title,
          score: ex.score,
          sample: ex.text.slice(0, 150) + '...'
        }))
      };

      console.log(`[ScriptAgent] Script generated successfully! (${actualTotalWords} words, ~${result.estimatedDurationMinutes})`);
      break;
    } catch (err) {
      console.warn(`[ScriptAgent] Failed with model ${model}:`, err.message);
      lastError = err;
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
