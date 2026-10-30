// server.js — Production-hardened entry point for CricScript AI backend.
// Implements strict CORS, Helmet security headers, tiered rate limiting,
// request ID tracing, structured logging, input validation, and graceful shutdown.

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to current working directory if different

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import researchRoutes from './routes/research.routes.js';
import scriptRoutes from './routes/script.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// In multi-instance or cloud reverse proxy deployments (Render, Vercel, Cloudflare),
// trust the first hop proxy so req.ip and rate-limit counters accurately reflect client IP.
app.set('trust proxy', 1);

// Disable 'X-Powered-By: Express' to avoid technology fingerprinting
app.disable('x-powered-by');

// ── 1. Security Headers (Helmet) ───────────────────────────────────────────
app.use(
  helmet({
    // Content-Security-Policy is set on the Vercel frontend for HTML rendering.
    // Setting false here avoids interfering with JSON API transport while keeping
    // X-Content-Type-Options: nosniff, X-Frame-Options: DENY, and HSTS enabled.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ── 2. Strict CORS Configuration ───────────────────────────────────────────
// Builds the list of allowed frontend origins from environment or local development defaults.
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:3000',
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach((orig) => {
    const trimmed = orig.trim().replace(/\/$/, '');
    if (trimmed) allowedOrigins.push(trimmed);
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server health checks, curl)
      if (!origin) return callback(null, true);

      // Check against explicit allowed list
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === origin) return true;
        // Support Vercel preview deployment wildcard if configured (e.g. *.vercel.app)
        if (allowed.includes('*')) {
          const regex = new RegExp('^' + allowed.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
          return regex.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        return callback(null, true);
      }

      console.warn(`[CORS] Rejected unauthorized origin: "${origin}"`);
      return callback(new Error('Cross-Origin Request Blocked: Origin not authorized by CricScript API.'), false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Request-ID', 'Accept', 'Authorization'],
    // Anonymous stateless architecture: No credentials or cookies required
    credentials: false,
    maxAge: 86400, // Cache preflight response for 24 hours
  })
);

// ── 3. Observability & Request ID Tracing ──────────────────────────────────
app.use(requestLogger);

// ── 4. Payload Size Limits & JSON Parsing ──────────────────────────────────
// Strictly caps request size to prevent memory-exhaustion and large payload DoS
app.use(express.json({ limit: '150kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

// ── 5. Global API Rate Limiting ────────────────────────────────────────────
// Apply 120 req/15min general guardrail to all /api/v1 routes
app.use('/api/v1', globalLimiter);

// ── 6. Liveness and Readiness Health Checks ────────────────────────────────
/**
 * Liveness probe for Render / Docker orchestration: verifies process is alive.
 */
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: +process.uptime().toFixed(2),
    timestamp: new Date().toISOString(),
    service: 'cricscript-ai-backend',
  });
});

/**
 * Readiness probe: checks if essential upstream API keys are present.
 * Does NOT expose secret values.
 */
app.get('/api/v1/ready', (req, res) => {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_RESEARCH);
  const tavilyConfigured = Boolean(process.env.TAVILY_API_KEY);
  const pineconeConfigured = Boolean(process.env.PINECONE_API_KEY);

  const isReady = geminiConfigured; // Tavily & Pinecone have built-in graceful fallbacks

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ready' : 'degraded',
    checks: {
      geminiLlm: geminiConfigured ? 'configured' : 'missing',
      tavilySearch: tavilyConfigured ? 'configured' : 'missing_or_optional',
      pineconeIndex: pineconeConfigured ? 'configured' : 'local_archive_fallback',
    },
    stateless: true,
  });
});

// ── 7. Business Logic Routes ───────────────────────────────────────────────
app.use('/api/v1/research', researchRoutes);
app.use('/api/v1/scripts', scriptRoutes);

// ── 8. Unknown API Route 404 Handler ───────────────────────────────────────
app.use('/api/v1/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
    errorType: 'NOT_FOUND',
    statusCode: 404,
    retryable: false,
    actionHint: 'Please verify the API endpoint path. Supported routes: /api/v1/research/generate, /api/v1/research/export-pdf, /api/v1/scripts/generate.',
  });
});

// ── 9. Global Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

// ── 10. Server Startup & Graceful Shutdown ─────────────────────────────────
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ CricScript backend running on http://${HOST}:${PORT}`);
  console.log(`🔒 Security posture: Helmet active, strict CORS, tiered rate limiting, stateless mode`);
});

// Graceful shutdown handling for Render container restarts and SIGTERM signals
const handleShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.log('✅ HTTP server closed. Process terminating cleanly.');
    process.exit(0);
  });

  // Force close after 10 seconds if connections refuse to terminate
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  handleShutdown('uncaughtException');
});
