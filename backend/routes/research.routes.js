// routes/research.routes.js
// Defines what URL paths exist and which controller function handles them.

import express from 'express';
import { generateResearch, exportResearchPDF } from '../controllers/research.controller.js';

const router = express.Router();

// POST /api/v1/research/generate  → Run the research agent
router.post('/generate', generateResearch);

// POST /api/v1/research/export-pdf → Turn dossier JSON into a downloadable PDF
router.post('/export-pdf', exportResearchPDF);

export default router;
