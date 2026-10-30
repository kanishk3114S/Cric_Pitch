import { generateHinglishScript } from '../scriptAgent/script.agent.js';
import { AppError } from '../utils/AppError.js';

export async function generateScriptController(req, res, next) {
  try {
    const { topic, keyPoints = [], researchDossier = null } = req.sanitized || req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      throw new AppError('Topic is required and must be a non-empty string.', 400);
    }

    console.log(`🎬 Script generation started [Req: ${req.id || 'direct'}]: "${topic}"`);

    const scriptResult = await generateHinglishScript({
      topic: topic.trim(),
      keyPoints: Array.isArray(keyPoints) ? keyPoints : [keyPoints].filter(Boolean),
      researchDossier
    });

    res.status(200).json({
      success: true,
      message: 'Hinglish match script successfully generated',
      data: scriptResult
    });
  } catch (error) {
    next(error);
  }
}
