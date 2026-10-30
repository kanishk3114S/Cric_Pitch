// middleware/rateLimiter.js
// Provides tiered IP rate limiting for anonymous public API endpoints.
// Protects expensive LLM synthesis, web research, and PDF generation from automated abuse.

import rateLimit from 'express-rate-limit';

const createRateLimiter = ({ windowMs, max, message, actionHint }) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Return standard `RateLimit-*` headers
    legacyHeaders: false,  // Disable deprecated `X-RateLimit-*` headers
    statusCode: 429,
    handler: (req, res /*, next, options */) => {
      res.status(429).json({
        success: false,
        error: message,
        errorType: 'RATE_LIMITED',
        statusCode: 429,
        retryable: true,
        actionHint: actionHint || 'Please pause and try again in a few moments.',
      });
    },
    // In multi-instance / reverse proxy setups, trust proxy headers if configured
    validate: { xForwardedForHeader: false },
  });
};

/**
 * 1. Global API Limiter: General protection across all /api/v1 endpoints
 * Limit: 120 requests per 15 minutes per IP
 */
export const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: 'Too many requests received from your IP address. Please slow down.',
  actionHint: 'Normal API usage limit reached. Please wait a few minutes before continuing.',
});

/**
 * 2. AI Synthesis Limiter: Protects high-cost external LLM & multi-hop research endpoints
 * Limit: 15 generations per 15 minutes per IP
 */
export const aiGenerationLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Documentary AI generation rate limit reached for this IP.',
  actionHint: 'To prevent resource exhaustion, generations are limited to 15 per 15-minute window. Please wait before generating another script or research dossier.',
});

/**
 * 3. PDF Export Limiter: Protects memory & CPU intensive PDF streaming
 * Limit: 30 PDF downloads per 15 minutes per IP
 */
export const pdfExportLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'PDF export rate limit reached for this IP.',
  actionHint: 'Please wait a few minutes before downloading additional PDF briefs.',
});
