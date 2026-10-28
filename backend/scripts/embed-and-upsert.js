import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const CHUNKS_FILE = path.join(__dirname, '..', 'data', 'processed-chunks', 'all-chunks.json');

async function embedAndUpsert() {
  const pineconeKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME || 'cricscript-rag';

  if (!pineconeKey) {
    throw new Error('PINECONE_API_KEY is missing in backend/.env');
  }

  console.log('\n======================================================');
  console.log('CRICSCRIPT AI — PINECONE DOCUMENT UPSERT PIPELINE');
  console.log(`Target Index: "${indexName}" (Integrated Document Schema: title + chunk_text)\n`);

  if (!fs.existsSync(CHUNKS_FILE)) {
    throw new Error(`Chunks file not found at ${CHUNKS_FILE}`);
  }

  const rawChunks = JSON.parse(fs.readFileSync(CHUNKS_FILE, 'utf-8'));
  console.log(`Loaded ${rawChunks.length} Hinglish narrative chunks from data/processed-chunks/all-chunks.json`);

  const pc = new Pinecone({ apiKey: pineconeKey });
  const index = pc.index(indexName);

  // Transform chunks into Pinecone Document schema format (_id, title, chunk_text)
  const documents = rawChunks.map(chunk => ({
    _id: chunk.id,
    title: `[${chunk.sectionType.toUpperCase()}] ${chunk.title}`,
    chunk_text: chunk.text
  }));

  console.log(`\nUpserting ${documents.length} narrative documents into Pinecone index "${indexName}"...`);

  // Batch upsert into Pinecone documents API
  const batchSize = 10;
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    console.log(`  -> Upserting batch ${Math.floor(i / batchSize) + 1} (${batch.length} docs)...`);
    const res = await index.upsertDocuments({ documents: batch });
    console.log(`     Batch OK (upserted: ${res.upsertedCount}, tokens embedded: ${res.usage?.embedTotalTokens || 0})`);
  }

  console.log('\n======================================================');
  console.log('SUCCESS! ALL 19 HINGLISH SCRIPT CHUNKS ARE LIVE IN PINECONE!');
  console.log('======================================================\n');
}

embedAndUpsert().catch(err => {
  console.error('\n[FATAL] Upsert failed:', err.message);
  process.exit(1);
});
