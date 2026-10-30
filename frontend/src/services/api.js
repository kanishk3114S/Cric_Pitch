// src/services/api.js
// All API calls to our backend live here.
// Normalizes and preserves backend error messages and diagnostic classifications.

import axios from 'axios';

// Resolves backend API URL:
// 1. If VITE_API_BASE_URL is provided (e.g. cross-domain deployment), use that.
// 2. Otherwise defaults to relative '/api/v1' (unified single-service deployment on Render or Vite proxy).
const rawApiBase = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = rawApiBase
  ? `${rawApiBase.replace(/\/$/, '')}/api/v1`
  : '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2-minute generous timeout for deep LLM synthesis
});

function classifyFallbackErrorType(statusCode, message = '') {
  const lower = message.toLowerCase();
  if (
    statusCode === 429 && (
      lower.includes('quota') ||
      lower.includes('resource_exhausted') ||
      lower.includes('credit') ||
      lower.includes('exhausted') ||
      lower.includes('billing')
    ) ||
    lower.includes('quota exceeded') ||
    lower.includes('free-tier')
  ) {
    return 'QUOTA_EXHAUSTED';
  }
  if (statusCode === 429 || lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'RATE_LIMITED';
  }
  if (statusCode === 401 || statusCode === 403 || lower.includes('api key') || lower.includes('unauthorized')) {
    return 'AUTH_FAILURE';
  }
  if (statusCode === 408 || statusCode === 504 || lower.includes('timed out') || lower.includes('timeout')) {
    return 'TIMEOUT';
  }
  if (statusCode === 400 || lower.includes('required') || lower.includes('invalid')) {
    return 'VALIDATION_ERROR';
  }
  return 'SERVER_ERROR';
}

function getFallbackActionHint(errorType, _statusCode) {
  switch (errorType) {
    case 'QUOTA_EXHAUSTED':
      return 'Google AI Studio quota or free-tier credits exhausted. Upgrade quota or change GEMINI_API_KEY in backend/.env.';
    case 'RATE_LIMITED':
      return 'AI model request rate limit reached. Please wait 20-30 seconds, then retry.';
    case 'AUTH_FAILURE':
      return 'AI provider authentication failed. Check GEMINI_API_KEY or TAVILY_API_KEY in backend/.env.';
    case 'TIMEOUT':
      return 'Connection or generation timed out. Verify your internet connection and try again.';
    case 'VALIDATION_ERROR':
      return 'Check the required topic input and ensure parameters are valid before submitting.';
    default:
      return 'An unexpected issue occurred on the server. You can retry the operation.';
  }
}

export function normalizeApiError(error) {
  if (error.response?.data) {
    const data = error.response.data;
    const statusCode = error.response.status || data.statusCode || 500;
    const rawMessage = data.error || data.message || error.message || 'Server error';
    const errorType = data.errorType || classifyFallbackErrorType(statusCode, rawMessage);
    const retryable = data.retryable !== undefined ? data.retryable : (errorType !== 'QUOTA_EXHAUSTED' && errorType !== 'AUTH_FAILURE' && errorType !== 'VALIDATION_ERROR');
    const actionHint = data.actionHint || getFallbackActionHint(errorType, statusCode);

    const norm = new Error(rawMessage);
    norm.name = 'ApiError';
    norm.statusCode = statusCode;
    norm.errorType = errorType;
    norm.retryable = retryable;
    norm.actionHint = actionHint;
    norm.originalError = error;
    return norm;
  }

  // Network / Connection Refused
  if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
    const norm = new Error('Cannot connect to CricPitch backend server (http://localhost:5000).');
    norm.name = 'NetworkError';
    norm.statusCode = 503;
    norm.errorType = 'SERVER_ERROR';
    norm.retryable = true;
    norm.actionHint = 'Make sure the Express backend server is running ("npm run dev" in the backend directory).';
    norm.originalError = error;
    return norm;
  }

  // Client Timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    const norm = new Error('The generation request timed out after 120 seconds.');
    norm.name = 'TimeoutError';
    norm.statusCode = 504;
    norm.errorType = 'TIMEOUT';
    norm.retryable = true;
    norm.actionHint = 'The AI model took too long to complete. Please try retrying or simplifying the prompt.';
    norm.originalError = error;
    return norm;
  }

  const norm = new Error(error.message || 'An unexpected client error occurred.');
  norm.name = 'ApiError';
  norm.statusCode = 500;
  norm.errorType = 'SERVER_ERROR';
  norm.retryable = true;
  norm.actionHint = 'Please try again.';
  norm.originalError = error;
  return norm;
}

// ── Research API calls ─────────────────────────────────────────────────────

/**
 * Calls the Cricket Research Agent and returns a compiled dossier.
 */
export const generateResearch = async (payload) => {
  try {
    return await api.post('/research/generate', payload);
  } catch (err) {
    throw normalizeApiError(err);
  }
};

/**
 * Downloads the dossier as a PDF.
 */
export const exportToPDF = async (dossier) => {
  try {
    return await api.post('/research/export-pdf', { dossier }, { responseType: 'blob' });
  } catch (err) {
    throw normalizeApiError(err);
  }
};

// ── Script Studio API calls ────────────────────────────────────────────────

/**
 * Calls the Script Studio to generate a 3-part Hinglish voiceover script.
 */
export const generateScript = async (payload) => {
  try {
    return await api.post('/scripts/generate', payload);
  } catch (err) {
    throw normalizeApiError(err);
  }
};

export default api;
