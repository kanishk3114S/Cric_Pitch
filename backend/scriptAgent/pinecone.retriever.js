import { Pinecone } from '@pinecone-database/pinecone';

let pineconeIndexInstance = null;

function getPineconeIndex() {
  if (!pineconeIndexInstance) {
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME || 'cricscript-rag';

    if (!apiKey) {
      throw new Error('PINECONE_API_KEY is not configured in environment variables');
    }

    const pc = new Pinecone({ apiKey });
    pineconeIndexInstance = pc.index(indexName);
  }
  return pineconeIndexInstance;
}

/**
 * Retrieves top-K Hinglish script pattern chunks from Pinecone based on semantic query.
 * @param {string} query - The topic and stylistic angle
 * @param {number} topK - Number of style exemplars to retrieve (default: 4)
 */
export async function retrieveStyleExemplars(query, topK = 4) {
  try {
    const index = getPineconeIndex();

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
    return matches.map(m => ({
      id: m._id,
      title: m.title || '',
      score: m._score,
      text: m.chunk_text || ''
    }));
  } catch (err) {
    console.error('[ScriptRetriever] Pinecone retrieval failed:', err.message);
    // Return empty array gracefully so generation doesn't crash if Pinecone is unreachable
    return [];
  }
}
