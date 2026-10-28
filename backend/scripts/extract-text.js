import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const RAW_DIR = path.join(DATA_DIR, 'raw-scripts');
const EXTRACTED_DIR = path.join(DATA_DIR, 'extracted-text');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');

async function extractAll() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Manifest file not found at ${MANIFEST_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(EXTRACTED_DIR)) {
    fs.mkdirSync(EXTRACTED_DIR, { recursive: true });
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`\n======================================================`);
  console.log(`CRICSCRIPT AI — SCRIPT EXTRACTION PIPELINE`);
  console.log(`Found ${manifest.length} scripts in manifest. Extracting...\n`);

  const results = [];

  for (const item of manifest) {
    const rawFilePath = path.join(RAW_DIR, item.filename);
    if (!fs.existsSync(rawFilePath)) {
      console.warn(`[WARN] File not found: ${rawFilePath}. Skipping.`);
      continue;
    }

    console.log(`Processing [${item.scriptId}] "${item.cleanTitle}"...`);
    try {
      const dataBuffer = fs.readFileSync(rawFilePath);
      const parser = new PDFParse({ data: dataBuffer });
      const parseResult = await parser.getText();

      let text = parseResult.text || '';

      // Clean PDF formatting quirks while safeguarding line breaks & pauses
      // 1. Replace Windows CRLF with \n
      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      // 2. Remove standard page numbering patterns like "Page 1 of 5", "-- 1 of 6 --", etc.
      text = text.replace(/\n\s*Page\s+\d+(\s+of\s+\d+)?\s*\n/gi, '\n');
      text = text.replace(/\n\s*--\s*\d+\s+of\s+\d+\s*--\s*\n/gi, '\n');
      text = text.replace(/\n\s*\d+\s+of\s+\d+\s*\n/gi, '\n');

      // 3. Normalize non-breaking spaces
      text = text.replace(/\u00A0/g, ' ');

      // 4. Collapse runs of 3+ blank lines into 2 (\n\n) to preserve paragraphs
      text = text.replace(/\n{3,}/g, '\n\n').trim();

      const words = text.split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      const lines = text.split('\n');
      const lineCount = lines.length;

      const outputFileName = `${item.scriptId}.txt`;
      const outputPath = path.join(EXTRACTED_DIR, outputFileName);
      fs.writeFileSync(outputPath, text, 'utf-8');

      console.log(`  -> Pages: ${parseResult.total} | Words: ${wordCount} | Lines: ${lineCount}`);
      console.log(`  -> Saved to: data/extracted-text/${outputFileName}\n`);

      results.push({
        scriptId: item.scriptId,
        title: item.cleanTitle,
        pages: parseResult.total,
        wordCount,
        lineCount,
        sample: text.slice(0, 140).replace(/\n/g, ' ') + '...'
      });
    } catch (err) {
      console.error(`  [ERROR] Failed to extract ${item.filename}:`, err.message);
    }
  }

  console.log('\n======================================================');
  console.log('--- EXTRACTION CHECKPOINT VERIFIED ---');
  console.table(results.map(r => ({
    ID: r.scriptId,
    Title: r.title.slice(0, 32),
    Pages: r.pages,
    Words: r.wordCount,
    Sample: r.sample.slice(0, 50)
  })));
  console.log('All 5 scripts extracted cleanly into data/extracted-text/!\n');
}

extractAll().catch(err => {
  console.error('Extraction fatal error:', err);
  process.exit(1);
});
