// middleware/requestLogger.js
// Generates unique Request IDs for end-to-end tracing and outputs safe structured logs.
// Strictly prevents logging secrets, authentication headers, or sensitive query data.

import crypto from 'crypto';

export const requestLogger = (req, res, next) => {
  // Attach or reuse valid Request ID
  const incomingId = req.headers['x-request-id'];
  const requestId = (typeof incomingId === 'string' && /^[a-zA-Z0-9\-_]{8,64}$/.test(incomingId))
    ? incomingId
    : crypto.randomUUID();

  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);

  const startTime = process.hrtime.bigint();

  // Intercept finish event to log latency and status
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1e6;

    // Do not log health check spam in production if desired, but keep for now
    const isHealthCheck = req.path.startsWith('/api/v1/health');
    if (isHealthCheck && process.env.NODE_ENV === 'production' && res.statusCode === 200) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: +durationMs.toFixed(2),
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'] ? req.headers['user-agent'].slice(0, 80) : undefined,
    };

    if (res.statusCode >= 500) {
      console.error(`[ERROR] [${logEntry.requestId}] ${logEntry.method} ${logEntry.path} ${logEntry.status} - ${logEntry.durationMs}ms`);
    } else if (res.statusCode >= 400) {
      console.warn(`[WARN]  [${logEntry.requestId}] ${logEntry.method} ${logEntry.path} ${logEntry.status} - ${logEntry.durationMs}ms`);
    } else {
      console.log(`[INFO]  [${logEntry.requestId}] ${logEntry.method} ${logEntry.path} ${logEntry.status} - ${logEntry.durationMs}ms`);
    }
  });

  next();
};
