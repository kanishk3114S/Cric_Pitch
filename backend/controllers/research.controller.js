// controllers/research.controller.js
// Controllers are just the "traffic cop" — they receive the HTTP request,
// pull out what's needed, call the agent/service, and send back a response.

import { runResearchAgent } from '../researchAgent/agent.js';
import { streamDossierAsPDF } from '../services/pdf.service.js';
import { AppError } from '../utils/AppError.js';

// ── POST /api/v1/research/generate ────────────────────────────────────────
export const generateResearch = async (req, res, next) => {
  try {
    const { topic, preContext, researchLength, includeMedia } = req.sanitized || req.body;

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      throw new AppError('A research topic is required.', 400);
    }

    const options = {
      topic: topic.trim(),
      preContext: preContext || [],
      researchLength: researchLength || 500,
      includeMedia: includeMedia === true,
    };

    console.log(`🔎 Research started [Req: ${req.id || 'direct'}]: "${options.topic}"`);

    // Hand off to the agent
    const dossier = await runResearchAgent(options);

    res.status(200).json({
      success: true,
      data: { dossier },
      message: 'Research dossier compiled successfully.',
    });

  } catch (error) {
    next(error); // Passes error to our global errorHandler
  }
};


// ── POST /api/v1/research/export-pdf ──────────────────────────────────────
export const exportResearchPDF = async (req, res, next) => {
  try {
    const { dossier } = req.sanitized || req.body;

    if (!dossier) {
      throw new AppError('No dossier data provided for PDF export.', 400);
    }

    // Set headers so browser downloads it as a file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CricScript-Research.pdf"`);

    // Stream PDF directly into the response — no temp files saved on disk!
    streamDossierAsPDF(dossier, res);

  } catch (error) {
    next(error);
  }
};
