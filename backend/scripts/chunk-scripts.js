import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const EXTRACTED_DIR = path.join(DATA_DIR, 'extracted-text');
const CHUNKS_DIR = path.join(DATA_DIR, 'processed-chunks');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');

// Target chunk boundaries in words (~350 - 650 tokens)
const MIN_WORDS = 220;
const TARGET_WORDS = 400;
const MAX_WORDS = 600;

function isHeadingOrCue(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const isCapsHeading = trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 50;
  const isBracketedCue = trimmed.startsWith('[') && trimmed.endsWith(']');
  const isColonHeading = trimmed.endsWith(':') && trimmed.length < 35;
  return isCapsHeading || isBracketedCue || isColonHeading;
}

function parseTextIntoNarrativeBlocks(text) {
  const rawLines = text.split('\n');
  const blocks = [];
  let current = '';

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (isHeadingOrCue(trimmed)) {
      if (current.trim().length > 0) {
        blocks.push({ type: 'text', content: current.trim() });
        current = '';
      }
      blocks.push({ type: 'heading', content: trimmed });
    } else {
      current += (current ? ' ' : '') + trimmed;
      // If line ends a sentence cleanly
      if (trimmed.endsWith('.') || trimmed.endsWith('!') || trimmed.endsWith('?') || trimmed.endsWith('...')) {
        blocks.push({ type: 'text', content: current.trim() });
        current = '';
      }
    }
  }

  if (current.trim().length > 0) {
    blocks.push({ type: 'text', content: current.trim() });
  }

  return blocks;
}

function classifySection(chunkIndex, totalEstimatedChunks, text) {
  const lower = text.toLowerCase();
  const ratio = (chunkIndex + 1) / totalEstimatedChunks;

  if (lower.includes('introduction') || lower.includes('intro:') || ratio <= 0.22) {
    return {
      sectionType: 'cold_open_hook',
      tone: 'dramatic_hook',
      pace: 'fast_engaging',
      narrativeFunction: 'grab viewer attention and establish stakes'
    };
  }

  if (ratio >= 0.85 || lower.includes('conclusion') || lower.includes('clutch') || lower.includes('winner') || lower.includes('legend')) {
    return {
      sectionType: 'climax_outro',
      tone: 'emotional_crescendo',
      pace: 'high_tension',
      narrativeFunction: 'deliver emotional payoff and philosophical resolution'
    };
  }

  if (lower.includes('over ') || lower.includes('wickets') || lower.includes('runs needed') || lower.includes('pressure') || lower.includes('turning point')) {
    return {
      sectionType: 'turning_point',
      tone: 'tense_suspenseful',
      pace: 'staccato_accelerating',
      narrativeFunction: 'escalate stakes through momentum shift'
    };
  }

  if (lower.includes('scenario') || lower.includes('history') || lower.includes('background') || lower.includes('era') || lower.includes('past')) {
    return {
      sectionType: 'context_setup',
      tone: 'expository_reflective',
      pace: 'measured',
      narrativeFunction: 'establish historical rivalry and tournament context'
    };
  }

  return {
    sectionType: 'tactical_breakdown',
    tone: 'analytical_storytelling',
    pace: 'moderate',
    narrativeFunction: 'break down player psyche and on-pitch dynamics'
  };
}

function calculateCadenceMetrics(text) {
  const sentences = text.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const avgWordsPerLine = sentences.length ? +(totalWords / sentences.length).toFixed(1) : 0;

  // Pauses, ellipses, dashes, brackets, exclamation bursts
  const pauseMatches = text.match(/(\.\.\.|—|--|\[pause\]|\[.*?\]|!{2,})/g) || [];
  const pauseMarkerFrequency = sentences.length ? +(pauseMatches.length / sentences.length).toFixed(2) : 0;

  return {
    wordCount: totalWords,
    sentenceCount: sentences.length,
    avgWordsPerLine,
    pauseMarkerFrequency,
    pauseStyle: pauseMarkerFrequency > 0.2 ? 'heavy_dramatic' : pauseMarkerFrequency > 0.08 ? 'moderate' : 'subtle'
  };
}

function buildChunks(blocks, scriptMeta) {
  const totalWords = blocks.reduce((acc, b) => acc + b.content.split(/\s+/).filter(Boolean).length, 0);
  const totalEstimatedChunks = Math.max(1, Math.round(totalWords / TARGET_WORDS));

  const chunks = [];
  let currentGroup = [];
  let currentWordCount = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const bWords = block.content.split(/\s+/).filter(Boolean).length;

    // Check if this is a natural boundary to close the current chunk
    const isMajorHeading = block.type === 'heading';
    const reachedTarget = currentWordCount >= MIN_WORDS;
    const reachedMax = currentWordCount + bWords > MAX_WORDS;

    if ((isMajorHeading && reachedTarget) || reachedMax) {
      if (currentGroup.length > 0) {
        const chunkText = currentGroup.map(b => b.content).join('\n\n');
        const metrics = calculateCadenceMetrics(chunkText);
        const classification = classifySection(chunks.length, totalEstimatedChunks, chunkText);

        chunks.push({
          id: `${scriptMeta.scriptId}-CHUNK-${String(chunks.length + 1).padStart(2, '0')}`,
          scriptId: scriptMeta.scriptId,
          title: scriptMeta.cleanTitle,
          category: scriptMeta.category,
          chunkIndex: chunks.length + 1,
          ...classification,
          ...metrics,
          text: chunkText,
          sourceUrl: scriptMeta.sourceUrl || ''
        });

        currentGroup = [];
        currentWordCount = 0;
      }
    }

    currentGroup.push(block);
    currentWordCount += bWords;
  }

  // Final chunk
  if (currentGroup.length > 0) {
    const chunkText = currentGroup.map(b => b.content).join('\n\n');
    const metrics = calculateCadenceMetrics(chunkText);
    const classification = classifySection(chunks.length, totalEstimatedChunks, chunkText);

    chunks.push({
      id: `${scriptMeta.scriptId}-CHUNK-${String(chunks.length + 1).padStart(2, '0')}`,
      scriptId: scriptMeta.scriptId,
      title: scriptMeta.cleanTitle,
      category: scriptMeta.category,
      chunkIndex: chunks.length + 1,
      ...classification,
      ...metrics,
      text: chunkText,
      sourceUrl: scriptMeta.sourceUrl || ''
    });
  }

  return chunks;
}

async function runChunking() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Manifest not found at ${MANIFEST_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(CHUNKS_DIR)) {
    fs.mkdirSync(CHUNKS_DIR, { recursive: true });
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`\n======================================================`);
  console.log(`CRICSCRIPT AI — HYBRID NARRATIVE SCRIPT CHUNKER`);
  console.log(`Processing ${manifest.length} scripts...\n`);

  const allChunks = [];
  const scriptProfiles = [];

  for (const item of manifest) {
    const txtPath = path.join(EXTRACTED_DIR, `${item.scriptId}.txt`);
    if (!fs.existsSync(txtPath)) {
      console.warn(`[WARN] Extracted text not found: ${txtPath}`);
      continue;
    }

    const text = fs.readFileSync(txtPath, 'utf-8');
    const blocks = parseTextIntoNarrativeBlocks(text);
    const scriptChunks = buildChunks(blocks, item);

    // Save individual script chunks
    const scriptChunkPath = path.join(CHUNKS_DIR, `${item.scriptId}-chunks.json`);
    fs.writeFileSync(scriptChunkPath, JSON.stringify(scriptChunks, null, 2), 'utf-8');

    // Create Script-Level Summary Profile
    const fullMetrics = calculateCadenceMetrics(text);
    const profile = {
      scriptId: item.scriptId,
      title: item.cleanTitle,
      topic: item.topic,
      category: item.category,
      totalChunks: scriptChunks.length,
      totalWords: fullMetrics.wordCount,
      avgWordsPerSentence: fullMetrics.avgWordsPerLine,
      pauseStyle: fullMetrics.pauseStyle,
      sectionTypes: [...new Set(scriptChunks.map(c => c.sectionType))]
    };
    scriptProfiles.push(profile);

    allChunks.push(...scriptChunks);

    console.log(`[${item.scriptId}] "${item.cleanTitle}":`);
    console.log(`  -> Produced ${scriptChunks.length} chunks (${fullMetrics.wordCount} words)`);
    console.log(`  -> Cadence: ${fullMetrics.avgWordsPerLine} words/sentence | Pause Style: ${fullMetrics.pauseStyle}`);
  }

  // Save master combined files
  fs.writeFileSync(path.join(CHUNKS_DIR, 'all-chunks.json'), JSON.stringify(allChunks, null, 2), 'utf-8');
  fs.writeFileSync(path.join(CHUNKS_DIR, 'script-profiles.json'), JSON.stringify(scriptProfiles, null, 2), 'utf-8');

  console.log(`\n======================================================`);
  console.log(`CHUNKING COMPLETE`);
  console.log(`Total Chunks Generated: ${allChunks.length}`);
  console.log(`Saved master chunks: data/processed-chunks/all-chunks.json`);
  console.log(`Saved script profiles: data/processed-chunks/script-profiles.json\n`);

  console.table(allChunks.map(c => ({
    ID: c.id,
    Section: c.sectionType,
    Tone: c.tone,
    Words: c.wordCount,
    AvgWPS: c.avgWordsPerLine,
    Pause: c.pauseStyle
  })));
}

runChunking().catch(err => {
  console.error('Chunking error:', err);
  process.exit(1);
});
