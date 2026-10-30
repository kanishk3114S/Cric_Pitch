// routes/research.routes.js
// Maps research endpoints to validators, rate limiters, and controller handlers.

import express from 'express';
import { generateResearch, exportResearchPDF } from '../controllers/research.controller.js';
import { validateResearchInput, validatePdfExportInput } from '../middleware/validator.js';
import { aiGenerationLimiter, pdfExportLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/v1/research/generate  → Multi-hop autonomous research agent
router.post('/generate', aiGenerationLimiter, validateResearchInput, generateResearch);

// POST /api/v1/research/export-pdf → Compile and stream research dossier as executive PDF
router.post('/export-pdf', pdfExportLimiter, validatePdfExportInput, exportResearchPDF);

export default router;
