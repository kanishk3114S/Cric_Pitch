// src/services/api.js
// All API calls to our backend live here. 
// If the backend URL ever changes, we only update this one file.

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({ baseURL: BASE_URL });

// ── Research API calls ─────────────────────────────────────────────────────

/**
 * Calls the Cricket Research Agent and returns a compiled dossier.
 *
 * @param {object} payload
 * @param {string}   payload.topic           - Research topic
 * @param {string[]} payload.preContext       - User's focus points array
 * @param {number}   payload.researchLength  - Word limit (1-1000)
 * @param {boolean}  payload.includeMedia    - Toggle for images/links
 */
export const generateResearch = (payload) =>
  api.post('/research/generate', payload);

/**
 * Downloads the dossier as a PDF.
 * Uses responseType: 'blob' so Axios gives us the raw binary data
 * that we can turn into a browser download link.
 *
 * @param {object} dossier - The dossier JSON returned from generateResearch
 */
export const exportToPDF = (dossier) =>
  api.post('/research/export-pdf', { dossier }, { responseType: 'blob' });

// ── Script Studio API calls ────────────────────────────────────────────────

/**
 * Calls the Script Studio to generate a 3-part Hinglish voiceover script.
 *
 * @param {object} payload
 * @param {string} payload.topic - The documentary topic
 * @param {string[]} payload.keyPoints - Key narrative beats & angles
 * @param {object} [payload.researchDossier] - Optional Engine 01 dossier
 */
export const generateScript = (payload) =>
  api.post('/scripts/generate', payload);

