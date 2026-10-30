// middleware/errorClassifier.js
// Classifies backend, upstream AI (Gemini), and search provider errors into structured, actionable categories.

function cleanErrorMessage(rawMsg) {
  if (!rawMsg) return 'An unexpected error occurred.';
  let msg = String(rawMsg);

  // If message contains embedded JSON like {"error":{"code":429,"message":"..."}}, extract clean message
  if (msg.includes('{"error":') || msg.includes('{"code":')) {
    try {
      const jsonStart = msg.indexOf('{');
      const jsonStr = msg.slice(jsonStart);
      const parsed = JSON.parse(jsonStr);
      if (parsed?.error?.message) {
        return parsed.error.message.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
      if (parsed?.message) {
        return parsed.message.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
    } catch {
      // fallback to regex extraction
      const match = msg.match(/"message"\s*:\s*"([^"]+)"/);
      if (match && match[1]) {
        return match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
    }
  }

  // Strip noisy prefixes
  msg = msg.replace(/^(Script generation failed[^:]*:\s*|Research synthesis failed[^:]*:\s*|All Gemini candidate models failed[^:]*:\s*)/i, '');
  return msg.trim();
}

export function classifyError(err) {
  const rawMessage = String(err?.message || err?.error || '');
  const status = Number(err?.statusCode || err?.status || err?.response?.status || (err?.code === 'ECONNABORTED' ? 504 : 500));
  const code = String(err?.code || err?.error?.code || '');
  const lowerMsg = rawMessage.toLowerCase();
  const cleanedMsg = cleanErrorMessage(rawMessage);

  // 1. Quota / Credits Exhausted / Billing / Free Tier
  if (
    (status === 429 && (
      lowerMsg.includes('quota') ||
      lowerMsg.includes('resource_exhausted') ||
      lowerMsg.includes('credit') ||
      lowerMsg.includes('exhausted') ||
      lowerMsg.includes('allowance') ||
      lowerMsg.includes('billing') ||
      lowerMsg.includes('plan')
    )) ||
    lowerMsg.includes('quota exceeded') ||
    lowerMsg.includes('resource has been exhausted') ||
    lowerMsg.includes('free-tier usage limit') ||
    lowerMsg.includes('insufficient credits') ||
    lowerMsg.includes('generate content requests per day limit exceeded') ||
    lowerMsg.includes('generate content input tokens per day limit exceeded')
  ) {
    return {
      statusCode: 429,
      errorType: 'QUOTA_EXHAUSTED',
      retryable: false,
      message: cleanedMsg || 'AI model quota or free-tier usage limit exhausted.',
      actionHint: 'Google AI Studio free-tier or plan quota has been exhausted. Check your API usage on Google AI Studio or configure a new API key in backend/.env.',
    };
  }

  // 2. Transient Rate Limit (Too many requests in short burst)
  if (
    status === 429 ||
    lowerMsg.includes('rate limit') ||
    lowerMsg.includes('too many requests') ||
    lowerMsg.includes('rate_limit_exceeded') ||
    lowerMsg.includes('tpm') ||
    lowerMsg.includes('rpm')
  ) {
    return {
      statusCode: 429,
      errorType: 'RATE_LIMITED',
      retryable: true,
      message: cleanedMsg || 'Provider rate limit exceeded. Too many requests sent in a short window.',
      actionHint: 'The LLM provider is throttling rapid requests. Please pause for 20-30 seconds, then retry.',
    };
  }

  // 3. Authentication & API Key Failure
  if (
    status === 401 ||
    status === 403 ||
    lowerMsg.includes('api key') ||
    lowerMsg.includes('unauthorized') ||
    lowerMsg.includes('api_key_invalid') ||
    lowerMsg.includes('forbidden') ||
    lowerMsg.includes('permission denied') ||
    lowerMsg.includes('missing. please set')
  ) {
    return {
      statusCode: status === 401 ? 401 : 403,
      errorType: 'AUTH_FAILURE',
      retryable: false,
      message: cleanedMsg || 'AI provider authentication failed. Missing or invalid API key.',
      actionHint: 'Check GEMINI_API_KEY or TAVILY_API_KEY in your backend/.env file and ensure it is valid and activated.',
    };
  }

  // 4. Timeouts & Connection Drops
  if (
    status === 408 ||
    status === 504 ||
    code === 'ECONNABORTED' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    lowerMsg.includes('timed out') ||
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('deadline exceeded')
  ) {
    return {
      statusCode: 504,
      errorType: 'TIMEOUT',
      retryable: true,
      message: cleanedMsg || 'Request timed out while connecting to upstream search or AI generation services.',
      actionHint: 'Network connection or model inference timed out. Please verify your connection and retry.',
    };
  }

  // 5. Input Validation Errors
  if (
    status === 400 ||
    lowerMsg.includes('required') ||
    lowerMsg.includes('validation') ||
    lowerMsg.includes('must be a non-empty')
  ) {
    return {
      statusCode: 400,
      errorType: 'VALIDATION_ERROR',
      retryable: false,
      message: cleanedMsg || 'Invalid generation request parameters.',
      actionHint: 'Please check your topic and key points inputs and try again.',
    };
  }

  // 6. Generic / Server-side Generation Failure
  return {
    statusCode: status >= 400 && status < 600 ? status : 500,
    errorType: 'SERVER_ERROR',
    retryable: true,
    message: cleanedMsg || 'An unexpected error occurred during synthesis on the server.',
    actionHint: 'The server or AI model encountered an unexpected failure. You can retry the operation.',
  };
}
