// middleware/validator.js
// Strict schema validation and boundary enforcement for all public API inputs.
// Prevents injection, malformed payloads, prototype pollution, and resource exhaustion attacks.

import { AppError } from '../utils/AppError.js';

/**
 * Sanitizes a string: trims whitespace and strips potentially harmful control characters.
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

/**
 * Checks for prototype pollution keys in user input.
 */
function checkPrototypePollution(obj) {
  if (!obj || typeof obj !== 'object') return;
  const keys = Object.getOwnPropertyNames(obj);
  for (const key of keys) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      throw new AppError('Illegal object property detected.', 400);
    }
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      checkPrototypePollution(obj[key]);
    }
  }
}

/**
 * Validates inputs for POST /api/v1/research/generate
 */
export const validateResearchInput = (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      throw new AppError('Request body must be a valid JSON object.', 400);
    }

    checkPrototypePollution(req.body);

    const { topic, preContext, researchLength, includeMedia } = req.body;

    // 1. Topic validation
    if (!topic || typeof topic !== 'string') {
      throw new AppError('A valid research topic string is required.', 400);
    }

    const cleanTopic = sanitizeString(topic);
    if (cleanTopic.length < 3) {
      throw new AppError('Topic must be at least 3 characters long.', 400);
    }
    if (cleanTopic.length > 300) {
      throw new AppError('Topic cannot exceed 300 characters.', 400);
    }

    // 2. PreContext validation (optional specific research angles)
    let cleanPreContext = [];
    if (preContext !== undefined && preContext !== null) {
      if (!Array.isArray(preContext)) {
        throw new AppError('preContext must be an array of focus points.', 400);
      }
      if (preContext.length > 8) {
        throw new AppError('preContext cannot contain more than 8 focus angles.', 400);
      }
      cleanPreContext = preContext.map((item, idx) => {
        if (typeof item !== 'string') {
          throw new AppError(`preContext angle at index ${idx} must be a string.`, 400);
        }
        const cleaned = sanitizeString(item);
        if (cleaned.length > 250) {
          throw new AppError(`preContext angle at index ${idx} exceeds 250 character limit.`, 400);
        }
        return cleaned;
      }).filter(Boolean);
    }

    // 3. Research Length validation
    let cleanLength = 500;
    if (researchLength !== undefined) {
      const parsedLength = parseInt(researchLength, 10);
      if (isNaN(parsedLength) || parsedLength < 50 || parsedLength > 1000) {
        throw new AppError('researchLength must be an integer between 50 and 1000.', 400);
      }
      cleanLength = parsedLength;
    }

    // 4. Include Media validation
    const cleanIncludeMedia = includeMedia === true;

    // Attach sanitized values to request
    req.sanitized = {
      topic: cleanTopic,
      preContext: cleanPreContext,
      researchLength: cleanLength,
      includeMedia: cleanIncludeMedia,
    };

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Validates inputs for POST /api/v1/scripts/generate
 */
export const validateScriptInput = (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      throw new AppError('Request body must be a valid JSON object.', 400);
    }

    checkPrototypePollution(req.body);

    const { topic, keyPoints, researchDossier } = req.body;

    // 1. Topic validation
    if (!topic || typeof topic !== 'string') {
      throw new AppError('Topic is required and must be a non-empty string.', 400);
    }

    const cleanTopic = sanitizeString(topic);
    if (cleanTopic.length < 3) {
      throw new AppError('Topic must be at least 3 characters long.', 400);
    }
    if (cleanTopic.length > 300) {
      throw new AppError('Topic cannot exceed 300 characters.', 400);
    }

    // 2. KeyPoints validation
    let cleanKeyPoints = [];
    if (keyPoints !== undefined && keyPoints !== null) {
      if (!Array.isArray(keyPoints)) {
        throw new AppError('keyPoints must be an array of narrative turning points.', 400);
      }
      if (keyPoints.length > 10) {
        throw new AppError('keyPoints cannot contain more than 10 narrative points.', 400);
      }
      cleanKeyPoints = keyPoints.map((pt, idx) => {
        if (typeof pt !== 'string') {
          throw new AppError(`keyPoint at index ${idx} must be a string.`, 400);
        }
        const cleaned = sanitizeString(pt);
        if (cleaned.length > 350) {
          throw new AppError(`keyPoint at index ${idx} exceeds 350 character limit.`, 400);
        }
        return cleaned;
      }).filter(Boolean);
    }

    // 3. ResearchDossier validation (optional context object from Engine 01)
    let cleanDossier = null;
    if (researchDossier && typeof researchDossier === 'object') {
      // Basic sanity check to prevent gigantic injected payloads
      const dossierStr = JSON.stringify(researchDossier);
      if (dossierStr.length > 100000) {
        throw new AppError('researchDossier context payload is too large (max 100KB).', 400);
      }
      cleanDossier = researchDossier;
    }

    req.sanitized = {
      topic: cleanTopic,
      keyPoints: cleanKeyPoints,
      researchDossier: cleanDossier,
    };

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Validates inputs for POST /api/v1/research/export-pdf
 */
export const validatePdfExportInput = (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      throw new AppError('Request body must be a valid JSON object.', 400);
    }

    checkPrototypePollution(req.body);

    const { dossier } = req.body;
    if (!dossier || typeof dossier !== 'object') {
      throw new AppError('A valid dossier object is required for PDF export.', 400);
    }

    if (!dossier.topic || typeof dossier.topic !== 'string') {
      throw new AppError('Dossier topic is missing or invalid.', 400);
    }

    // Guard against memory explosion
    const dossierStr = JSON.stringify(dossier);
    if (dossierStr.length > 250000) {
      throw new AppError('Dossier payload exceeds maximum size allowable for PDF export (250KB).', 400);
    }

    req.sanitized = { dossier };
    next();
  } catch (err) {
    next(err);
  }
};
