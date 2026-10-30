import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pinecone } from '@pinecone-database/pinecone';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ALL_CHUNKS_PATH = path.join(__dirname, '..', 'data', 'processed-chunks', 'all-chunks.json');

let pineconeIndexInstance = null;

function getPineconeIndex() {
  if (!pineconeIndexInstance) {
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME || 'cricscript-rag';

    if (!apiKey) {
      console.warn('[ScriptRetriever] PINECONE_API_KEY not configured. Will use local style archive fallback.');
      return null;
    }

    const pc = new Pinecone({ apiKey });
    pineconeIndexInstance = pc.index(indexName);
  }
  return pineconeIndexInstance;
}

/**
 * Local fallback retriever: scores local chunks by keyword / term frequency
 * ensuring 100% uptime and resilience even if Pinecone has rate limits or network issues.
 */
function retrieveLocalFallbackExemplars(query = '', topK = 4) {
  try {
    if (!fs.existsSync(ALL_CHUNKS_PATH)) return [];
    const chunks = JSON.parse(fs.readFileSync(ALL_CHUNKS_PATH, 'utf-8'));
    if (!Array.isArray(chunks) || !chunks.length) return [];

    const queryTerms = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);

    if (!queryTerms.length) {
      return chunks.slice(0, topK).map(c => ({
        id: c.id,
        title: c.title || '',
        score: 0.85,
        text: c.text || ''
      }));
    }

    // Score each chunk by term match frequency
    const scored = chunks.map(chunk => {
      const lowerText = (chunk.text + ' ' + (chunk.title || '')).toLowerCase();
      let matchCount = 0;
      for (const term of queryTerms) {
        if (lowerText.includes(term)) {
          matchCount++;
        }
      }
      return {
        id: chunk.id,
        title: chunk.title || '',
        score: matchCount > 0 ? +(matchCount / queryTerms.length).toFixed(3) : 0.1,
        text: chunk.text || ''
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  } catch (err) {
    console.warn('[ScriptRetriever] Local fallback error:', err.message);
    return [];
  }
}

/**
 * Retrieves top-K Hinglish script pattern chunks based on semantic query.
 * First queries cloud style database; seamlessly falls back to local style archive if needed.
 * @param {string} query - The topic and stylistic angle
 * @param {number} topK - Number of style exemplars to retrieve (default: 4)
 */
export async function retrieveStyleExemplars(query, topK = 4) {
  try {
    const index = getPineconeIndex();

    if (index) {
      const response = await index.searchDocuments({
        topK,
        scoreBy: [
          {
            type: 'embed',
            field: 'chunk_text',
            query: query.trim()
          }
        ],
        includeFields: ['*']
      });

      const matches = response.matches || [];
      if (matches.length > 0) {
        return matches.map(m => ({
          id: m._id,
          title: m.title || '',
          score: m._score,
          text: m.chunk_text || ''
        }));
      }
    }

    // Fallback to local tone library chunks if Pinecone returned 0 matches
    console.log('[ScriptRetriever] Using local tone library fallback for style exemplars');
    return retrieveLocalFallbackExemplars(query, topK);
  } catch (err) {
    console.error('[ScriptRetriever] Pinecone retrieval notice:', err.message);
    return retrieveLocalFallbackExemplars(query, topK);
  }
}
