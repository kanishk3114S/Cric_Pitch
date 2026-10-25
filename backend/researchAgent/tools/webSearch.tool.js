// researchAgent/tools/webSearch.tool.js
// This tool hits the Tavily Search API to get real, fresh web results.
// Tavily is built specifically for AI agents — it returns clean markdown
// snippets instead of raw messy HTML.

import axios from 'axios';

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
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.warn(`  ⚠️ [webSearch] TAVILY_API_KEY is not set in environment.`);
    return { answer: '', results: [], images: [] };
  }

  try {
    console.log(`  🔍 [webSearch] Querying: "${query}"`);

    const response = await axios.post(
      TAVILY_URL,
      {
        api_key: apiKey,
        query,
        search_depth: 'advanced',
        include_images: includeImages,
        include_image_descriptions: includeImages,
        max_results: maxResults,
        include_answer: true,
      },
      { timeout: 15000 }
    );

    const data = response.data;

    // Normalize image results into clean objects { url, title }
    const normalizedImages = includeImages && Array.isArray(data.images)
      ? data.images
          .map(img => {
            if (typeof img === 'string') {
              return {
                url: img,
                title: 'Archival Match Photograph',
              };
            }
            if (img && typeof img === 'object' && img.url) {
              return {
                url: img.url,
                title: img.title || img.description || 'Archival Match Photograph',
              };
            }
            return null;
          })
          .filter(img => img && typeof img.url === 'string' && img.url.startsWith('http'))
      : [];

    return {
      answer: data.answer || '',
      results: (data.results || []).map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.content,
      })),
      images: normalizedImages,
    };

  } catch (error) {
    console.warn(`  ⚠️ [webSearch] Failed for "${query}": ${error.message}`);
    return { answer: '', results: [], images: [] };
  }
};
