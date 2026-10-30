// routes/script.routes.js
// Maps script generation endpoint to validators, rate limiters, and controller handlers.

import { Router } from 'express';
import { generateScriptController } from '../controllers/script.controller.js';
import { validateScriptInput } from '../middleware/validator.js';
import { aiGenerationLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/v1/scripts/generate → Hinglish Cadence-RAG Match Script Generation
router.post('/generate', aiGenerationLimiter, validateScriptInput, generateScriptController);

export default router;
