// researchAgent/tools/webSearch.tool.js
// This tool hits the Tavily Search API to get real, fresh web results.
// Tavily is built specifically for AI agents — it returns clean markdown
// snippets instead of raw messy HTML.

import axios from 'axios';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_URL = 'https://api.tavily.com/search';

/**
 * Search the web for cricket information.
 *
 * @param {string} query   - The search query (e.g. "Kohli 2019 WC form before tournament")
 * @param {boolean} includeImages - Whether to fetch image URLs in results
 * @param {number} maxResults - How many results to return (we keep it low to save tokens)
 * @returns {object} { results: [...], images: [...] }
 */
export const webSearchTool = async (query, includeImages = false, maxResults = 5) => {
  try {
    console.log(`  🔍 [webSearch] Querying: "${query}"`);

    const response = await axios.post(
      TAVILY_URL,
      {
        api_key: TAVILY_API_KEY,
        query,
        search_depth: 'advanced',   // 'basic' is faster but less thorough
        include_images: includeImages,
        max_results: maxResults,
        include_answer: true,       // Tavily also gives a direct AI answer summary
      },
      { timeout: 15000 }            // 15 second timeout
    );

    const data = response.data;

    return {
      answer: data.answer || '',           // Tavily's own short AI answer
      results: (data.results || []).map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.content,               // Clean markdown summary of the page
      })),
      images: includeImages ? (data.images || []) : [],
    };

  } catch (error) {
    // If Tavily fails (e.g. rate limit), we return empty — agent handles it gracefully
    console.warn(`  ⚠️ [webSearch] Failed for "${query}": ${error.message}`);
    return { answer: '', results: [], images: [] };
  }
};
