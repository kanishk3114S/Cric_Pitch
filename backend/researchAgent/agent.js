// researchAgent/agent.js
// ─────────────────────────────────────────────────────────────────────────────
// THE RESEARCH AGENT — The orchestrator. This is where all pieces connect.
//
// HOW AN AGENT WORKS (vs a basic LLM call):
//   Basic LLM call: You → Gemini → Answer. Done.
//   Agent:          You → Agent Plans → Picks Tools → Runs Tools → 
//                   Collects Results → Feeds to LLM → Validates Output → Done.
//
// This agent's job:
//   1. Look at the topic + user focus points
//   2. Decide what searches to run (multi-hop: general + stats + quotes + conditions)
//   3. Execute those searches in parallel (faster!)
//   4. Feed all the raw results to Gemini with strict grounding instructions
//   5. Return a clean, validated ResearchDossier JSON
// ─────────────────────────────────────────────────────────────────────────────

import { toolRegistry } from './tools/toolRegistry.js';
import { callGemini } from './llm/gemini.client.js';
import {
  buildResearchSynthesizerPrompt,
  buildResearchUserMessage,
} from './prompts/researchSynthesizer.prompt.js';

/**
 * Main entry point for the Research Agent.
 *
 * @param {object} options
 * @param {string}   options.topic           - e.g. "2019 World Cup Final Overthrow Incident"
 * @param {string[]} options.preContext       - User's 4-5 focus angles
 * @param {number}   options.researchLength  - Max words (1-1000)
 * @param {boolean}  options.includeMedia    - Fetch image links or not
 *
 * @returns {object} ResearchDossier JSON
 */
export const runResearchAgent = async ({ topic, preContext, researchLength, includeMedia }) => {

  console.log('\n🤖 Research Agent starting...');
  console.log(`   Topic: "${topic}"`);
  console.log(`   Max words: ${researchLength} | Media: ${includeMedia}`);

  // ── STEP 1: PLAN ─────────────────────────────────────────────────────────
  // The agent doesn't just run one search. It runs multiple targeted searches
  // based on the topic. We build a list of "search jobs" to execute.
  //
  // Think of this as the agent's research plan before hitting the library.

  const searchJobs = buildSearchPlan(topic, preContext, includeMedia);
  console.log(`\n📋 Search plan: ${searchJobs.length} queries planned`);


  // ── STEP 2: EXECUTE TOOLS (in parallel) ───────────────────────────────────
  // We run ALL search jobs at the same time using Promise.all — much faster
  // than running them one by one.
  //
  // Each job calls the appropriate tool from our toolRegistry.

  const rawResults = await Promise.all(
    searchJobs.map(async (job) => {
      const toolFn = toolRegistry[job.tool];

      if (!toolFn) {
        console.warn(`  ⚠️ Unknown tool: ${job.tool}`);
        return { query: job.query, results: [], images: [] };
      }

      // Call the tool with its arguments
      const result = await toolFn(...job.args);

      return {
        query: job.query,           // Label for the synthesizer prompt
        results: result.results || [],
        images: result.images || [],
      };
    })
  );

  // Filter out empty results (failed searches)
  const validResults = rawResults.filter(r => r.results.length > 0);
  console.log(`\n✅ Got results from ${validResults.length}/${searchJobs.length} searches`);

  // Collect all images across searches (only if includeMedia is on)
  const allImages = includeMedia
    ? rawResults
        .flatMap(r => r.images || [])
        .filter(img => img && img.url)
        // Deduplicate images by URL
        .filter((img, idx, arr) => arr.findIndex(i => i.url === img.url) === idx)
        .slice(0, 6)
    : [];

  // ── STEP 3: SYNTHESIZE WITH LLM ─────────────────────────────────────────
  // Now we feed ALL the raw search results to Gemini and ask it to compile
  // a structured, factual Dossier JSON. No hallucination — strict grounding.

  console.log('\n🧠 Sending to Gemini for synthesis...');

  const systemPrompt = buildResearchSynthesizerPrompt(researchLength, includeMedia);
  const userMessage = buildResearchUserMessage(topic, preContext, validResults, allImages);

  const dossier = await callGemini(systemPrompt, userMessage);


  // ── STEP 4: ENRICH & RETURN ───────────────────────────────────────────────
  // Add metadata the LLM doesn't set (timestamps, image collection)

  dossier.generatedAt = new Date().toISOString();
  dossier.topic = topic;
  dossier.includeMedia = Boolean(includeMedia);

  if (includeMedia && allImages.length > 0) {
    dossier.collectedImages = allImages;
  }

  console.log('\n🏏 Dossier compiled successfully!\n');

  return dossier;
};


// ─────────────────────────────────────────────────────────────────────────────
// HELPER: buildSearchPlan
// Decides WHAT to search and WHICH tool to use for each query.
// This is the "brain" of the agent's planning phase.
// ─────────────────────────────────────────────────────────────────────────────

const buildSearchPlan = (topic, preContext, includeImages) => {
  const jobs = [];

  // Job 1: General topic overview search (includes images if requested)
  jobs.push({
    tool: 'webSearch',
    query: `${topic} cricket`,
    args: [`${topic} cricket overview match report`, includeImages, 5],
  });

  // Job 1b (optional): Dedicated high-res action photo search when media toggle is ON
  if (includeImages) {
    jobs.push({
      tool: 'webSearch',
      query: `${topic} match photos action moments`,
      args: [`${topic} cricket match action moments photography`, true, 4],
    });
  }

  // Job 2: Stats search via cricinfo/HowStat
  jobs.push({
    tool: 'webSearch',
    query: `${topic} statistics scorecard`,
    args: [`${topic} cricket statistics scorecard site:espncricinfo.com`, false, 4],
  });

  // Job 3: Player quotes and press conference
  jobs.push({
    tool: 'webSearch',
    query: `${topic} player quotes press conference reactions`,
    args: [`${topic} player quotes interview press conference statement`, false, 4],
  });

  // Job 4: Tactical / pitch / conditions angle
  jobs.push({
    tool: 'webSearch',
    query: `${topic} pitch conditions tactics analysis`,
    args: [`${topic} pitch report conditions tactical analysis`, false, 3],
  });

  // Job 5 (dynamic): If user gave focus points, run a targeted search for each
  // We limit to first 2 preContext items to keep token usage in check
  const safePreContext = Array.isArray(preContext) ? preContext : [];
  safePreContext.slice(0, 2).forEach((focusPoint, i) => {
    jobs.push({
      tool: 'webSearch',
      query: `User focus: ${focusPoint}`,
      args: [`${topic} ${focusPoint}`, false, 3],
    });
  });

  return jobs;
};
