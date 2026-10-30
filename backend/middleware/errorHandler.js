// middleware/errorHandler.js
// Centralized error handling middleware. Captures, logs, classifies, and formats all errors.

import { classifyError } from './errorClassifier.js';

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err?.message || err);

  const classified = classifyError(err);

  res.status(classified.statusCode).json({
    success: false,
    error: classified.message,
    errorType: classified.errorType,
    statusCode: classified.statusCode,
    retryable: classified.retryable,
    actionHint: classified.actionHint,
  });
};
