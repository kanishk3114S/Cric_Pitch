// backend/utils/env.js
// Production-safe environment loader and key sanitizer.
// Enforces dotenv override: true to prevent stale parent/shell environment variables.

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env and backend .env with override: true
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

/**
 * Strips quotes, line breaks, and whitespace from environment values.
 */
export function getSanitizedKey(envName) {
  const raw = process.env[envName] || '';
  return raw.replace(/^["']|["']$/g, '').replace(/[\r\n]+/g, '').trim();
}

// Synchronize and clean API keys
const geminiKey = getSanitizedKey('GEMINI_API_KEY') || getSanitizedKey('GEMINI_API_KEY_RESEARCH');
if (geminiKey) {
  process.env.GEMINI_API_KEY = geminiKey;
  process.env.GEMINI_API_KEY_RESEARCH = geminiKey;
  process.env.GOOGLE_API_KEY = geminiKey;
}

const tavilyKey = getSanitizedKey('TAVILY_API_KEY');
if (tavilyKey) {
  process.env.TAVILY_API_KEY = tavilyKey;
}
